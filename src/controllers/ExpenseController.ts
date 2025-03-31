import type { Request, Response } from "express";
import Expense from "../models/Expense";
import { Op } from "sequelize";

export class ExpensesController {

    static create = async (req: Request, res: Response) => {
        try {

            const totalExpenses = await Expense.sum('amount', { where: {budgetId: req.budget.id}})

            // Validar que el nuevo gasto no supere el monto restante del presupuesto
            const total = (totalExpenses || 0) + req.body.amount;
       
            //Validar que el expense no supere el presupuesto
            if(total > req.budget.amount ) {
                res.status(400).json({ msg: 'El gasto es mayor al presupuesto restante'})
                return
            }

            const expense = new Expense({...req.body, 
                budgetId: req.budget.id
            })
            expense.save()
            res.status(201).json({msg: "Gasto agregado correctamente"})
        } catch (error) {
            res.status(500).json({error, msg: 'Hubo un error'})
        }
    }
  
    static getById = async (req: Request, res: Response) => {
        res.json(req.expense)
    }

    static updateById = async (req: Request, res: Response) => {

        const totalExpenses = await Expense.sum('amount', { 
            where: { 
                budgetId: req.budget.id,
                id: { [Op.ne]: req.expense.id }, // Excluir el gasto actual
            },
        });

        const total = (totalExpenses || 0) + req.body.amount;

        //Validar que el expense no supere el presupuesto
        if(total > req.budget.amount ) {
            res.status(400).json({ msg: 'El gasto es mayor al presupuesto restante'})
            return
        }


        await req.expense.update(req.body)
        res.json({msg: 'Se actualizo correctamente'})
    }
  
    static deleteById = async (req: Request, res: Response) => {
        await req.expense.destroy(req.expense.id)
        res.json({msg: 'Gasto eliminado'})
    }
}