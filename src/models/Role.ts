import { Sequelize, Model, DataTypes, Association, BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin } from 'sequelize';
import { User } from './User';
import { Privilege } from './Privilege';
import { Organization } from './Organization';

export class Role extends Model {
    public id!: number;
    public keyString!: string;

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // from assotiations
    public OrganizationId!: number;

    public getOrganization!: BelongsToGetAssociationMixin<Organization>;
    public setOrganization!: BelongsToSetAssociationMixin<Organization, number>;

    public addUser!: BelongsToManyAddAssociationMixin<User, number>;
    public addUsers!: BelongsToManyAddAssociationsMixin<User, number>;
    public countUsers!: BelongsToManyCountAssociationsMixin;
    public createUser!: BelongsToManyCreateAssociationMixin<User>;
    public getUsers!: BelongsToManyGetAssociationsMixin<User>;
    public hasUser!: BelongsToManyHasAssociationMixin<User, number>;
    public hasUsers!: BelongsToManyHasAssociationsMixin<User, number>;
    public removeUser!: BelongsToManyRemoveAssociationMixin<User, number>;
    public removeUsers!: BelongsToManyRemoveAssociationsMixin<User, number>;
    public setUsers!: BelongsToManySetAssociationsMixin<User, number>;

    public addPrivilege!: BelongsToManyAddAssociationMixin<Privilege, number>;
    public addPrivileges!: BelongsToManyAddAssociationsMixin<Privilege, number>;
    public countPrivileges!: BelongsToManyCountAssociationsMixin;
    public createPrivilege!: BelongsToManyCreateAssociationMixin<Privilege>;
    public getPrivileges!: BelongsToManyGetAssociationsMixin<Privilege>;
    public hasPrivilege!: BelongsToManyHasAssociationMixin<Privilege, number>;
    public hasPrivileges!: BelongsToManyHasAssociationsMixin<Privilege, number>;
    public removePrivilege!: BelongsToManyRemoveAssociationMixin<Privilege, number>;
    public removePrivileges!: BelongsToManyRemoveAssociationsMixin<Privilege, number>;
    public setPrivileges!: BelongsToManySetAssociationsMixin<Privilege, number>;

    public readonly Organization?: Organization;
    public readonly Users?: User[];
    public readonly Privileges?: Privilege[];

    public static associations: {
        Organization: Association<Role, Organization>;
        Users: Association<Role, User>;
        Privileges: Association<Role, Privilege>;
    };

}

export const RoleFactory = (sequelize: Sequelize): void => {
    const role = Role.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        keyString: {
            type: new DataTypes.STRING(50),
            allowNull: false
        }
    }, {
        tableName: 'Roles',
        sequelize
    });

    return role;
};
