// میدل‌ویر احراز هویت
const User = require('../models/User');

// middleware برای بررسی احراز هویت
async function authenticate(request, reply) {
  try {
    // بررسی وجود توکن در کوکی
    const token = request.cookies.token;
    
    if (!token) {
      return reply.status(401).send({
        success: false,
        message: 'لطفا ابتدا وارد شوید'
      });
    }

    // تأیید توکن
    const decoded = await request.jwtVerify();
    
    // بررسی وجود کاربر
    const user = await User.findById(decoded.id);
    if (!user) {
      return reply.status(401).send({
        success: false,
        message: 'کاربر پیدا نشد'
      });
    }

    // اضافه کردن اطلاعات کاربر به request
    request.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
    };

  } catch (err) {
    return reply.status(401).send({
      success: false,
      message: 'توکن نامعتبر است'
    });
  }
}

// middleware برای بررسی احراز هویت در صفحات
async function authenticateView(request, reply) {
  try {
    const token = request.cookies.token;
    
    if (!token) {
      return reply.redirect('/login');
    }

    const decoded = await request.jwtVerify();
    const user = await User.findById(decoded.id);
    
    if (!user) {
      reply.clearCookie('token');
      return reply.redirect('/login');
    }

    request.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
    };

  } catch (err) {
    reply.clearCookie('token');
    return reply.redirect('/login');
  }
}

// middleware برای بررسی عدم احراز هویت (برای صفحات ورود و ثبت نام)
async function redirectIfAuthenticated(request, reply) {
  try {
    const token = request.cookies.token;
    
    if (token) {
      const decoded = await request.jwtVerify();
      const user = await User.findById(decoded.id);
      
      if (user) {
        return reply.redirect('/');
      }
    }
  } catch (err) {
    // اگر توکن نامعتبر باشد، کوکی را پاک کن
    reply.clearCookie('token');
  }
}

module.exports = {
  authenticate,
  authenticateView,
  redirectIfAuthenticated
};
