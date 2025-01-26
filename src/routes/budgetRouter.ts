import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middleware/validation";
import { hasAcces, validateBudgetExists, validateBudgetId, validateBudgetInput } from "../middleware/budget";
import { ExpensesController } from "../controllers/ExpenseController";
import { validateExpenseExists, validateExpenseId, validateExpenseInput } from "../middleware/expense";
import { authenticate } from "../middleware/auth";

//USA PATRON ROA (Arquitectura Orientada a Recursos), estilo arquitectonico basado en REST para exponer recursos

const budgetRouter = Router()

budgetRouter.use(authenticate) 


//Llamada automatica a los middleware, hace que se ejecute los middleware de los endpoints que tienen un budgetId en su ruta
budgetRouter.param('budgetId', validateBudgetId)
budgetRouter.param('budgetId', validateBudgetExists)
budgetRouter.param('budgetId', hasAcces)

budgetRouter.param('expenseId', validateExpenseId)
budgetRouter.param('expenseId', validateExpenseExists)

//Endpoints
budgetRouter.post('/', 
    validateBudgetInput,
    handleInputErrors,
    BudgetController.create)

budgetRouter.get('/', BudgetController.getAll)

budgetRouter.get('/:budgetId', 
    BudgetController.getBudgetById)

budgetRouter.put('/:budgetId', 
    validateBudgetInput,
    handleInputErrors,
    BudgetController.update)

budgetRouter.delete('/:budgetId', 
    handleInputErrors,
    BudgetController.delete)


/** ROUTES FOR EXPENSES */
budgetRouter.post('/:budgetId/expenses', 
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.create)

budgetRouter.get('/:budgetId/expenses/:expenseId', ExpensesController.getById)

budgetRouter.put('/:budgetId/expenses/:expenseId', 
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.updateById)

budgetRouter.delete('/:budgetId/expenses/:expenseId', 
    handleInputErrors,
    ExpensesController.deleteById)


export default budgetRouter