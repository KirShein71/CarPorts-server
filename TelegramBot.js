import { Telegraf } from 'telegraf';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

// Проверка обязательных переменных окружения
if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.JWT_SECRET) {
  throw new Error('Missing required environment variables');
}

// Инициализация Sequelize с явным указанием диалекта
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres', // Явно указываем диалект
    port: process.env.DB_PORT || 5432,
    logging: false // Отключаем логирование запросов для чистоты консоли
  }
);


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

bot.command('getlink', async (ctx) => {
  try {
    const chatId = ctx.message.chat.id;
    
    // Проверяем, привязан ли уже аккаунт
    const [user] = await sequelize.query(`
      SELECT id, phone FROM users WHERE telegram_chat_id = :chatId
    `, {
      replacements: { chatId },
      type: sequelize.QueryTypes.SELECT
    });

    if (!user) {
      await ctx.reply('🤷‍♂️ Ваш Telegram не привязан к аккаунту. Используйте /start для привязки');
      return;
    }

    // Генерация нового JWT токена
    const token = jwt.sign(
      { 
        userId: user.id,
        chatId: chatId,
        exp: Math.floor(Date.now() / 1000) + 900 // снова 15 минут
      },
      process.env.JWT_SECRET
    );

    const personalAccountLink = `${process.env.FRONTEND_URL}/personalaccount?token=${token}`;
    
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

      // Обновляем chat_id в БД
      const [updatedCount] = await sequelize.query(`
        UPDATE users 
        SET telegram_chat_id = :chatId 
        WHERE phone = :phone
        RETURNING id
      `, {
        replacements: { chatId, phone },
        type: sequelize.QueryTypes.UPDATE
      });

      if (updatedCount.length > 0) {
        // Генерация JWT токена
        const token = jwt.sign(
          { 
            userId: user.id,
            chatId: chatId,
            exp: Math.floor(Date.now() / 1000) + 900 // 15 минут
          },
          process.env.JWT_SECRET // Используем секрет из .env
        );

        const personalAccountLink = `${process.env.FRONTEND_URL}/personalaccount?token=${token}`;
        
        await ctx.replyWithHTML(
          '✅ Отлично! Ваш Telegram успешно привязан\n\n' +
          `<a href="${personalAccountLink}">🔗 Перейти в личный кабинет</a>`
        );
      }
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

bot.telegram.setMyCommands([
  { command: 'start', description: 'Привязать Telegram к аккаунту' },
  { command: 'getlink', description: 'Получить ссылку для входа' },
]);

// Запуск бота
bot.launch()
  .then(() => console.log('Бот запущен'))
  .catch(err => console.error('Ошибка запуска бота:', err));

export default bot;