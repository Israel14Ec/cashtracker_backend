import { Table, Column, Model, DataType, HasMany, Default, Unique, AllowNull } from "sequelize-typescript";
import Budget from "./Budge";

@Table({
    tableName: 'Users'
})

class User extends Model {

    @AllowNull(false) //No null
    @Column({
        type: DataType.STRING(100)
    })
    declare name: string


    @AllowNull(false) //No null
    @Column({
        type: DataType.STRING(60)
    })
    declare password: string
    
    @AllowNull(false) //No null
    @Unique(true) //Campo unico
    @Column({
        type: DataType.STRING(50)
    })
    declare email: string


    @Column({
        type: DataType.STRING(6)
    })
    declare token: string


    @Default(false)
    @Column({
        type: DataType.BOOLEAN()
    })
    declare confirmed: boolean


    //Relacion de n a Budget
    @HasMany(() => Budget, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare budgets: Budget[]
}

export default User

