// کنترلر تسک‌ها
const Task = require('../models/Task');

async function taskController(fastify, options) {

  // middleware برای بررسی احراز هویت
  const authenticate = async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.status(401).send({
        success: false,
        message: 'لطفا ابتدا وارد شوید'
      });
    }
  };

  // ایجاد تسک جدید
  fastify.post('/', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { title, description, date, startTime, endTime, priority } = request.body;
      const userId = request.user.id;

      // اعتبارسنجی
      if (!title || !date) {
        return reply.status(400).send({
          success: false,
          message: 'عنوان و تاریخ اجباری هستند'
        });
      }

      const task = await Task.create({
        title,
        description,
        date,
        startTime,
        endTime,
        priority: priority || 'MEDIUM',
        userId
      });

      return reply.send({
        success: true,
        message: 'تسک با موفقیت ایجاد شد',
        task
      });

    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        message: 'خطای سرور در ایجاد تسک'
      });
    }
  });

  // دریافت همه تسک‌های کاربر
  fastify.get('/', { preHandler: authenticate }, async (request, reply) => {
    try {
      const userId = request.user.id;
      const tasks = await Task.findAllByUser(userId);

      // تبدیل تاریخ‌ها به جلالی
      const tasksWithPersianDates = tasks.map(task => ({
        ...task,
        persianDate: Task.formatDateToPersian(task.date),
        dateTime: Task.formatDateTime(task.date, task.startTime)
      }));

      return reply.send({
        success: true,
        tasks: tasksWithPersianDates
      });

    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        message: 'خطای سرور در دریافت تسک‌ها'
      });
    }
  });

  // دریافت تسک‌های یک روز خاص
  fastify.get('/date/:date', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { date } = request.params;
      const userId = request.user.id;

      const tasks = await Task.findByDate(date, userId);

      const tasksWithPersianDates = tasks.map(task => ({
        ...task,
        persianDate: Task.formatDateToPersian(task.date),
        dateTime: Task.formatDateTime(task.date, task.startTime)
      }));

      return reply.send({
        success: true,
        tasks: tasksWithPersianDates
      });

    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        message: 'خطای سرور در دریافت تسک‌های روز'
      });
    }
  });

  // دریافت تسک‌های یک هفته
  fastify.get('/week/:weekStart', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { weekStart } = request.params;
      const userId = request.user.id;

      const tasks = await Task.findByWeek(weekStart, userId);

      const tasksWithPersianDates = tasks.map(task => ({
        ...task,
        persianDate: Task.formatDateToPersian(task.date),
        dateTime: Task.formatDateTime(task.date, task.startTime)
      }));

      return reply.send({
        success: true,
        tasks: tasksWithPersianDates
      });

    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        message: 'خطای سرور در دریافت تسک‌های هفته'
      });
    }
  });

  // دریافت تسک‌های یک ماه
  fastify.get('/month/:year/:month', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { year, month } = request.params;
      const userId = request.user.id;

      const tasks = await Task.findByMonth(year, month, userId);

      const tasksWithPersianDates = tasks.map(task => ({
        ...task,
        persianDate: Task.formatDateToPersian(task.date),
        dateTime: Task.formatDateTime(task.date, task.startTime)
      }));

      return reply.send({
        success: true,
        tasks: tasksWithPersianDates
      });

    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        message: 'خطای سرور در دریافت تسک‌های ماه'
      });
    }
  });

  // دریافت یک تسک خاص
  fastify.get('/:id', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { id } = request.params;
      const userId = request.user.id;

      const task = await Task.findById(parseInt(id), userId);

      if (!task) {
        return reply.status(404).send({
          success: false,
          message: 'تسک پیدا نشد'
        });
      }

      const taskWithPersianDate = {
        ...task,
        persianDate: Task.formatDateToPersian(task.date),
        dateTime: Task.formatDateTime(task.date, task.startTime)
      };

      return reply.send({
        success: true,
        task: taskWithPersianDate
      });

    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        message: 'خطای سرور در دریافت تسک'
      });
    }
  });

  // به‌روزرسانی تسک
  fastify.put('/:id', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { title, description, date, startTime, endTime, priority } = request.body;
      const userId = request.user.id;

      // بررسی وجود تسک
      const existingTask = await Task.findById(parseInt(id), userId);
      if (!existingTask) {
        return reply.status(404).send({
          success: false,
          message: 'تسک پیدا نشد'
        });
      }

      const updatedTask = await Task.update(parseInt(id), userId, {
        title,
        description,
        date,
        startTime,
        endTime,
        priority
      });

      const taskWithPersianDate = {
        ...updatedTask,
        persianDate: Task.formatDateToPersian(updatedTask.date),
        dateTime: Task.formatDateTime(updatedTask.date, updatedTask.startTime)
      };

      return reply.send({
        success: true,
        message: 'تسک با موفقیت به‌روزرسانی شد',
        task: taskWithPersianDate
      });

    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        message: 'خطای سرور در به‌روزرسانی تسک'
      });
    }
  });

  // تغییر وضعیت تکمیل تسک
  fastify.patch('/:id/toggle', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { id } = request.params;
      const userId = request.user.id;

      const updatedTask = await Task.toggleComplete(parseInt(id), userId);

      if (!updatedTask) {
        return reply.status(404).send({
          success: false,
          message: 'تسک پیدا نشد'
        });
      }

      const taskWithPersianDate = {
        ...updatedTask,
        persianDate: Task.formatDateToPersian(updatedTask.date),
        dateTime: Task.formatDateTime(updatedTask.date, updatedTask.startTime)
      };

      return reply.send({
        success: true,
        message: updatedTask.isCompleted ? 'تسک تکمیل شد' : 'تسک به حالت انجام نشده تغییر کرد',
        task: taskWithPersianDate
      });

    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        message: 'خطای سرور در تغییر وضعیت تسک'
      });
    }
  });

  // حذف تسک
  fastify.delete('/:id', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { id } = request.params;
      const userId = request.user.id;

      const result = await Task.delete(parseInt(id), userId);

      if (result.count === 0) {
        return reply.status(404).send({
          success: false,
          message: 'تسک پیدا نشد'
        });
      }

      return reply.send({
        success: true,
        message: 'تسک با موفقیت حذف شد'
      });

    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        message: 'خطای سرور در حذف تسک'
      });
    }
  });

  // دریافت آمار تسک‌ها
  fastify.get('/stats/overview', { preHandler: authenticate }, async (request, reply) => {
    try {
      const userId = request.user.id;
      const stats = await Task.getStats(userId);

      return reply.send({
        success: true,
        stats
      });

    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        message: 'خطای سرور در دریافت آمار'
      });
    }
  });
}

module.exports = taskController;
