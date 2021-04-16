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
                controlName: 'name',
                type: 'input',
                label: 'Name',
                isEditable: true,
                required: true
              },
              {
                controlName: 'surname',
                type: 'input',
                label: 'Surname',
                isEditable: true
              },
              {
                controlName: 'email',
                type: 'input',
                label: 'Email',
                isEditable: true
              },
              {
                controlName: 'phone',
                type: 'input',
                label: 'Phone',
                isEditable: true
              },
              {
                controlName: 'StateId',
                type: 'select',
                label: 'State',
                isEditable: true,
                editOnly: true,
                options: [
                  {
                    label: 'Initialized',
                    value: 'initialized'
                  },
                  {
                    label: 'Active',
                    value: 'active'
                  },
                  {
                    label: 'Disabled',
                    value: 'disabled'
                  },
                  {
                    label: 'Archive',
                    value: 'archive'
                  }
                ]
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
            key: 'user'
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
                controlName: 'name',
                type: 'input',
                label: 'Name',
                isEditable: true,
                required: true
              },
              {
                controlName: 'surname',
                type: 'input',
                label: 'Surname',
                isEditable: true
              },
              {
                controlName: 'login',
                type: 'input',
                label: 'Login',
                isEditable: false,
                required: true
              },
              {
                controlName: 'email',
                type: 'input',
                label: 'Email',
                isEditable: true
              },
              {
                controlName: 'phone',
                type: 'input',
                label: 'Phone',
                isEditable: true
              },
              {
                controlName: 'StateId',
                type: 'select',
                label: 'State',
                isEditable: true,
                editOnly: true,
                options: [
                  {
                    label: 'Initialized',
                    value: 'initialized'
                  },
                  {
                    label: 'Active',
                    value: 'active'
                  },
                  {
                    label: 'Disabled',
                    value: 'disabled'
                  },
                  {
                    label: 'Archive',
                    value: 'archive'
                  }
                ]
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
            key: 'user'
          },
          { transaction: t }
        )
      ]);
    });
  }
};
