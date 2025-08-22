// مدل کاربر
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

class User {
  // ایجاد کاربر جدید
  static async create(userData) {
    const { email, username, password, firstName, lastName } = userData;
    
    // هش کردن رمز عبور
    const hashedPassword = await bcrypt.hash(password, 12);
    
    return await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });
  }

  // پیدا کردن کاربر با ایمیل
  static async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  // پیدا کردن کاربر با نام کاربری
  static async findByUsername(username) {
    return await prisma.user.findUnique({
      where: { username },
    });
  }

  // پیدا کردن کاربر با ID
  static async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });
  }

  // بررسی رمز عبور
  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // به‌روزرسانی کاربر
  static async update(id, updateData) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }
    
    return await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        updatedAt: true,
      },
    });
  }

  // حذف کاربر
  static async delete(id) {
    return await prisma.user.delete({
      where: { id },
    });
  }

  // بررسی وجود کاربر با ایمیل یا نام کاربری
  static async exists(email, username) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });
    return !!user;
  }
}

module.exports = User;
