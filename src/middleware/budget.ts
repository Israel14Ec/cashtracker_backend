//validaciones
import type { Request, Response, NextFunction } from "express"
import { param, validationResult, body } from "express-validator"
import Budget from "../models/Budge"

//Añade el Budget al Request
declare global {
    namespace Express {
        interface Request {
            budget?: Budget
        }
    }
}

export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {

    await param('budgetId')
        .isInt().withMessage('Id no valido')
        .custom(value => value > 0).withMessage('Id no valido')
        .run(req)
    
    let errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
            return
        }
    next()
}


export const validateBudgetExists = async (req: Request, res: Response, next: NextFunction) => {
    
   try {
        const { budgetId } = req.params
        const budget = await Budget.findByPk(budgetId)

        if(!budget) {
            const error = new Error('Presupuesto no encontrado') //Crea un objeto de error, si se añade el throw se ejecuta el catch
            res.status(404).json({msg:error.message})
            return
        }    
        req.budget = budget //Le paso el modelo encontrado

        next() //llama al siguiente middleware

   } catch (error) {
     res.status(500).json({error, msg: 'Hubo un error'})
   }
}

export const validateBudgetInput = async (req: Request, res: Response, next: NextFunction) => {

    await body('name')
        .notEmpty().withMessage('El nombre del presupuesto es obligatorio').run(req),
    await body('amount')
        .notEmpty().withMessage('Agregre la cantidad')
        .isNumeric().withMessage('Cantidad no valida')
        .custom(value => value > 0).withMessage('El presupuesto debe ser mayor a 0').run(req)
    next()
}


//Valida que el idUsuario de budget sea igual al idUsuario del usuario autenticado con el token
export const hasAcces = (req: Request, res: Response, next: NextFunction)=> {
    
    if(req.budget.userId !== req.user.id) {
        const error = new Error('Acción no válida') 
        res.status(401).json({msg: error.message})
        return
    }
    next()
}   