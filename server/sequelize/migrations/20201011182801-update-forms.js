'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.bulkUpdate(
          'Forms',
          {
            form: JSON.stringify([
              {
                controlName: 'title',
                type: 'input',
                label: 'Title',
                isEditable: true,
                required: true
              },
              {
                controlName: 'description',
                type: 'textarea',
                label: 'Description',
                isEditable: true
              },
              {
                controlName: 'TaskPriorityId',
                type: 'select',
                label: 'Priority',
                isEditable: true,
                editOnly: true,
                options: [
                  {
                    label: 'Not urgent or important',
                    value: 1
                  },
                  {
                    label: 'Urgent not important',
                    value: 2
                  },
                  {
                    label: 'Important not urgent',
                    value: 3
                  },
                  {
                    label: 'Urgent and important',
                    value: 4
                  }
                ]
              }
            ])
          },
          {
            key: 'task'
          },
          { transaction: t }
        ),
        queryInterface.bulkUpdate(
          'Forms',
          {
            form: JSON.stringify([
              {
                controlName: 'keyString',
                type: 'input',
                label: 'Title',
                isEditable: true,
                required: true
              },
              {
                controlName: 'createdAt',
                type: 'date',
                label: 'Date Created',
                isEditable: false
              },
              {
                controlName: 'updatedAt',
                type: 'date',
                label: 'Date Updated',
                isEditable: false
              }
            ])
          },
          {
            key: 'role'
          },
          { transaction: t }
        )
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.bulkUpdate(
          'Forms',
          {
            form: JSON.stringify([
              {
                controlName: 'priority',
                type: 'input',
                label: 'Title',
                isEditable: true,
                required: true
              },
              {
                controlName: 'description',
                type: 'textarea',
                label: 'Description',
                isEditable: true
              },
              {
                controlName: 'TaskPriorityId',
                type: 'select',
                label: 'Priority',
                isEditable: true,
                editOnly: true,
                options: [
                  {
                    label: 'Not urgent or important',
                    value: 1
                  },
                  {
                    label: 'Urgent not important',
                    value: 2
                  },
                  {
                    label: 'Important not urgent',
                    value: 3
                  },
                  {
                    label: 'Urgent and important',
                    value: 4
                  }
                ]
              }
            ])
          },
          {
            key: 'task'
          },
          { transaction: t }
        ),
        queryInterface.bulkUpdate(
          'Forms',
          {
            form: JSON.stringify([
              {
                controlName: 'title',
                type: 'input',
                label: 'Title',
                isEditable: true,
                required: true
              },
              {
                controlName: 'createdAt',
                type: 'date',
                label: 'Date Created',
                isEditable: false
              },
              {
                controlName: 'updatedAt',
                type: 'date',
                label: 'Date Updated',
                isEditable: false
              }
            ])
          },
          {
            key: 'role'
          },
          { transaction: t }
        )
      ]);
    });
  }
};
