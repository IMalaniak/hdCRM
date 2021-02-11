import { JsonObject } from 'swagger-ui-express';
import { FieldType, FormType } from './constants';
import { enumToArray } from './utils/EnumToArray';

const buildCollectionApiResponse = ($ref: string) => {
  return {
    type: 'object',
    properties: {
      success: {
        type: 'boolean'
      },
      message: {
        type: 'string'
      },
      resultsNum: { type: 'number' },
      pages: { type: 'number' },
      ids: { type: 'array', items: { type: 'number' } },
      data: {
        type: 'array',
        items: {
          $ref
        }
      }
    },
    required: ['success', 'data']
  };
};

const buildItemApiResponse = ($ref: string) => {
  return {
    type: 'object',
    properties: {
      success: {
        type: 'boolean'
      },
      message: {
        type: 'string'
      },
      data: {
        $ref
      }
    },
    required: ['success', 'data']
  };
};

export const apiDocs: JsonObject = {
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
    }
    // {
    //   name: 'Preferences'
    // },
    // {
    //   name: 'Roles'
    // },
    // {
    //   name: 'Stages'
    // },
    // {
    //   name: 'Task priorities'
    // },
    // {
    //   name: 'Tasks'
    // },
    // {
    //   name: 'Users'
    // }
  ],
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register new user',
        tags: ['Auth'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserCreationAttributes'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BaseResponse'
                }
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      }
    },
    '/api/auth/activate_account': {
      post: {
        summary: 'Activate account',
        tags: ['Auth'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: {
                    type: 'string'
                  }
                },
                required: ['token']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User activated',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BaseResponse'
                }
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      }
    },
    '/api/auth/authenticate': {
      post: {
        summary: 'Authenticate user',
        tags: ['Auth'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  login: {
                    type: 'string'
                  },
                  password: {
                    type: 'string'
                  }
                },
                required: ['login', 'password']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User logged in',
            headers: {
              'Set-Cookie': {
                schema: {
                  type: 'string',
                  example: 'refresh_token=abcde12345; Path=/; HttpOnly'
                }
              }
            },
            content: {
              'application/json': {
                schema: {
                  type: 'string',
                  example: 'token'
                }
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      }
    },
    '/api/auth/refresh-session': {
      get: {
        summary: 'Refresh user session',
        tags: ['Auth'],
        security: {
          cookieAuth: []
        },
        responses: {
          '200': {
            description: 'User session refreshed',
            content: {
              'application/json': {
                schema: {
                  type: 'string',
                  example: 'token'
                }
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      }
    },
    '/api/auth/forgot_password': {
      post: {
        summary: 'Forgot password request',
        tags: ['Auth'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                description: 'Login or email',
                type: 'object',
                properties: {
                  login: {
                    type: 'string'
                  }
                },
                required: ['login']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Reset password mail sent',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BaseResponse'
                }
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      }
    },
    '/api/auth/reset_password': {
      post: {
        summary: 'Reset password request',
        tags: ['Auth'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                description: 'Reset password Token',
                type: 'object',
                properties: {
                  token: {
                    type: 'string'
                  },
                  newPassword: {
                    type: 'string'
                  },
                  verifyPassword: {
                    type: 'string'
                  }
                },
                required: ['token']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'New password has been set',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BaseResponse'
                }
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      }
    },
    '/api/auth/logout': {
      get: {
        summary: 'Logout route',
        tags: ['Auth'],
        security: {
          cookieAuth: []
        },
        responses: {
          '200': {
            description: 'User logged out',
            headers: {
              'Set-Cookie': {
                schema: {
                  type: 'string',
                  example: 'refresh_token=abcde12345; Path=/; HttpOnly'
                }
              }
            },
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BaseResponse'
                }
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      }
    },
    '/api/departments': {
      get: {
        summary: 'Get filtered list of departments',
        tags: ['Departments'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/pageSize'
          },
          {
            $ref: '#/parameters/pageIndex'
          },
          {
            $ref: '#/parameters/sortIndex'
          },
          {
            $ref: '#/parameters/sortDirection'
          },
          {
            $ref: '#/parameters/filters'
          }
        ],
        responses: {
          '200': {
            description: 'Department list',
            content: {
              'application/json': {
                schema: buildCollectionApiResponse('#/components/schemas/Department')
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '401': {
            $ref: '#/components/responses/Unauthorized'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      },
      post: {
        summary: 'Create a new department',
        tags: ['Departments'],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/DepartmentCreationAttributes'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Department',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/Department')
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '401': {
            $ref: '#/components/responses/Unauthorized'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      }
    },
    '/api/departments/{id}': {
      get: {
        summary: 'Get department by id',
        tags: ['Departments'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/departmentId'
          }
        ],
        responses: {
          '200': {
            description: 'Department',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/Department')
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '401': {
            $ref: '#/components/responses/Unauthorized'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      },
      put: {
        summary: 'Update department',
        tags: ['Departments'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/departmentId'
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Department'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Department updated',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/Department')
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '401': {
            $ref: '#/components/responses/Unauthorized'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      },
      delete: {
        summary: 'Delete department by id',
        tags: ['Departments'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/departmentId'
          }
        ],
        responses: {
          '200': {
            description: 'Department deleted successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BaseResponse'
                }
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '401': {
            $ref: '#/components/responses/Unauthorized'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      }
    },
    '/api/departments/dashboard': {
      get: {
        summary: 'Get department dashboard data',
        tags: ['Departments'],
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Department',
            content: {
              'application/json': {
                schema: buildCollectionApiResponse('#/components/schemas/Department')
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '401': {
            $ref: '#/components/responses/Unauthorized'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      }
    },
    '/api/files/download/{fileID}': {
      get: {
        summary: 'Get file by id',
        tags: ['Files'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'fileID',
            in: 'path',
            description: 'The identifier of the file',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'File',
            content: {
              'application/octet-stream': {
                schema: {
                  type: 'string',
                  format: 'binary'
                }
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '401': {
            $ref: '#/components/responses/Unauthorized'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      }
    },
    '/api/forms/': {
      post: {
        summary: 'Create new form',
        tags: ['Forms'],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/FormAttributes'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Form',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/FormAttributes')
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '401': {
            $ref: '#/components/responses/Unauthorized'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      }
    },
    '/api/forms/{formName}': {
      get: {
        summary: 'Get form by name',
        tags: ['Forms'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: 'formName',
            in: 'path',
            description: 'The name of the form',
            required: true,
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Form',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/FormAttributes')
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '401': {
            $ref: '#/components/responses/Unauthorized'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      }
    },
    '/api/plans': {
      get: {
        summary: 'Get filtered list of plans',
        tags: ['Plans'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/pageSize'
          },
          {
            $ref: '#/parameters/pageIndex'
          },
          {
            $ref: '#/parameters/sortIndex'
          },
          {
            $ref: '#/parameters/sortDirection'
          },
          {
            $ref: '#/parameters/filters'
          }
        ],
        responses: {
          '200': {
            description: 'Plan list',
            content: {
              'application/json': {
                schema: buildCollectionApiResponse('#/components/schemas/Plan')
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '401': {
            $ref: '#/components/responses/Unauthorized'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      },
      post: {
        summary: 'Create a new plan',
        tags: ['Plans'],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PlanCreationAttributes'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Plan',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/Plan')
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '401': {
            $ref: '#/components/responses/Unauthorized'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      }
    },
    '/api/plans/{id}': {
      get: {
        summary: 'Get plan by id',
        tags: ['Plans'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/planId'
          }
        ],
        responses: {
          '200': {
            description: 'Plan',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/Plan')
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '401': {
            $ref: '#/components/responses/Unauthorized'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      },
      put: {
        summary: 'Update plan',
        tags: ['Plans'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/planId'
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Plan'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Plan updated',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/Plan')
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '401': {
            $ref: '#/components/responses/Unauthorized'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      },
      delete: {
        summary: 'Delete plan by id',
        tags: ['Plans'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/planId'
          }
        ],
        responses: {
          '200': {
            description: 'Plan deleted successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BaseResponse'
                }
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '401': {
            $ref: '#/components/responses/Unauthorized'
          },
          '500': {
            description: 'Internal server error'
          }
        }
      }
    }
  },
  parameters: {
    pageSize: {
      in: 'query',
      name: 'pageSize',
      schema: {
        type: 'string'
      },
      required: true,
      description: 'Results page size'
    },
    pageIndex: {
      in: 'query',
      name: 'pageIndex',
      schema: {
        type: 'string'
      },
      required: true,
      description: 'Results page index'
    },
    sortIndex: {
      in: 'query',
      name: 'sortIndex',
      schema: {
        type: 'string'
      },
      required: true,
      description: 'Column name to sort result by'
    },
    sortDirection: {
      in: 'query',
      name: 'sortDirection',
      schema: {
        type: 'string',
        enum: ['asc', 'desc']
      },
      required: true,
      description: 'Results page index'
    },
    filters: {
      in: 'query',
      name: 'filters',
      schema: {
        type: 'string'
      },
      description: 'Filters'
    },
    departmentId: {
      name: 'id',
      in: 'path',
      description: 'The identifier of the Department',
      required: true,
      schema: {
        type: 'string'
      }
    },
    planId: {
      name: 'id',
      in: 'path',
      description: 'The identifier of the Plan',
      required: true,
      schema: {
        type: 'string'
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'refresh_token'
      }
    },
    responses: {
      BadRequest: {
        description: 'A required parameter is missing or invalid',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/BaseResponse'
            }
          }
        }
      },
      Unauthorized: {
        description: 'The provided credentials are invalid',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/BaseResponse'
            }
          }
        },
        headers: {
          'WWW-Authenticate': {
            schema: {
              type: 'string'
            }
          }
        }
      },
      Forbidden: {
        description: 'Insufficient permissions to access the specified resource',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/BaseResponse'
            }
          }
        }
      },
      NotFound: {
        description: 'Invalid parameter in path',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/BaseResponse'
            }
          }
        }
      },
      NotContent: {
        description: 'Empty response'
      }
    },
    schemas: {
      BaseResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean'
          },
          message: {
            type: 'string'
          },
          errorOrigin: {
            type: 'number',
            enum: [0, 1]
          }
        },
        required: ['success']
      },
      FormItemOption: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          value: { oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }] }
        },
        required: ['value', 'label']
      },
      FormItem: {
        type: 'object',
        properties: {
          controlName: { type: 'string' },
          label: { type: 'string' },
          type: { type: 'string', enum: enumToArray(FieldType) },
          color: { type: 'string' },
          isEditable: { type: 'boolean' },
          editOnly: { type: 'boolean' },
          required: { type: 'boolean' },
          multiple: { type: 'boolean' },
          options: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/FormItemOption'
            }
          }
        },
        required: ['controlName', 'label', 'type', 'isEditable']
      },
      FormAttributes: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          name: { type: 'string' },
          type: { type: 'string', enum: enumToArray(FormType) },
          form: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/FormItem'
            }
          }
        },
        required: ['key', 'name', 'type', 'form']
      },
      UserCreationAttributes: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            example: 'john.doe@test.com'
          },
          login: {
            type: 'string',
            example: 'johnDoe'
          },
          password: {
            type: 'string',
            example: 'SomeCoolPassword'
          },
          name: {
            type: 'string',
            example: 'John'
          },
          surname: {
            type: 'string',
            example: 'Doe'
          },
          phone: {
            type: 'string',
            example: '380676767676'
          },
          Organization: {
            type: 'object',
            $ref: '#/components/schemas/OrganizationCreationAttributes'
          }
        },
        required: ['email', 'login', 'name', 'surname']
      },
      DepartmentCreationAttributes: {
        type: 'object',
        description: 'Department creation attributes',
        properties: {
          title: {
            type: 'string',
            example: 'My department'
          },
          description: {
            type: 'string',
            example: 'This is the description of the department'
          },
          Manager: {
            $ref: '#/components/schemas/User'
          }
        },
        required: ['title', 'Manager']
      },
      Department: {
        type: 'object',
        description: 'Department attributes',
        properties: {
          id: {
            type: 'number',
            example: 1
          },
          OrganizationId: {
            type: 'number',
            example: 1
          },
          parentDepId: {
            type: 'number',
            example: 1
          },
          managerId: {
            type: 'number',
            example: 1
          },
          title: {
            type: 'string',
            example: 'My department'
          },
          description: {
            type: 'string',
            example: 'This is the description of the department'
          }
        },
        required: ['id', 'OrganizationId', 'title']
      },
      PlanCreationAttributes: {
        type: 'object',
        description: 'Plan creation attributes',
        properties: {
          title: {
            type: 'string',
            example: 'My plan'
          }
        },
        required: ['title']
      },
      Plan: {
        type: 'object',
        description: 'Plan attributes',
        properties: {
          id: {
            type: 'number',
            example: 1
          },
          OrganizationId: {
            type: 'number',
            example: 1
          },
          activeStageId: {
            type: 'number',
            example: 1
          },
          CreatorId: {
            type: 'number',
            example: 1
          },
          title: {
            type: 'string',
            example: 'My plan'
          },
          description: {
            type: 'string',
            example: 'This is the description of the plan'
          },
          deadline: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          },
          budget: {
            type: 'number',
            format: 'float',
            example: 131.3423
          },
          progress: {
            type: 'number',
            format: 'double',
            example: 131.23
          },
          Participants: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        required: ['id', 'OrganizationId', 'title', 'CreatorId', 'activeStageId']
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            example: 1
          },
          email: {
            type: 'string',
            example: 'john.doe@test.com'
          },
          login: {
            type: 'string',
            example: 'johnDoe'
          },
          name: {
            type: 'string',
            example: 'John'
          },
          surname: {
            type: 'string',
            example: 'Doe'
          },
          phone: {
            type: 'string',
            example: '380676767676'
          },
          Organization: {
            type: 'object',
            $ref: '#/components/schemas/Organization'
          }
        },
        required: ['email', 'login', 'name', 'surname']
      },
      OrganizationCreationAttributes: {
        type: 'object',
        description: 'Organization creation attributes',
        properties: {
          title: {
            type: 'string',
            example: 'My organization'
          },
          type: {
            type: 'string',
            enum: ['company', 'private'],
            example: 'private'
          },
          country: {
            type: 'string',
            example: 'Ukraine'
          },
          city: {
            type: 'string',
            example: 'Kyiv'
          },
          address: {
            type: 'string',
            example: 'Shevchenka 1'
          },
          postcode: {
            type: 'string',
            example: '00-000'
          },
          phone: {
            type: 'string',
            example: '380676767676'
          },
          email: {
            type: 'string',
            example: 'john.doe.org@test.com'
          },
          website: {
            type: 'string',
            example: 'http://my-org.com'
          }
        },
        required: ['title', 'type', 'name', 'surname']
      },
      Organization: {
        type: 'object',
        description: 'Organization attributes',
        properties: {
          id: {
            type: 'number',
            example: 1
          },
          title: {
            type: 'string',
            example: 'My organization'
          },
          type: {
            type: 'string',
            enum: ['company', 'private'],
            example: 'private'
          },
          country: {
            type: 'string',
            example: 'Ukraine'
          },
          city: {
            type: 'string',
            example: 'Kyiv'
          },
          address: {
            type: 'string',
            example: 'Shevchenka 1'
          },
          postcode: {
            type: 'string',
            example: '00-000'
          },
          phone: {
            type: 'string',
            example: '380676767676'
          },
          email: {
            type: 'string',
            example: 'john.doe.org@test.com'
          },
          website: {
            type: 'string',
            example: 'http://my-org.com'
          }
        },
        required: ['title', 'type', 'name', 'surname']
      }
    }
  }
};
