import { Sequelize, Model, DataTypes, BelongsToGetAssociationMixin, Association } from 'sequelize';
import { User } from './User';

export class PasswordAttribute extends Model {
    public id!: number;
    public token!: string;
    public tokenExpire!: Date;
    public passwordExpire!: Date;

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // from assotiations
    public UserId!: number;

    public getUser!: BelongsToGetAssociationMixin<User>;

    public readonly User?: User;

    public static associations: {
        User: Association<PasswordAttribute, User>;
    };

}

export const PasswordAttributeFactory = (sequelize: Sequelize): void => {
    const passwordAttribute = PasswordAttribute.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        token: DataTypes.STRING,
        tokenExpire: DataTypes.DATE,
        passwordExpire: DataTypes.DATE
    }, {
        tableName: 'PasswordAttributes',
        sequelize
    });

    return passwordAttribute;
};
