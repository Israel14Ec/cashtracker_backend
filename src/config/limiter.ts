
/**
 * 
 * RATE LIMITING: es una técnica que se utiliza para restringir el número de 
 * solicitudes que un cliente (usuario o dispositivo) puede hacer 
 * a un servidor dentro de un período de tiempo determinado
 */

import { rateLimit } from "express-rate-limit"

export const limiter = rateLimit({
    windowMs: 60 * 1000, //Cantidad de tiempo para limitar los request
    limit: 5, //Cantidad de peticiones por el tiempo definido
    message: {"msg": "Has alcanzado el límite de peticiones, espera unos minutos"}
})