// مدل تسک
const { PrismaClient } = require('@prisma/client');
const moment = require('moment-jalaali');

const prisma = new PrismaClient();

class Task {
  // ایجاد تسک جدید
  static async create(taskData) {
    const { title, description, date, startTime, endTime, priority, userId } = taskData;
    
    // تبدیل تاریخ جلالی به میلادی
    const gregorianDate = moment(date, 'jYYYY/jMM/jDD').toDate();
    
    return await prisma.task.create({
      data: {
        title,
        description,
        date: gregorianDate,
        startTime,
        endTime,
        priority,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  // پیدا کردن تسک با ID
  static async findById(id, userId) {
    return await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  // دریافت همه تسک‌های یک کاربر
  static async findAllByUser(userId) {
    return await prisma.task.findMany({
      where: { userId },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  // دریافت تسک‌های یک روز خاص
  static async findByDate(date, userId) {
    // تبدیل تاریخ جلالی به میلادی
    const gregorianDate = moment(date, 'jYYYY/jMM/jDD');
    const startOfDay = gregorianDate.clone().startOf('day').toDate();
    const endOfDay = gregorianDate.clone().endOf('day').toDate();
    
    return await prisma.task.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: [
        { startTime: 'asc' },
        { priority: 'desc' },
      ],
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  // دریافت تسک‌های یک هفته
  static async findByWeek(weekStart, userId) {
    const gregorianStart = moment(weekStart, 'jYYYY/jMM/jDD');
    const startOfWeek = gregorianStart.clone().startOf('day').toDate();
    const endOfWeek = gregorianStart.clone().add(6, 'days').endOf('day').toDate();
    
    return await prisma.task.findMany({
      where: {
        userId,
        date: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  // دریافت تسک‌های یک ماه
  static async findByMonth(year, month, userId) {
    const gregorianStart = moment(`${year}/${month}/01`, 'jYYYY/jMM/jDD');
    const startOfMonth = gregorianStart.clone().startOf('month').toDate();
    const endOfMonth = gregorianStart.clone().endOf('month').toDate();
    
    return await prisma.task.findMany({
      where: {
        userId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  // به‌روزرسانی تسک
  static async update(id, userId, updateData) {
    if (updateData.date) {
      updateData.date = moment(updateData.date, 'jYYYY/jMM/jDD').toDate();
    }
    
    return await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  // تغییر وضعیت تکمیل تسک
  static async toggleComplete(id, userId) {
    const task = await this.findById(id, userId);
    if (!task) return null;
    
    return await prisma.task.update({
      where: { id },
      data: {
        isCompleted: !task.isCompleted,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  // حذف تسک
  static async delete(id, userId) {
    return await prisma.task.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }

  // دریافت آمار تسک‌ها
  static async getStats(userId) {
    const total = await prisma.task.count({
      where: { userId },
    });
    
    const completed = await prisma.task.count({
      where: {
        userId,
        isCompleted: true,
      },
    });
    
    const pending = total - completed;
    
    const today = moment().format('jYYYY/jMM/jDD');
    const todayTasks = await this.findByDate(today, userId);
    
    return {
      total,
      completed,
      pending,
      todayTasks: todayTasks.length,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }

  // تبدیل تاریخ میلادی به جلالی برای نمایش
  static formatDateToPersian(date) {
    return moment(date).format('jYYYY/jMM/jDD');
  }

  // تبدیل تاریخ و زمان برای نمایش
  static formatDateTime(date, time) {
    const persianDate = moment(date).format('jYYYY/jMM/jDD');
    return time ? `${persianDate} - ${time}` : persianDate;
  }
}

module.exports = Task;
