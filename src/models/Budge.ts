import { Table, Column, DataType, HasMany, Model, AllowNull, BelongsTo, ForeignKey } from "sequelize-typescript"
import Expense from "./Expense"
import User from "./User"

//Decorador: envueltea una funcion y añade caracteristicas adicionales, sin modificar la funcion principal
@Table({
    tableName: 'budgets'
})

class Budget extends Model {

    @AllowNull(false) //No null
    @Column({
        type: DataType.STRING(100)
    })
    declare name: string

    @AllowNull(false) //No null
    @Column({
        type: DataType.DECIMAL()
    })
    declare amount: number //delare indica que el valor sera inicializado externamente

    //Relacion a n con Expense
    @HasMany(() => Expense, {
        onUpdate: "CASCADE", //Restricciones de integridad
        onDelete: "CASCADE"
    })
    declare expenses: Expense[]

    //llave foránea
    @ForeignKey(() => User)
    declare userId: number
    
    //Relacion de 1 a User
    @BelongsTo(() => User)
    declare user: User
}

export default Budget