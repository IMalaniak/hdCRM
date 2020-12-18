import { AuthState } from '@/core/modules/auth/store/auth.reducer';
import { User } from '@/core/modules/user-api/shared';
import { DynamicFormState } from '@/core/store/dynamic-form';
import { FormType, IFieldType } from '@/shared/constants';

export const currentUserMock = ({
  fullname: 'User Tester',
  id: 1,
  name: 'User',
  surname: 'Tester',
  phone: '+380990990909',
  email: 'test@test.ua',
  login: 'TestTest',
  defaultLang: 'en',
  createdAt: '2019-01-25T13:37:58.125Z',
  updatedAt: '2019-10-19T09:20:31.515Z',
  OrganizationId: 1,
  avatarId: null,
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
      UA:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
      createdAt: '2020-09-15T06:59:50.487Z',
      updatedAt: '2020-09-15T06:59:50.487Z',
      UserId: 1
    }
  ],
  PasswordAttributes: { updatedAt: '2019-10-16T11:39:39.397Z', passwordExpire: null },
  State: { id: 2, keyString: 'active' },
  avatar: null,
  Department: {
    title: 'CEO'
  },
  Organization: {
    id: 1,
    title: 'root',
    token: null,
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
} as unknown) as User;

export const authStateMock: AuthState = {
  loggedIn: true,
  sessionId: 1,
  accessToken:
    'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInNlc3Npb25JZCI6NTAsImlhdCI6MTYwMDc3OTg2MiwiZXhwIjoxNjAwNzgwNzYyLCJhdWQiOiJodHRwczovL2hkY3JtLmhlcm9rdWFwcC5jb20ifQ.AMrp2MucBLTFODwSdUTv6agy7q5dPHo3jnW6cP65KKk',
  isTokenValid: true,
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
      type: FormType.SYSTEM,
      form: [
        {
          controlName: 'name',
          type: IFieldType.INPUT,
          label: 'Name',
          isEditable: true,
          required: true
        },
        {
          controlName: 'surname',
          type: IFieldType.INPUT,
          label: 'Surname',
          isEditable: true
        },
        {
          controlName: 'login',
          type: IFieldType.INPUT,
          label: 'Login',
          isEditable: false,
          required: true
        },
        {
          controlName: 'email',
          type: IFieldType.INPUT,
          label: 'Email',
          isEditable: true
        },
        {
          controlName: 'phone',
          type: IFieldType.INPUT,
          label: 'Phone',
          isEditable: true
        },
        {
          controlName: 'StateId',
          type: IFieldType.SELECT,
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
          type: IFieldType.DATE,
          label: 'Date Created',
          isEditable: false
        },
        {
          controlName: 'updatedAt',
          type: IFieldType.DATE,
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
      type: FormType.SYSTEM,
      form: [
        {
          controlName: 'title',
          type: IFieldType.INPUT,
          label: 'Title',
          isEditable: true,
          required: true
        },
        {
          controlName: 'description',
          type: IFieldType.TEXTAREA,
          label: 'Description',
          isEditable: true
        },
        {
          controlName: 'budget',
          type: IFieldType.INPUT,
          label: 'Budget',
          isEditable: true
        },
        {
          controlName: 'deadline',
          type: IFieldType.DATE,
          label: 'Deadline',
          isEditable: true
        },
        {
          controlName: 'createdAt',
          type: IFieldType.DATE,
          label: 'Date Created',
          isEditable: false
        },
        {
          controlName: 'updatedAt',
          type: IFieldType.DATE,
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
      type: FormType.SYSTEM,
      form: [
        {
          controlName: 'title',
          type: IFieldType.INPUT,
          label: 'Title',
          isEditable: true,
          required: true
        },
        {
          controlName: 'type',
          type: IFieldType.INPUT,
          label: 'Type',
          isEditable: false,
          required: true
        },
        {
          controlName: 'country',
          type: IFieldType.INPUT,
          label: 'Country',
          isEditable: true
        },
        {
          controlName: 'city',
          type: IFieldType.INPUT,
          label: 'City',
          isEditable: true
        },
        {
          controlName: 'address',
          type: IFieldType.INPUT,
          label: 'Address',
          isEditable: true
        },
        {
          controlName: 'postcode',
          type: IFieldType.INPUT,
          label: 'Postcode',
          isEditable: true
        },
        {
          controlName: 'phone',
          type: IFieldType.INPUT,
          label: 'Phone',
          isEditable: true
        },
        {
          controlName: 'email',
          type: IFieldType.INPUT,
          label: 'Email',
          isEditable: true
        },
        {
          controlName: 'website',
          type: IFieldType.INPUT,
          label: 'Website',
          isEditable: true
        },
        {
          controlName: 'updatedAt',
          type: IFieldType.DATE,
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
      type: FormType.SYSTEM,
      form: [
        {
          controlName: 'title',
          type: IFieldType.INPUT,
          label: 'Title',
          isEditable: true,
          required: true
        },
        {
          controlName: 'description',
          type: IFieldType.TEXTAREA,
          label: 'Description',
          isEditable: true
        },
        {
          controlName: 'TaskPriorityId',
          type: IFieldType.SELECT,
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
      type: FormType.SYSTEM,
      form: [
        {
          controlName: 'keyString',
          type: IFieldType.INPUT,
          label: 'Title',
          isEditable: true,
          required: true
        },
        {
          controlName: 'createdAt',
          type: IFieldType.DATE,
          label: 'Date Created',
          isEditable: false
        },
        {
          controlName: 'updatedAt',
          type: IFieldType.DATE,
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
      type: FormType.SYSTEM,
      form: [
        {
          controlName: 'title',
          type: IFieldType.INPUT,
          label: 'Title',
          isEditable: true,
          required: true
        },
        {
          controlName: 'description',
          type: IFieldType.TEXTAREA,
          label: 'Description',
          isEditable: true
        },
        {
          controlName: 'createdAt',
          type: IFieldType.DATE,
          label: 'Date Created',
          isEditable: false
        },
        {
          controlName: 'updatedAt',
          type: IFieldType.DATE,
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
