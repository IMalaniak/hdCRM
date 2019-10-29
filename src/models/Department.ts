import { Sequelize, Model, DataTypes, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, Association } from 'sequelize';
import { User } from './User';
import { Stage } from './Stage';
import { Organization } from './Organization';

export class Department extends Model {
    public id!: number;
    public title!: string;
    public description!: string;
    public deadline!: Date;
    public budget!: number;
    public progress!: number;

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // from assotiations
    public OrganizationId!: number;
    public parentDepId!: number;
    public managerId!: number;

    public getOrganization!: BelongsToGetAssociationMixin<Organization>;
    public setOrganization!: BelongsToSetAssociationMixin<Organization, number>;

    public createParentDepartment!: BelongsToCreateAssociationMixin<User>;
    public getParentDepartment!: BelongsToGetAssociationMixin<User>;
    public setParentDepartment!: BelongsToSetAssociationMixin<User, number>;

    public addSubDepartment!: HasManyAddAssociationMixin<Department, number>;
    public addSubDepartments!: HasManyAddAssociationsMixin<Department, number>;
    public countSubDepartments!: HasManyCountAssociationsMixin;
    public createSubDepartment!: HasManyCreateAssociationMixin<Department>;
    public getSubDepartments!: HasManyGetAssociationsMixin<Department>;
    public hasSubDepartment!: HasManyHasAssociationMixin<Department, number>;
    public hasSubDepartments!: HasManyHasAssociationsMixin<Department, number>;
    public removeSubDepartment!: HasManyRemoveAssociationMixin<Department, number>;
    public removeSubDepartments!: HasManyRemoveAssociationsMixin<Department, number>;
    public setSubDepartments!: HasManySetAssociationsMixin<Department, number>;

    public addWorker!: HasManyAddAssociationMixin<User, number>;
    public addWorkers!: HasManyAddAssociationsMixin<User, number>;
    public countWorkers!: HasManyCountAssociationsMixin;
    public createWorker!: HasManyCreateAssociationMixin<User>;
    public getWorkers!: HasManyGetAssociationsMixin<User>;
    public hasWorker!: HasManyHasAssociationMixin<User, number>;
    public hasWorkers!: HasManyHasAssociationsMixin<User, number>;
    public removeWorker!: HasManyRemoveAssociationMixin<User, number>;
    public removeWorkers!: HasManyRemoveAssociationsMixin<User, number>;
    public setWorkers!: HasManySetAssociationsMixin<User, number>;

    public createManager!: BelongsToCreateAssociationMixin<Stage>;
    public getManager!: BelongsToGetAssociationMixin<Stage>;
    public setManager!: BelongsToSetAssociationMixin<Stage, number>;

    public readonly Organization?: Organization;
    public readonly ParentDepartment?: Department;
    public readonly SubDepartments?: Department[];
    public readonly Workers?: User[];
    public readonly Manager?: User;

    public static associations: {
        Organization: Association<Department, Organization>;
        ParentDepartment: Association<Department, Department>;
        SubDepartments: Association<Department, Department>;
        Workers: Association<Department, User>;
        Manager: Association<Department, User>;
    };

}

export const DepartmentFactory = (sequelize: Sequelize): void => {
    const department = Department.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: new DataTypes.STRING(255),
            allowNull: false,
        },
        description:  {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'Departments',
        sequelize
    });

    return department;
};
