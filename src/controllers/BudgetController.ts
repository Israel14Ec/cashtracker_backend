import type {Request, Response} from 'express'
import Budget from '../models/Budge';
import Expense from '../models/Expense';

export class BudgetController {

    static create = async (req: Request, res: Response  ) => {
        try {
            const budget = new Budget(req.body)
            budget.userId = req.user.id
            await budget.save()
            res.status(201).json({msg: 'Presupuesto creado correctamente', data: budget})
        } catch (error) {
            res.status(500).json({error, msg: 'No se pudo guardar'})
        }
    }

    static getAll = async (req: Request, res: Response  ) => {
        try {
            const budgets = await Budget.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                where: {
                    userId: req.user.id //Filtra por el id del usuario
                }
            })
            res.json(budgets)
        } catch (error) {
            res.status(500).json({error, msg: 'Hubo un error '})
        }
    }

    //Trae tambien los datos de su relacion expense
    static getBudgetById = async (req: Request, res: Response  ) => {
        const budget = await Budget.findByPk(req.budget.id, {
            include: [Expense]
        })
        res.json(budget)
    }

    static update = async (req: Request, res: Response  ) => {
        try {
            await req.budget.update(req.body)    
            res.json({msg: 'Presupuesto actualizado correctamente'})
        } catch (error) {
            res.status(500).json({error, msg: 'Hubo un error'})
        }
    }

    static delete = async (req: Request, res: Response  ) => {
        try {
            await req.budget.destroy()
            res.json({msg: 'Presupuesto eliminado correctamente'}) 
        } catch (error) {
            res.status(500).json({error, msg: 'Hubo un error'})
        }
    }
}