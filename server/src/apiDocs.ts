import { JsonObject } from 'swagger-ui-express';

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
    }
    // {
    //   name: 'Departments'
    // },
    // {
    //   name: 'Files'
    // },
    // {
    //   name: 'Forms'
    // },
    // {
    //   name: 'Plans'
    // },
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
                $ref: '#/components/schemas/registerUserRequest'
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
                  example: 'JWT token'
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
                  example: 'JWT token'
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
            type: 'boolean',
            example: true
          },
          message: {
            type: 'string',
            example: 'Request successful'
          },
          errorOrigin: {
            type: 'number',
            enum: [0, 1],
            example: 0
          }
        },
        required: ['success']
      },
      registerUserRequest: {
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
            $ref: '#/components/schemas/Organization'
          }
        },
        required: ['email', 'login', 'name', 'surname']
      },
      Organization: {
        type: 'object',
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
      }
    }
  }
};
