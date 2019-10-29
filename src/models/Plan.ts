import { Sequelize, Model, DataTypes, BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin, Association, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin } from 'sequelize';
import { User } from './User';
import { Asset } from './Asset';
import { Stage } from './Stage';
import { Organization } from './Organization';

export class Plan extends Model {
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
    public CreatorId!: number;
    public activeStageId!: number;

    public getOrganization!: BelongsToGetAssociationMixin<Organization>;
    public setOrganization!: BelongsToSetAssociationMixin<Organization, number>;

    public createCreator!: BelongsToCreateAssociationMixin<User>;
    public getCreator!: BelongsToGetAssociationMixin<User>;
    public setCreator!: BelongsToSetAssociationMixin<User, number>;

    public addParticipant!: BelongsToManyAddAssociationMixin<User, number>;
    public addParticipants!: BelongsToManyAddAssociationsMixin<User, number>;
    public countParticipants!: BelongsToManyCountAssociationsMixin;
    public createParticipant!: BelongsToManyCreateAssociationMixin<User>;
    public getParticipants!: BelongsToManyGetAssociationsMixin<User>;
    public hasParticipant!: BelongsToManyHasAssociationMixin<User, number>;
    public hasParticipants!: BelongsToManyHasAssociationsMixin<User, number>;
    public removeParticipant!: BelongsToManyRemoveAssociationMixin<User, number>;
    public removeParticipants!: BelongsToManyRemoveAssociationsMixin<User, number>;
    public setParticipants!: BelongsToManySetAssociationsMixin<User, number>;

    public addDocument!: BelongsToManyAddAssociationMixin<Asset, number>;
    public addDocuments!: BelongsToManyAddAssociationsMixin<Asset, number>;
    public countDocuments!: BelongsToManyCountAssociationsMixin;
    public createDocument!: BelongsToManyCreateAssociationMixin<Asset>;
    public getDocuments!: BelongsToManyGetAssociationsMixin<Asset>;
    public hasDocument!: BelongsToManyHasAssociationMixin<Asset, number>;
    public hasDocuments!: BelongsToManyHasAssociationsMixin<Asset, number>;
    public removeDocument!: BelongsToManyRemoveAssociationMixin<Asset, number>;
    public removeDocuments!: BelongsToManyRemoveAssociationsMixin<Asset, number>;
    public setDocuments!: BelongsToManySetAssociationsMixin<Asset, number>;

    public createActiveStage!: BelongsToCreateAssociationMixin<Stage>;
    public getActiveStage!: BelongsToGetAssociationMixin<Stage>;
    public setActiveStage!: BelongsToSetAssociationMixin<Stage, number>;

    public addStage!: BelongsToManyAddAssociationMixin<Stage, number>;
    public addStages!: BelongsToManyAddAssociationsMixin<Stage, number>;
    public countStages!: BelongsToManyCountAssociationsMixin;
    public createStage!: BelongsToManyCreateAssociationMixin<Stage>;
    public getStages!: BelongsToManyGetAssociationsMixin<Stage>;
    public hasStage!: BelongsToManyHasAssociationMixin<Stage, number>;
    public hasStages!: BelongsToManyHasAssociationsMixin<Stage, number>;
    public removeStage!: BelongsToManyRemoveAssociationMixin<Stage, number>;
    public removeStages!: BelongsToManyRemoveAssociationsMixin<Stage, number>;
    public setStages!: BelongsToManySetAssociationsMixin<Stage, number>;

    public readonly Organization?: Organization;
    public readonly Participants?: User[];
    public readonly Documents?: Asset[];
    public readonly Creator?: User;
    public readonly activeStage?: Stage;
    public Stages?: Stage[]; // readonly?


    public static associations: {
        Organization: Association<Plan, Organization>;
        Participants: Association<Plan, User>;
        Documents: Association<Plan, Asset>;
        Creator: Association<Plan, User>;
        activeStage: Association<Plan, Stage>;
        Stages: Association<Plan, Stage>;
    };

}

export const PlanFactory = (sequelize: Sequelize): void => {
    const plan = Plan.init({
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
        },
        deadline:  {
            type: DataTypes.DATE
        },
        budget: {
            type: new DataTypes.DECIMAL(19, 4)
        },
        progress: {
            type: new DataTypes.DECIMAL(5, 2)
        }
    }, {
        tableName: 'Plans',
        sequelize
    });

    return plan;
};
