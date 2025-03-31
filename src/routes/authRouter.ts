import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";
import { limiter } from "../config/limiter";
import { authenticate } from "../middleware/auth";

const authRouter = Router()

authRouter.use(limiter) //Limita las peticiones a la URL a clientes en específico

authRouter.post('/create-account',
    body('name')
        .notEmpty().withMessage('Ingrese el nombre'),
    body('password')
        .isLength({min: 8}).withMessage('El password es muy corto, mínimo 8 caracteres'),
    body('email')
        .isEmail().withMessage('Email no válido'),
    handleInputErrors,
    AuthController.createAccount
)

authRouter.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('Token no válido')
        .isLength({min: 6, max:6}),
    handleInputErrors,
    AuthController.confirmAccount
)

authRouter.post('/login',
    body('email')
        .isEmail().withMessage('Email no válido'),
    body('password')
        .notEmpty().withMessage('Ingrese el password'),
    handleInputErrors,
    AuthController.login
)

authRouter.post('/forgot-password', 
    body('email')
        .isEmail().withMessage('Email no válido'),
    handleInputErrors,
    AuthController.forgotPassword
)


authRouter.post('/validate-token', 
    body('token')
        .notEmpty().withMessage('Token no válido')
        .isLength({min: 6, max:6}),
    handleInputErrors,
    AuthController.validateToken
)

authRouter.post('/reset-password/:token',
    param('token')
        .notEmpty().withMessage('Token no válido')
        .isLength({min: 6, max:6}),
    body('password')
        .isLength({min: 8}).withMessage('El password es muy corto, mínimo 8 caracteres'),
    handleInputErrors,
    AuthController.resetPasswordWithToken
)

authRouter.get('/user', 
    authenticate,
    AuthController.getUser                                                                  
)

authRouter.post('/update-password', 
    authenticate,
    body('current_password')
        .notEmpty().withMessage('Ingrese el password actual'),
    body('password')
        .isLength({min: 8}).withMessage('El password es muy corto, mínimo 8 caracteres'),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
)
authRouter.put('/user', 
    authenticate,
    body("name")
        .notEmpty().withMessage('Ingrese un nombre'),
    body("email")
        .notEmpty().withMessage('Ingrese un email')
        .isEmail().withMessage('Email no válido'),
        handleInputErrors,
    AuthController.updateUser
)

authRouter.post('/check-password', 
    authenticate,
    body('password')
        .notEmpty().withMessage('Ingrese el password actual'),
    handleInputErrors,
    AuthController.checkPassword
)


export default authRouter