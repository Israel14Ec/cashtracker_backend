import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv"

dotenv.config()

export const sequelize = new Sequelize(
    process.env.DB,
    process.env.USER,
    process.env.PASS,
    {
    dialect: 'postgres',
    host: 'localhost',
    models: [__dirname + "/../models/**/*"],
    logging: false, //Deja de mostrar x consola el codigo SQL
    }
)