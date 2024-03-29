import { AuthState } from '@core/modules/auth/store/auth.reducer';
import { User } from '@core/modules/user-api/shared';
import { DynamicFormState } from '@core/store/dynamic-form';
import { FORM_TYPE, FIELD_TYPE } from '@shared/constants';

export const currentUserMock = {
  fullname: 'User Tester',
  id: 1,
  name: 'User',
  surname: 'Tester',
  phone: '+380990990909',
  email: 'test@test.ua',
  locale: 'en',
  createdAt: '2019-01-25T13:37:58.125Z',
  updatedAt: '2019-10-19T09:20:31.515Z',
  OrganizationId: 1,
  StateId: 2,
  DepartmentId: 1,
  RoleId: 1,
  Role: {
    id: 1,
    keyString: 'root',
    Privileges: [
      {
        keyString: 'organizationTab',
        RolePrivilege: { view: true, edit: false, add: false, delete: false }
      },
      {
        keyString: 'integrationTab',
        RolePrivilege: { view: true, edit: false, add: false, delete: false }
      },
      {
        keyString: 'preferenceTab',
        RolePrivilege: { view: true, edit: false, add: false, delete: false }
      },
      {
        keyString: 'user',
        RolePrivilege: { view: true, edit: true, add: true, delete: true }
      },
      {
        keyString: 'plan',
        RolePrivilege: { view: true, edit: true, add: true, delete: true }
      },
      {
        keyString: 'department',
        RolePrivilege: { view: true, edit: true, add: true, delete: true }
      },
      {
        keyString: 'role',
        RolePrivilege: { view: true, edit: true, add: true, delete: true }
      }
    ]
  },
  UserSessions: [
    {
      id: 1,
      IP: '::ffff:10.32.205.200',
      isSuccess: true,
      UA: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
      createdAt: '2020-09-15T06:59:50.487Z',
      updatedAt: '2020-09-15T06:59:50.487Z',
      UserId: 1
    }
  ],
  PasswordAttributes: { updatedAt: '2019-10-16T11:39:39.397Z', passwordExpire: null },
  State: { id: 2, keyString: 'active' },
  picture: null,
  Department: {
    title: 'CEO'
  },
  Organization: {
    id: 1,
    title: 'root',
    type: 'root',
    country: 'Poland',
    city: 'Warsaw',
    address: null,
    postcode: null,
    phone: null,
    email: 'testorg@test.ua',
    createdAt: '2019-01-26T10:26:35.088Z',
    updatedAt: '2019-01-26T10:26:35.088Z'
  }
} as unknown as User;

export const authStateMock: AuthState = {
  loggedIn: true,
  sessionId: 1,
  accessToken: 'token',
  tokenType: 'bearer',
  isTokenRefreshing: false,
  currentUser: currentUserMock,
  loading: false
};

export const formsStateMock: DynamicFormState = {
  isLoading: false,
  ids: [],
  entities: {
    user: {
      key: 'user',
      name: 'User Model Form',
      type: FORM_TYPE.SYSTEM,
      form: [
        {
          controlName: 'name',
          type: FIELD_TYPE.INPUT,
          label: 'Name',
          isEditable: true,
          required: true
        },
        {
          controlName: 'surname',
          type: FIELD_TYPE.INPUT,
          label: 'Surname',
          isEditable: true
        },
        {
          controlName: 'email',
          type: FIELD_TYPE.INPUT,
          label: 'Email',
          isEditable: true
        },
        {
          controlName: 'phone',
          type: FIELD_TYPE.INPUT,
          label: 'Phone',
          isEditable: true
        },
        {
          controlName: 'StateId',
          type: FIELD_TYPE.SELECT,
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
          type: FIELD_TYPE.DATE,
          label: 'Date Created',
          isEditable: false
        },
        {
          controlName: 'updatedAt',
          type: FIELD_TYPE.DATE,
          label: 'Date Updated',
          isEditable: false
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    plan: {
      key: 'plan',
      name: 'Plan Model Form',
      type: FORM_TYPE.SYSTEM,
      form: [
        {
          controlName: 'title',
          type: FIELD_TYPE.INPUT,
          label: 'Title',
          isEditable: true,
          required: true
        },
        {
          controlName: 'description',
          type: FIELD_TYPE.TEXTAREA,
          label: 'Description',
          isEditable: true
        },
        {
          controlName: 'budget',
          type: FIELD_TYPE.INPUT,
          label: 'Budget',
          isEditable: true
        },
        {
          controlName: 'deadline',
          type: FIELD_TYPE.DATE,
          label: 'Deadline',
          isEditable: true
        },
        {
          controlName: 'createdAt',
          type: FIELD_TYPE.DATE,
          label: 'Date Created',
          isEditable: false
        },
        {
          controlName: 'updatedAt',
          type: FIELD_TYPE.DATE,
          label: 'Date Updated',
          isEditable: false
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    'user-organization': {
      key: 'user-organization',
      name: 'User Organization Model Form',
      type: FORM_TYPE.SYSTEM,
      form: [
        {
          controlName: 'title',
          type: FIELD_TYPE.INPUT,
          label: 'Title',
          isEditable: true,
          required: true
        },
        {
          controlName: 'type',
          type: FIELD_TYPE.INPUT,
          label: 'Type',
          isEditable: false,
          required: true
        },
        {
          controlName: 'country',
          type: FIELD_TYPE.INPUT,
          label: 'Country',
          isEditable: true
        },
        {
          controlName: 'city',
          type: FIELD_TYPE.INPUT,
          label: 'City',
          isEditable: true
        },
        {
          controlName: 'address',
          type: FIELD_TYPE.INPUT,
          label: 'Address',
          isEditable: true
        },
        {
          controlName: 'postcode',
          type: FIELD_TYPE.INPUT,
          label: 'Postcode',
          isEditable: true
        },
        {
          controlName: 'phone',
          type: FIELD_TYPE.INPUT,
          label: 'Phone',
          isEditable: true
        },
        {
          controlName: 'email',
          type: FIELD_TYPE.INPUT,
          label: 'Email',
          isEditable: true
        },
        {
          controlName: 'website',
          type: FIELD_TYPE.INPUT,
          label: 'Website',
          isEditable: true
        },
        {
          controlName: 'updatedAt',
          type: FIELD_TYPE.DATE,
          label: 'Date Updated',
          isEditable: false
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    task: {
      key: 'task',
      name: 'Task Model Form',
      type: FORM_TYPE.SYSTEM,
      form: [
        {
          controlName: 'title',
          type: FIELD_TYPE.INPUT,
          label: 'Title',
          isEditable: true,
          required: true
        },
        {
          controlName: 'description',
          type: FIELD_TYPE.TEXTAREA,
          label: 'Description',
          isEditable: true
        },
        {
          controlName: 'TaskPriorityId',
          type: FIELD_TYPE.SELECT,
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
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    role: {
      key: 'role',
      name: 'Role Model Form',
      type: FORM_TYPE.SYSTEM,
      form: [
        {
          controlName: 'keyString',
          type: FIELD_TYPE.INPUT,
          label: 'Title',
          isEditable: true,
          required: true
        },
        {
          controlName: 'createdAt',
          type: FIELD_TYPE.DATE,
          label: 'Date Created',
          isEditable: false
        },
        {
          controlName: 'updatedAt',
          type: FIELD_TYPE.DATE,
          label: 'Date Updated',
          isEditable: false
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    department: {
      key: 'department',
      name: 'Department Model Form',
      type: FORM_TYPE.SYSTEM,
      form: [
        {
          controlName: 'title',
          type: FIELD_TYPE.INPUT,
          label: 'Title',
          isEditable: true,
          required: true
        },
        {
          controlName: 'description',
          type: FIELD_TYPE.TEXTAREA,
          label: 'Description',
          isEditable: true
        },
        {
          controlName: 'createdAt',
          type: FIELD_TYPE.DATE,
          label: 'Date Created',
          isEditable: false
        },
        {
          controlName: 'updatedAt',
          type: FIELD_TYPE.DATE,
          label: 'Date Updated',
          isEditable: false
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
};

export const routerStoreMock = {
  state: {
    root: {
      children: [
        {
          data: {
            animation: 'PrivateView'
          },
          url: [],
          children: [
            {
              data: {
                breadcrumb: 'Planner',
                animation: 'PlannerPage'
              },
              url: [
                {
                  path: 'planner',
                  parameters: {}
                }
              ],
              children: [
                {
                  data: {
                    breadcrumb: 'List',
                    animation: 'PlannerListPage',
                    privilege: 'plan-view'
                  },
                  url: [
                    {
                      path: 'list',
                      parameters: {}
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }
};
