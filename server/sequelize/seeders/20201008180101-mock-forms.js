'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Forms', [
      {
        key: 'user',
        name: 'User Model Form',
        type: 'system',
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
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'plan',
        name: 'Plan Model Form',
        type: 'system',
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
            controlName: 'budget',
            type: 'input',
            label: 'Budget',
            isEditable: true
          },
          {
            controlName: 'deadline',
            type: 'date',
            label: 'Deadline',
            isEditable: true
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
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'user-organization',
        name: 'User Organization Model Form',
        type: 'system',
        form: JSON.stringify([
          {
            controlName: 'title',
            type: 'input',
            label: 'Title',
            isEditable: true,
            required: true
          },
          {
            controlName: 'type',
            type: 'input',
            label: 'Type',
            isEditable: false,
            required: true
          },
          {
            controlName: 'country',
            type: 'input',
            label: 'Country',
            isEditable: true
          },
          {
            controlName: 'city',
            type: 'input',
            label: 'City',
            isEditable: true
          },
          {
            controlName: 'address',
            type: 'input',
            label: 'Address',
            isEditable: true
          },
          {
            controlName: 'postcode',
            type: 'input',
            label: 'Postcode',
            isEditable: true
          },
          {
            controlName: 'phone',
            type: 'input',
            label: 'Phone',
            isEditable: true
          },
          {
            controlName: 'email',
            type: 'iemailnput',
            label: 'Email',
            isEditable: true
          },
          {
            controlName: 'website',
            type: 'input',
            label: 'Website',
            isEditable: true
          },
          {
            controlName: 'updatedAt',
            type: 'date',
            label: 'Date Updated',
            isEditable: false
          }
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'task',
        name: 'Task Model Form',
        type: 'system',
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
            controlName: 'priority',
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
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'role',
        name: 'Role Model Form',
        type: 'system',
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
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'department',
        name: 'Department Model Form',
        type: 'system',
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
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Forms', null, {});
  }
};
