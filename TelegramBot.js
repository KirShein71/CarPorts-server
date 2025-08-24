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



export default bot;