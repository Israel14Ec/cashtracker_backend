import type { Request, Response ,NextFunction } from "express"
import { body, param, validationResult } from "express-validator"
import Expense from "../models/Expense"

//Añade el Expense al Request
declare global {
    namespace Express {
        interface Request {
            expense?: Expense
        }
    }
}

export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {

    await body('name')
        .notEmpty().withMessage('Ingrese el nombre del gasto').run(req),
    await body('amount')
        .notEmpty().withMessage('Agregre la cantidad del gasto')
        .isNumeric().withMessage('Cantidad no valida')
        .custom(value => value > 0).withMessage('El gasto debe ser mayor a 0').run(req)
    next()
}

export const validateExpenseId = async (req: Request, res: Response, next: NextFunction) => {
    await param('expenseId').isInt().withMessage('id no valido').
        custom(value => value > 0).withMessage('Id no válido').run(req)
    
    let errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
            return
        }
    next()
}

export const validateExpenseExists = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
         const { expenseId } = req.params
         const expense = await Expense.findByPk(expenseId)
 
         if(!expense) {
             const error = new Error('Gasto no encontrado') //Crea un objeto de error, si se añade el throw se ejecuta el catch
             res.status(404).json({msg:error.message})
             return
         }    
         req.expense = expense //Le paso el modelo encontrado
 
         next() //llama al siguiente middleware
 
    } catch (error) {
      res.status(500).json({error, msg: 'Hubo un error'})
    }
 }

 export const belongsToBudget = async (req: Request, res: Response, next: NextFunction) => {
    if(req.budget.id !== req.expense.budgetId) {
        const error = new Error("Acción no válida")

        return res.status(403).json({msg: error.message})
    }
    
    next()
    
 }