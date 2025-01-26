import { Table, Column, DataType, Model, ForeignKey, BelongsTo, AllowNull } from "sequelize-typescript"
import Budget from "./Budge"

@Table({
    tableName: 'expenses'
})

class Expense extends Model {

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


    //llave foránea
    @ForeignKey(() => Budget)
    declare budgetId: number

    
    //Relacion a 1 a Budget
    @BelongsTo(() => Budget) 
    declare budget: Budget
}

export default Expense