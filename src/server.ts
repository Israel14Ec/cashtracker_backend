import express from 'express' 
import colors from 'colors'
import morgan from 'morgan'
import { sequelize } from './config/db';
import budgetRouter from './routes/budgetRouter';
import authRouter from './routes/authRouter';

async function connectDB() {
    try {
        await sequelize.authenticate()
        sequelize.sync() //sincroniza las tablas
        console.log(colors.blue.bold("Conexión exitosa a la DB"));
        
    } catch (error) {
        console.log(error);
        console.log(colors.red("Fallo la conexión a la DB"));
    }
}
connectDB()

const app = express()

app.use(morgan('dev')) //logs de la api

app.use(express.json()) //leer JSON

//Rutas
app.use('/api/budgets', budgetRouter)
app.use('/api/auth', authRouter)


export default app