// کنترلر احراز هویت
const User = require('../models/User');

async function authController(fastify, options) {
  
  // ثبت نام کاربر جدید
  fastify.post('/register', async (request, reply) => {
    try {
      const { email, username, password, confirmPassword, firstName, lastName } = request.body;

      // اعتبارسنجی ورودی‌ها
      if (!email || !username || !password || !confirmPassword) {
        return reply.status(400).send({
          success: false,
          message: 'لطفا همه فیلدهای اجباری را پر کنید'
        });
      }

      if (password !== confirmPassword) {
        return reply.status(400).send({
          success: false,
          message: 'رمزهای عبور یکسان نیستند'
        });
      }

      if (password.length < 6) {
        return reply.status(400).send({
          success: false,
          message: 'رمز عبور باید حداقل ۶ کاراکتر باشد'
        });
      }

      // بررسی وجود کاربر
      const userExists = await User.exists(email, username);
      if (userExists) {
        return reply.status(400).send({
          success: false,
          message: 'کاربری با این ایمیل یا نام کاربری قبلا ثبت شده است'
        });
      }

      // ایجاد کاربر جدید
      const user = await User.create({
        email,
        username,
        password,
        firstName,
        lastName
      });

      // ایجاد JWT token
      const token = fastify.jwt.sign({ 
        id: user.id, 
        email: user.email, 
        username: user.username 
      });

      // تنظیم کوکی
      reply.setCookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 روز
      });

      return reply.send({
        success: true,
        message: 'ثبت نام با موفقیت انجام شد',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });

    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        message: 'خطای سرور در ثبت نام'
      });
    }
  });

  // ورود کاربر
  fastify.post('/login', async (request, reply) => {
    try {
      const { emailOrUsername, password } = request.body;

      // اعتبارسنجی ورودی‌ها
      if (!emailOrUsername || !password) {
        return reply.status(400).send({
          success: false,
          message: 'لطفا ایمیل/نام کاربری و رمز عبور را وارد کنید'
        });
      }

      // پیدا کردن کاربر
      let user = await User.findByEmail(emailOrUsername);
      if (!user) {
        user = await User.findByUsername(emailOrUsername);
      }

      if (!user) {
        return reply.status(401).send({
          success: false,
          message: 'ایمیل/نام کاربری یا رمز عبور اشتباه است'
        });
      }

      // بررسی رمز عبور
      const isPasswordValid = await User.validatePassword(password, user.password);
      if (!isPasswordValid) {
        return reply.status(401).send({
          success: false,
          message: 'ایمیل/نام کاربری یا رمز عبور اشتباه است'
        });
      }

      // ایجاد JWT token
      const token = fastify.jwt.sign({ 
        id: user.id, 
        email: user.email, 
        username: user.username 
      });

      // تنظیم کوکی
      reply.setCookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 روز
      });

      return reply.send({
        success: true,
        message: 'ورود با موفقیت انجام شد',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });

    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        message: 'خطای سرور در ورود'
      });
    }
  });

  // خروج کاربر
  fastify.post('/logout', async (request, reply) => {
    try {
      // پاک کردن کوکی
      reply.clearCookie('token');

      return reply.send({
        success: true,
        message: 'خروج با موفقیت انجام شد'
      });

    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        message: 'خطای سرور در خروج'
      });
    }
  });

  // دریافت اطلاعات کاربر فعلی
  fastify.get('/me', {
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.status(401).send({
          success: false,
          message: 'لطفا ابتدا وارد شوید'
        });
      }
    }
  }, async (request, reply) => {
    try {
      const user = await User.findById(request.user.id);
      
      if (!user) {
        return reply.status(404).send({
          success: false,
          message: 'کاربر پیدا نشد'
        });
      }

      return reply.send({
        success: true,
        user
      });

    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        message: 'خطای سرور'
      });
    }
  });

  // به‌روزرسانی پروفایل
  fastify.put('/profile', {
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.status(401).send({
          success: false,
          message: 'لطفا ابتدا وارد شوید'
        });
      }
    }
  }, async (request, reply) => {
    try {
      const { firstName, lastName, email, username } = request.body;
      const userId = request.user.id;

      // بررسی وجود ایمیل یا نام کاربری جدید
      if (email || username) {
        const currentUser = await User.findById(userId);
        
        if (email && email !== currentUser.email) {
          const emailExists = await User.findByEmail(email);
          if (emailExists) {
            return reply.status(400).send({
              success: false,
              message: 'این ایمیل قبلا استفاده شده است'
            });
          }
        }

        if (username && username !== currentUser.username) {
          const usernameExists = await User.findByUsername(username);
          if (usernameExists) {
            return reply.status(400).send({
              success: false,
              message: 'این نام کاربری قبلا استفاده شده است'
            });
          }
        }
      }

      const updatedUser = await User.update(userId, {
        firstName,
        lastName,
        email,
        username
      });

      return reply.send({
        success: true,
        message: 'پروفایل با موفقیت به‌روزرسانی شد',
        user: updatedUser
      });

    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        message: 'خطای سرور در به‌روزرسانی پروفایل'
      });
    }
  });

  // تغییر رمز عبور
  fastify.put('/change-password', {
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.status(401).send({
          success: false,
          message: 'لطفا ابتدا وارد شوید'
        });
      }
    }
  }, async (request, reply) => {
    try {
      const { currentPassword, newPassword, confirmPassword } = request.body;
      const userId = request.user.id;

      // اعتبارسنجی
      if (!currentPassword || !newPassword || !confirmPassword) {
        return reply.status(400).send({
          success: false,
          message: 'لطفا همه فیلدها را پر کنید'
        });
      }

      if (newPassword !== confirmPassword) {
        return reply.status(400).send({
          success: false,
          message: 'رمزهای عبور جدید یکسان نیستند'
        });
      }

      if (newPassword.length < 6) {
        return reply.status(400).send({
          success: false,
          message: 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد'
        });
      }

      // بررسی رمز عبور فعلی
      const user = await User.findByEmail(request.user.email);
      const isCurrentPasswordValid = await User.validatePassword(currentPassword, user.password);
      
      if (!isCurrentPasswordValid) {
        return reply.status(400).send({
          success: false,
          message: 'رمز عبور فعلی اشتباه است'
        });
      }

      // تغییر رمز عبور
      await User.update(userId, { password: newPassword });

      return reply.send({
        success: true,
        message: 'رمز عبور با موفقیت تغییر کرد'
      });

    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        message: 'خطای سرور در تغییر رمز عبور'
      });
    }
  });
}

module.exports = authController;
