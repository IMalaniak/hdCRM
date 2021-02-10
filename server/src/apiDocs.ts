export const apiDocs = {
  openapi: '3.0.1',
  info: {
    title: 'HDCRM API',
    description: 'HDCRM Main API',
    version: '1.0'
  },
  tags: [
    {
      name: 'Auth'
    },
    {
      name: 'Departments'
    },
    {
      name: 'Files'
    },
    {
      name: 'Forms'
    },
    {
      name: 'Plans'
    },
    {
      name: 'Preferences'
    },
    {
      name: 'Roles'
    },
    {
      name: 'Stages'
    },
    {
      name: 'Task priorities'
    },
    {
      name: 'Tasks'
    },
    {
      name: 'Users'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};
