import { Sequelize, Model, DataTypes, Association, BelongsToManyAddAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyHasAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, BelongsToManySetAssociationsMixin, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin } from 'sequelize';
import { Plan } from './Plan';

export class PlanStage extends Model {
    public id!: number;
    public keyString!: string;
    public order!: number;
    public description!: string;
    public completed!: boolean;

    // from associations
    public PlanId!: number;
    public StageId!: number;
}

export const PlanStageFactory = (sequelize: Sequelize): void => {
    const stage = Plan.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        description: {
            type: DataTypes.TEXT
          },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false     
        }
    }, {
        tableName: 'PlanStages',
        sequelize
    });

    return stage;
};
