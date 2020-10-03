import { AuthState } from '@/core/auth/store/auth.reducer';
import { User } from '@/modules/users/models';

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
