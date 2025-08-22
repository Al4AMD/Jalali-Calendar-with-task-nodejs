// استیک سرور اصلی پروژه
const fastify = require('fastify')({ 
  logger: true,
  ignoreTrailingSlash: true // Fix trailing slash issue
});
const path = require('path');

// Load environment variables
require('dotenv').config();

// Register plugins
async function start() {
  try {
    // Static files
    await fastify.register(require('@fastify/static'), {
      root: path.join(__dirname, 'dist'),
      prefix: '/static/',
    });

    // View engine
    await fastify.register(require('@fastify/view'), {
      engine: {
        ejs: require('ejs'),
      },
      root: path.join(__dirname, 'views'),
    });

    // Cookie plugin (must be before JWT to parse cookies)
    await fastify.register(require('@fastify/cookie'));

    // JWT plugin configured to read token from cookie
    await fastify.register(require('@fastify/jwt'), {
      secret: process.env.JWT_SECRET,
      cookie: {
        cookieName: 'token'
      }
    });
 
    // Import middleware
    const { authenticateView, redirectIfAuthenticated } = require('./middleware/auth');

    // Routes
    fastify.get('/', { preHandler: authenticateView }, async (request, reply) => {
      return reply.view('index.ejs', { 
        title: 'تقویم جلالی',
        user: request.user
      });
    });

    fastify.get('/login', { preHandler: redirectIfAuthenticated }, async (request, reply) => {
      return reply.view('auth/login.ejs', { title: 'ورود' });
    });

    fastify.get('/register', { preHandler: redirectIfAuthenticated }, async (request, reply) => {
      return reply.view('auth/register.ejs', { title: 'ثبت نام' });
    });

    // Favicon route to prevent 404 errors
    fastify.get('/favicon.ico', async (request, reply) => {
      reply.code(204).send();
    });

    // API routes
    await fastify.register(require('./controllers/authController'), { prefix: '/api/auth' });
    await fastify.register(require('./controllers/taskController'), { prefix: '/api/tasks' });

    // Start server
    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 سرور روی پورت ${port} راه‌اندازی شد`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
