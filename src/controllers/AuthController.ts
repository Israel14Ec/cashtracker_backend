
import { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../utils/jwt"
import { Op } from "sequelize"

export class AuthController {

    static createAccount = async (req: Request, res: Response  ) => {
        try {

            const { email, password } = req.body

            const userExists = await User.findOne({where: {email}}) //Busco por el email            
            //Prevenir duplicado
            if(userExists) {
                const error = new Error('El correo ya fue registrado')
                res.status(409).json({msg: error.message})
                return
            }

            const user = new User(req.body)
            user.password = await hashPassword(password)
            user.token = generateToken()
            await user.save()
            
           await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token
            })

            res.json({msg: 'Cuenta creada correctamente'})
        } catch (error) {
            res.status(500).json({error, msg: 'Hubo un error'})
        }
    }
    
    static confirmAccount = async (req: Request, res: Response  ) => {
        try {
            const { token } = req.body 

            //Encontrar usuario con el token
            const user = await User.findOne({where: {token}})
            if(!user) {
                const error = new Error('Token no válido')
                res.status(404).json({msg: error.message})
                return
            }

            user.confirmed = true //Confirmado
            user.token = "" //Eliminar token
            await user.save() //Guarda los cambios

            res.json({msg: 'Cuenta confirmada correctamente'})

        } catch (error) {
            res.status(500).json({error, msg: 'Hubo un error'})
        }
    }


    static login = async (req: Request, res: Response  ) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({where: {email: email}}) //Buscar por el email

            //Revisar que el usuario exista
            if(!user) {
                const error = new Error('Usuario no encontrado')
                res.status(404).json({msg: error.message})
                return 
            }

            //Revisar confirmacion de cuenta
            if(!user.confirmed) {
                const error = new Error('La cuenta no ha sido confirmada')
                res.status(403).json({msg: error.message})
                return 
            }

            //Revisar password
            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect) {
                const error = new Error('Credenciales incorrectas')
                res.status(401).json({msg: error.message})
                return 
            }

            const token = generateJWT(user.id)
            res.json(token)
            
        } catch (error) {
            res.status(500).json({error, msg: 'Hubo un error'})
        }
    }

    //Actualizar usuario
    static updateUser = async (req: Request, res: Response) => {
        try {
            const { name, email } = req.body

            //Validar que el email no pertenezca a otro usuario
            const userExists = await User.findOne({where: {
                email,
                id: {[Op.not] : req.user.id}
            }}) 

            if(userExists) {
                const error = new Error('El correo ya fue registrado')
                res.status(409).json({msg: error.message})
                return
            }

            req.user.name = name
            req.user.email = email
            const userUpdate =  await req.user.save()
            
            res.json({
                data: userUpdate,
                msg: "Perfil actualizado correctamente"
            })
        } catch (error) {
            res.json({
                error,
                msg: "No se pudo actualizar el perfil"
            })
        }
    }

    //Recuperar contraseña
    static forgotPassword = async (req: Request, res: Response  ) => {
        try {
            const { email } = req.body

            const user = await User.findOne({where: {email: email}}) 

            //Revisar que el usuario exista
            if(!user) {
                const error = new Error('Usuario no encontrado')
                res.status(404).json({msg: error.message})
                return 
            }

            user.token = generateToken()
            await user.save()
            await AuthEmail.sendPasswordResetToken({
                name: user.name,
                email: user.email,
                token: user.token
            })
            res.json('Revisa tu email para instrucciones')
        } catch (error) {
            res.status(500).json({error, msg: 'Hubo un error'})
        }
    }

    //Validar el token
    static validateToken = async (req: Request, res: Response  ) => {
        try {
            const { token } = req.body
            console.log(token)

            const tokenExists = await User.findOne({where: {token}})
            if(!tokenExists) {
                const error = new Error('Token no válido')
                res.status(404).json({msg: error.message})
                return 
            }

            res.json({msg: 'Token válido, asigna un nuevo password'})
            
        } catch (error) {
            console.log("Mensaje de error: ",error)
            res.status(500).json({error: error, msg: 'No se pudo validar el código'})
        }
    }

    static resetPasswordWithToken = async (req: Request, res: Response  )  => {
        try {
            const { token } = req.params
            const { password } = req.body

            const user = await User.findOne({where: {token}})
            if(!user) {
                const error = new Error('Token no válido')
                res.status(404).json({msg: error.message})
                return 
            }

            //asignar nuevo password
            user.password = await hashPassword(password)
            user.token=""
            await user.save()

            res.json({msg: 'El password se modificó correctamente'})
        } catch (error) {
            res.status(500).json({error, msg: 'No se pudo validar el código'})
        }
    }

    static getUser = async (req: Request, res: Response  ) => {
        res.json(req.user)
    }

    static updateCurrentUserPassword = async (req: Request, res: Response  ) => {
        try {   
            const { current_password, password } = req.body
            const { id } = req.user
            const user = await User.findByPk(id)

            const isPasswordCorrect = await checkPassword(current_password, user.password)
            if(!isPasswordCorrect) {
                const error = new Error('El password actual es incorrecto')
                res.status(404).json({msg: error.message})
                return
            }

            user.password = await hashPassword(password)
            await user.save()

            res.json({msg: "El password se modificó correctamente"})

        } catch (error) {
            res.status(500).json({error, msg: 'Hubo un error'})
        }
    }

    //Revisar el password
    static checkPassword = async (req: Request, res: Response  ) => {
        try {   
            const { password } = req.body
            const { id } = req.user

            const user = await User.findByPk(id)

            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect) {
                const error = new Error('El password actual es incorrecto')
                res.status(404).json({msg: error.message})
                return
            }

            res.json({msg: "Password correcto"})

        } catch (error) {
            res.status(500).json({error, msg: 'Hubo un error'})
        }
    }
}