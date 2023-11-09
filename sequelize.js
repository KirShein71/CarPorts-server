import {Sequelize} from 'sequelize'
import { config } from "dotenv"

config();

export default new Sequelize(
    process.env.DB_NAME, // база данных
    process.env.DB_USER, // пользователь
    process.env.DB_PASSWORD, // пароль
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        define: {
            // в базе данных поля будут created_at и updated_at
            underscored: true,
            timestamps: true
        },
        logging: false,
        timezone: 'Europe/Moscow',
    }
)