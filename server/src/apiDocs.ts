import { JsonObject } from 'swagger-ui-express';

import { FIELD_TYPE, FORM_TYPE, DATE_FORMAT, ITEMS_PER_PAGE, LIST_VIEW, TIME_FORMAT, USER_STATE } from './constants';
import { enumToArray } from './utils/enumToArray';

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
            $ref: '#/parameters/id'
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
            $ref: '#/parameters/id'
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
            $ref: '#/parameters/id'
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
      get: {
        summary: 'Get filtered list of forms',
        tags: ['Forms'],
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
            description: 'Forms list',
            content: {
              'application/json': {
                schema: buildCollectionApiResponse('#/components/schemas/FormAttributes')
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
      },
      put: {
        summary: 'Update form',
        tags: ['Forms'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/formName'
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
            description: 'Form updated',
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
      },
      delete: {
        summary: 'Delete form by formName',
        tags: ['Forms'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/formName'
          }
        ],
        responses: {
          '200': {
            description: 'Form deleted successfully',
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
            $ref: '#/parameters/id'
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
            $ref: '#/parameters/id'
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
            $ref: '#/parameters/id'
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
    },
    '/api/preferences': {
      get: {
        summary: 'Get list of preferences',
        tags: ['Preferences'],
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Preferences list',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PreferenceList'
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
      },
      post: {
        summary: 'Set new preference',
        tags: ['Preferences'],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Preference'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Preference',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/Preference')
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
    '/api/privileges': {
      get: {
        summary: 'Get list of privileges',
        tags: ['Privileges'],
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Privilege list',
            content: {
              'application/json': {
                schema: buildCollectionApiResponse('#/components/schemas/Privilege')
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
        summary: 'Create a new privilege',
        tags: ['Privileges'],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PrivilegeCreationAttributes'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Privilege',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/Privilege')
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
    '/api/roles': {
      get: {
        summary: 'Get filtered list of roles',
        tags: ['Roles'],
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
            description: 'Role list',
            content: {
              'application/json': {
                schema: buildCollectionApiResponse('#/components/schemas/Role')
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
        summary: 'Create a new role',
        tags: ['Roles'],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RoleCreationAttributes'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Role',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/Role')
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
    '/api/roles/{id}': {
      get: {
        summary: 'Get role by id',
        tags: ['Roles'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/id'
          }
        ],
        responses: {
          '200': {
            description: 'Role',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/Role')
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
        summary: 'Update role',
        tags: ['Roles'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/id'
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Role'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Role updated',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/Role')
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
        summary: 'Delete role by id',
        tags: ['Roles'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/id'
          }
        ],
        responses: {
          '200': {
            description: 'Role deleted successfully',
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
    '/api/roles/dashboard': {
      get: {
        summary: 'Get roles dashboard data',
        tags: ['Roles'],
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Roles dashboard data',
            content: {
              'application/json': {
                schema: buildCollectionApiResponse('#/components/schemas/Role')
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
    '/api/stages': {
      get: {
        summary: 'Get list of stages',
        tags: ['Stages'],
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Stages list',
            content: {
              'application/json': {
                schema: buildCollectionApiResponse('#/components/schemas/Stage')
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
        summary: 'Create new stage',
        tags: ['Stages'],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Stage'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Stage',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/Stage')
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
    '/api/task-priorities': {
      get: {
        summary: 'Get list of task priorities',
        tags: ['Task priorities'],
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Task priorities list',
            content: {
              'application/json': {
                schema: buildCollectionApiResponse('#/components/schemas/TaskPriority')
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
    '/api/tasks': {
      get: {
        summary: 'Get list of tasks',
        tags: ['Tasks'],
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'Task list',
            content: {
              'application/json': {
                schema: buildCollectionApiResponse('#/components/schemas/Task')
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
        summary: 'Create a new task',
        tags: ['Tasks'],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/TaskCreationAttributes'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Task',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/Task')
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
    '/api/tasks/{id}': {
      // get: {
      //   summary: 'Get task by id',
      //   tags: ['Tasks'],
      //   security: [
      //     {
      //       bearerAuth: []
      //     }
      //   ],
      //   parameters: [
      //     {
      //       $ref: '#/parameters/id'
      //     }
      //   ],
      //   responses: {
      //     '200': {
      //       description: 'Task',
      //       content: {
      //         'application/json': {
      //           schema: buildItemApiResponse('#/components/schemas/Task')
      //         }
      //       }
      //     },
      //     '400': {
      //       $ref: '#/components/responses/BadRequest'
      //     },
      //     '401': {
      //       $ref: '#/components/responses/Unauthorized'
      //     },
      //     '500': {
      //       description: 'Internal server error'
      //     }
      //   }
      // },
      put: {
        summary: 'Update task',
        tags: ['Tasks'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/id'
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Task'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Task updated',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/Task')
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
        summary: 'Delete task by id',
        tags: ['Tasks'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/id'
          }
        ],
        responses: {
          '200': {
            description: 'Task deleted successfully',
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
    '/api/tasks/task-multiple/{taskIds}': {
      put: {
        summary: 'Delete multiple tasks',
        tags: ['Tasks'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            schema: {
              name: 'taskIds',
              in: 'path',
              description: 'The identifier of the item',
              required: true,
              schema: {
                type: 'string'
              }
            }
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                parameters: {
                  taskIds: {
                    type: 'array',
                    items: {
                      type: 'number'
                    },
                    required: true
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Tasks deleted',
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
    '/api/users': {
      get: {
        summary: 'Get filtered list of users',
        tags: ['Users'],
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
            description: 'User list',
            content: {
              'application/json': {
                schema: buildCollectionApiResponse('#/components/schemas/User')
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
        summary: 'Create a new user',
        tags: ['Users'],
        security: [
          {
            bearerAuth: []
          }
        ],
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
            description: 'User',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/User')
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
    '/api/users/{id}': {
      get: {
        summary: 'Get user by id',
        tags: ['Users'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/id'
          }
        ],
        responses: {
          '200': {
            description: 'User',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/User')
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
        summary: 'Update user',
        tags: ['Users'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/id'
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User updated',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/User')
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
        summary: 'Delete user by id',
        tags: ['Users'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/id'
          }
        ],
        responses: {
          '200': {
            description: 'User deleted successfully',
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
    '/api/users/profile': {
      get: {
        summary: 'Get user profile',
        tags: ['Users'],
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          '200': {
            description: 'User',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/User')
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
        summary: 'Update user profile',
        tags: ['Users'],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User updated',
            content: {
              'application/json': {
                schema: buildItemApiResponse('#/components/schemas/User')
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
    '/api/users/invite': {
      post: {
        summary: 'Invite a new user',
        tags: ['Users'],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/UserCreationAttributes'
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User',
            content: {
              'application/json': {
                schema: buildCollectionApiResponse('#/components/schemas/User')
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
    '/api/users/session/{id}': {
      delete: {
        summary: 'Delete user session by id',
        tags: ['Users'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/id'
          }
        ],
        responses: {
          '200': {
            description: 'User session deleted successfully',
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
    '/api/users/session-multiple/{id}': {
      put: {
        summary: 'Delete multiple user sessions by id',
        tags: ['Users'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            schema: {
              name: 'sessionIds',
              in: 'path',
              description: 'Identifiers of the items',
              required: true,
              schema: {
                type: 'string'
              }
            }
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                parameters: {
                  sessionIds: {
                    type: 'array',
                    items: {
                      type: 'number'
                    },
                    required: true
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User sessions deleted successfully',
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
    '/api/users/org/{id}': {
      put: {
        summary: 'Update user organization by id',
        tags: ['Users'],
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            $ref: '#/parameters/id'
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Organization'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'User organization updated successfully',
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
    '/api/users/change-password': {
      post: {
        summary: 'Change user password',
        tags: ['Users'],
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                description: 'Change user password',
                type: 'object',
                properties: {
                  oldPassword: {
                    type: 'string'
                  },
                  newPassword: {
                    type: 'string'
                  },
                  verifyPassword: {
                    type: 'string'
                  },
                  deleteSessions: {
                    type: 'boolean'
                  }
                },
                required: ['oldPassword', 'newPassword', 'verifyPassword', 'deleteSessions']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Password have been changed',
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
        type: 'number'
      },
      required: true,
      default: 10,
      description: 'Results page size'
    },
    pageIndex: {
      in: 'query',
      name: 'pageIndex',
      schema: {
        type: 'number'
      },
      required: true,
      default: 0,
      description: 'Results page index'
    },
    sortIndex: {
      in: 'query',
      name: 'sortIndex',
      schema: {
        type: 'string'
      },
      default: 'id',
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
      default: 'asc',
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
    id: {
      name: 'id',
      in: 'path',
      description: 'The identifier of the item',
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
          type: { type: 'string', enum: enumToArray(FIELD_TYPE) },
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
          type: { type: 'string', enum: enumToArray(FORM_TYPE) },
          form: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/FormItem'
            }
          }
        },
        required: ['key', 'name', 'type', 'form']
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
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          }
        },
        required: ['id', 'OrganizationId', 'title', 'createdAt', 'updatedAt']
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
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          }
        },
        required: ['id', 'OrganizationId', 'title', 'CreatorId', 'activeStageId', 'createdAt', 'updatedAt']
      },
      PreferenceCreationAttributes: {
        type: 'object',
        description: 'Preference creation attributes',
        properties: {
          listView: {
            type: 'string',
            enum: enumToArray(LIST_VIEW),
            default: LIST_VIEW.LIST
          },
          timeFormat: {
            type: 'string',
            enum: enumToArray(TIME_FORMAT),
            default: TIME_FORMAT.LONG_TIME
          },
          dateFormat: {
            type: 'string',
            enum: enumToArray(DATE_FORMAT),
            default: DATE_FORMAT.FULL_DATE
          },
          itemsPerPage: {
            type: 'string',
            enum: enumToArray(ITEMS_PER_PAGE),
            default: ITEMS_PER_PAGE.FIVE
          },
          listOutlineBorders: {
            type: 'boolean',
            default: true
          },
          UserId: {
            type: 'number',
            example: 1
          }
        },
        required: ['UserId', 'listView', 'timeFormat', 'dateFormat', 'itemsPerPage', 'listOutlineBorders']
      },
      Preference: {
        type: 'object',
        description: 'Preference attributes',
        properties: {
          listView: {
            type: 'string',
            enum: enumToArray(LIST_VIEW)
          },
          timeFormat: {
            type: 'string',
            enum: enumToArray(TIME_FORMAT)
          },
          dateFormat: {
            type: 'string',
            enum: enumToArray(DATE_FORMAT)
          },
          itemsPerPage: {
            type: 'string',
            enum: enumToArray(ITEMS_PER_PAGE)
          },
          listOutlineBorders: {
            type: 'boolean'
          },
          UserId: {
            type: 'number',
            example: 1
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          }
        },
        required: [
          'UserId',
          'listView',
          'timeFormat',
          'dateFormat',
          'itemsPerPage',
          'listOutlineBorders',
          'createdAt',
          'updatedAt'
        ]
      },
      PreferenceList: {
        type: 'object',
        description: 'Preference list attributes',
        properties: {
          success: {
            type: 'boolean'
          },
          data: {
            type: 'object',
            properties: {
              listView: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: enumToArray(LIST_VIEW)
                }
              },
              timeFormat: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: enumToArray(TIME_FORMAT)
                }
              },
              dateFormat: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: enumToArray(DATE_FORMAT)
                }
              },
              itemsPerPage: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: enumToArray(ITEMS_PER_PAGE)
                }
              }
            }
          }
        },
        required: ['success', 'data']
      },
      PrivilegeCreationAttributes: {
        type: 'object',
        description: 'Privilege creation attributes',
        properties: {
          keyString: {
            type: 'string',
            example: 'userManagement'
          },
          title: {
            type: 'string',
            example: 'User Management'
          }
        },
        required: ['keyString']
      },
      RolePrivilege: {
        type: 'object',
        description: 'Role Privilege attributes',
        properties: {
          RoleId: {
            type: 'number',
            example: 1
          },
          PrivilegeId: {
            type: 'number',
            example: 1
          },
          view: {
            type: 'boolean'
          },
          edit: {
            type: 'boolean'
          },
          add: {
            type: 'boolean'
          },
          delete: {
            type: 'boolean'
          },
          Role: {
            type: 'object',
            schema: {
              $ref: '#/components/schemas/Role'
            }
          },
          Privilege: {
            type: 'object',
            schema: {
              $ref: '#/components/schemas/Privilege'
            }
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          }
        },
        required: ['RoleId', 'PrivilegeId', 'add', 'view', 'edit', 'delete', 'createdAt', 'updatedAt']
      },
      Privilege: {
        type: 'object',
        description: 'Plan attributes',
        properties: {
          id: {
            type: 'number',
            example: 1
          },
          keyString: {
            type: 'string',
            example: 'userManagement'
          },
          title: {
            type: 'string',
            example: 'User Management'
          },
          Roles: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Role'
            }
          },
          RolePrivilege: {
            type: 'object',
            schema: {
              $ref: '#/components/schemas/RolePrivilege'
            }
          }
        },
        required: ['id', 'keyString', 'RolePrivilege']
      },
      RoleCreationAttributes: {
        type: 'object',
        description: 'Role creation attributes',
        properties: {
          keyString: {
            type: 'string',
            example: 'Administrator'
          },
          Privileges: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Privilege'
            }
          },
          Users: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        required: ['keyString']
      },
      Role: {
        type: 'object',
        description: 'Role attributes',
        properties: {
          id: {
            type: 'number',
            example: 1
          },
          OrganizationId: {
            type: 'number',
            example: 1
          },
          keyString: {
            type: 'string',
            example: 'Administrator'
          },
          Privileges: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Privilege'
            }
          },
          Users: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/User'
            }
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          }
        },
        required: ['id', 'OrganizationId', 'keyString', 'createdAt', 'updatedAt']
      },
      StageCreationAttributes: {
        type: 'object',
        description: 'Stage creation attributes',
        properties: {
          keyString: {
            type: 'string',
            example: 'inProgress'
          }
        },
        required: ['keyString']
      },
      Stage: {
        type: 'object',
        description: 'Stage attributes',
        properties: {
          id: {
            type: 'number',
            example: 1
          },
          keyString: {
            type: 'string',
            example: 'inProgress'
          },
          Plans: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Plan'
            }
          },
          Details: {
            $ref: '#/components/schemas/PlanStage'
          }
        },
        required: ['id', 'keyString']
      },
      PlanStage: {
        type: 'object',
        description: 'Plan Stage attributes',
        properties: {
          id: {
            type: 'number',
            example: 1
          },
          PlanId: {
            type: 'number',
            example: 1
          },
          StageId: {
            type: 'number',
            example: 1
          },
          order: {
            type: 'number',
            example: 1
          },
          completed: {
            type: 'boolean'
          },
          description: {
            type: 'string'
          },
          Plan: {
            $ref: '#/components/schemas/Plan'
          },
          Stage: {
            $ref: '#/components/schemas/Stage'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          }
        },
        required: ['id', 'PlanId', 'StageId', 'order', 'completed', 'Plan', 'Stage', 'createdAt', 'updatedAt']
      },
      TaskPriority: {
        type: 'object',
        description: 'TaskPriority attributes',
        properties: {
          id: {
            type: 'number',
            example: 1
          },
          value: {
            type: 'number',
            example: 1
          },
          label: {
            type: 'string',
            example: 'Important'
          },
          Tasks: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Task'
            }
          }
        },
        required: ['id', 'value', 'label']
      },
      TaskCreationAttributes: {
        type: 'object',
        description: 'Task attributes',
        properties: {
          CreatorId: {
            type: 'number',
            example: 1
          },
          TaskPriorityId: {
            type: 'number',
            example: 1
          },
          title: {
            type: 'string',
            example: 'Important'
          },
          isCompleted: {
            type: 'boolean',
            default: false
          },
          description: {
            type: 'string',
            example: 'This is task description'
          }
        },
        required: ['CreatorId', 'TaskPriorityId', 'title']
      },
      Task: {
        type: 'object',
        description: 'Task attributes',
        properties: {
          id: {
            type: 'number',
            example: 1
          },
          CreatorId: {
            type: 'number',
            example: 1
          },
          Creator: {
            $ref: '#/components/schemas/User'
          },
          TaskPriorityId: {
            type: 'number',
            example: 1
          },
          Priority: {
            $ref: '#/components/schemas/TaskPriority'
          },
          title: {
            type: 'string',
            example: 'Important'
          },
          isCompleted: {
            type: 'boolean'
          },
          description: {
            type: 'string',
            example: 'This is task description'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          }
        },
        required: ['id', 'CreatorId', 'TaskPriorityId', 'title', 'isCompleted', 'createdAt', 'updatedAt']
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
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            example: 1
          },
          OrganizationId: {
            type: 'number',
            example: 1
          },
          DepartmentId: {
            type: 'number',
            example: 1
          },
          RoleId: {
            type: 'number',
            example: 1
          },
          avatarId: {
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
          fullname: {
            type: 'string',
            example: 'John Doe'
          },
          phone: {
            type: 'string',
            example: '380676767676'
          },
          defaultLang: {
            type: 'string',
            example: 'en'
          },
          state: {
            type: 'string',
            enum: enumToArray(USER_STATE)
          },
          Organization: {
            type: 'object',
            $ref: '#/components/schemas/Organization'
          },
          Department: {
            type: 'object',
            $ref: '#/components/schemas/Department'
          },
          Role: {
            type: 'object',
            $ref: '#/components/schemas/Role'
          },
          Preference: {
            type: 'object',
            $ref: '#/components/schemas/Preference'
          },
          UserSessions: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/UserSession'
            }
          },
          PasswordAttributes: {
            type: 'object',
            $ref: '#/components/schemas/PasswordAttributes'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          }
        },
        required: ['id', 'OrganizationId', 'email', 'login', 'name', 'surname', 'state', 'createdAt', 'updatedAt']
      },
      UserSession: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            example: 1
          },
          UserId: {
            type: 'number',
            example: 1
          },
          IP: {
            type: 'string',
            example: '192.168.0.1'
          },
          isSuccess: {
            type: 'boolean'
          },
          UA: {
            type: 'string',
            example:
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          }
        },
        required: ['id', 'UserId', 'IP', 'isSuccess', 'UA', 'createdAt', 'updatedAt']
      },
      PasswordAttributes: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            example: 1
          },
          UserId: {
            type: 'number',
            example: 1
          },
          token: {
            type: 'string',
            example: 'token'
          },
          tokenExpire: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          },
          passwordExpire: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          },
          User: {
            $ref: '#/components/schemas/User'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          }
        },
        required: ['id', 'UserId', 'passwordExpire', 'createdAt', 'updatedAt']
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
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2020-10-11T17:39:36.493Z'
          }
        },
        required: ['id', 'title', 'type', 'name', 'surname', 'createdAt', 'updatedAt']
      }
    }
  }
};
