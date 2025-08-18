import { Telegraf } from 'telegraf';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import express from 'express'

// Инициализация приложения и конфигурации
dotenv.config();
const app = express();
app.use(express.json());

// Проверка обязательных переменных окружения
const requiredEnvVars = [
  'TELEGRAM_BOT_TOKEN', 
  'JWT_SECRET', 
  'DB_NAME', 
  'DB_USER', 
  'DB_PASSWORD', 
  'DB_HOST', 
  'DOMAIN', 
  'FRONTEND_URL'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Инициализация базы данных
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Проверка подключения к БД с повторными попытками
const connectToDatabase = async (attempts = 5) => {
  for (let i = 1; i <= attempts; i++) {
    try {
      await sequelize.authenticate();
      console.log('Database connection established');
      return;
    } catch (err) {
      console.error(`Database connection attempt ${i} failed:`, err.message);
      if (i === attempts) {
        console.error('Unable to connect to the database after multiple attempts');
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Инициализация бота
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const userStates = new Map();

// Обработка команды /start
bot.start(async (ctx) => {
  try {
    const chatId = ctx.message.chat.id;
    userStates.set(chatId, { step: 'awaiting_phone' });
    await ctx.reply('📱 Пожалуйста, введите ваш номер телефона в формате 89112223344');
  } catch (error) {
    console.error('Ошибка в обработчике start:', error);
  }
});

// Обработка команды /getlink
bot.command('getlink', async (ctx) => {
  try {
    const chatId = ctx.message.chat.id;
    
    // Проверяем, привязан ли уже аккаунт
    const [user] = await sequelize.query(`
      SELECT id FROM users WHERE telegram_chat_id = :chatId
    `, {
      replacements: { chatId },
      type: sequelize.QueryTypes.SELECT
    });

    if (!user) {
      await ctx.reply('🤷‍♂️ Ваш Telegram не привязан к аккаунту. Используйте /start для привязки');
      return;
    }

    // Генерация нового JWT токена
    const newToken = jwt.sign(
      { 
        userId: user.id,
        chatId: chatId,
        exp: Math.floor(Date.now() / 1000) + 900 // 15 минут
      },
      process.env.JWT_SECRET
    );

    // Обновляем temporary_token в БД
    await sequelize.query(`
      UPDATE users 
      SET temporary_token = :token
      WHERE telegram_chat_id = :chatId
    `, {
      replacements: { token: newToken, chatId },
      type: sequelize.QueryTypes.UPDATE
    });

    const personalAccountLink = `${process.env.FRONTEND_URL}/personalaccount?token=${newToken}`;
    
    await ctx.replyWithHTML(
      '🔑 Новая ссылка для входа в личный кабинет (действует 15 минут):\n\n' +
      `<a href="${personalAccountLink}">🔗 Перейти в личный кабинет</a>`
    );
  } catch (error) {
    console.error('Ошибка в команде getlink:', error);
    await ctx.reply('🚨 Произошла ошибка. Попробуйте позже');
  }
});

// Обработка ввода номера телефона
bot.on('text', async (ctx) => {
  const chatId = ctx.message.chat.id;
  const userState = userStates.get(chatId);
  
  if (userState?.step === 'awaiting_phone') {
    const phone = String(ctx.message.text.trim()).replace(/\D/g, '');
    
    if (!/^89\d{9}$/.test(phone)) {
      await ctx.reply('❌ Неверный формат. Введите номер в формате 89112223344');
      return;
    }

    try {
      const [user] = await sequelize.query(`
        SELECT id FROM users WHERE phone = :phone
      `, {
        replacements: { phone },
        type: sequelize.QueryTypes.SELECT
      });

      if (!user) {
        await ctx.reply('🔍 Пользователь с таким номером не найден');
        return;
      }

      // Проверка на существующую привязку
      const [existingLink] = await sequelize.query(`
        SELECT id FROM users WHERE phone = :phone AND telegram_chat_id IS NOT NULL
      `, {
        replacements: { phone },
        type: sequelize.QueryTypes.SELECT
      });

      if (existingLink) {
        await ctx.reply('⚠️ Этот номер уже привязан к другому аккаунту');
        return;
      }

      // Генерация JWT токена
      const token = jwt.sign(
        { 
          userId: user.id,
          chatId: chatId,
          exp: Math.floor(Date.now() / 1000) + 900 // 15 минут
        },
        process.env.JWT_SECRET
      );

      // Обновляем chat_id и temporary_token в БД
      await sequelize.query(`
        UPDATE users 
        SET 
          telegram_chat_id = :chatId,
          temporary_token = :token
        WHERE phone = :phone
      `, {
        replacements: { chatId, phone, token },
        type: sequelize.QueryTypes.UPDATE
      });

      const personalAccountLink = `${process.env.FRONTEND_URL}/personalaccount?token=${token}`;
      
      await ctx.replyWithHTML(
        '✅ Отлично! Ваш Telegram успешно привязан\n\n' +
        `<a href="${personalAccountLink}">🔗 Перейти в личный кабинет</a>`
      );
    } catch (error) {
      console.error('Ошибка:', error);
      await ctx.reply('🚨 Произошла ошибка. Попробуйте позже');
    } finally {
      userStates.delete(chatId);
    }
  }
});

bot.catch((err, ctx) => {
  console.error('Ошибка в боте:', err);
});

// Настройка обработки ошибок
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Настройка команд бота
bot.telegram.setMyCommands([
  { command: 'start', description: 'Привязать Telegram к аккаунту' },
  { command: 'getlink', description: 'Получить ссылку для входа' },
]);

// Конфигурация сервера
const PORT = 7000;
const WEBHOOK_PATH = `/webhook/${process.env.TELEGRAM_BOT_TOKEN}`;

const startServer = async () => {
  try {
    await connectToDatabase();
    
    if (process.env.NODE_ENV === 'production') {
      // Настройка вебхука для продакшена
      app.use(bot.webhookCallback(WEBHOOK_PATH));
      
      // Health check endpoint
      app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok' });
      });
      
      const server = app.listen(PORT, async () => {
        try {
          await bot.telegram.setWebhook(`${process.env.DOMAIN}${WEBHOOK_PATH}`);
          console.log(`Server running on port ${PORT}`);
          console.log(`Webhook configured at ${process.env.DOMAIN}${WEBHOOK_PATH}`);
        } catch (error) {
          console.error('Failed to set webhook:', error);
          process.exit(1);
        }
      });
      
      // Graceful shutdown
      const shutdown = async () => {
        console.log('Shutting down gracefully...');
        try {
          await bot.stop();
          server.close(() => {
            console.log('Server closed');
            process.exit(0);
          });
        } catch (err) {
          console.error('Error during shutdown:', err);
          process.exit(1);
        }
      };
      
      process.once('SIGINT', shutdown);
      process.once('SIGTERM', shutdown);
    } else {
      // Локальная разработка
      await bot.launch();
      console.log('Bot running in development mode');
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default bot;