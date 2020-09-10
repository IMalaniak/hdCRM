export enum ADD_PRIVILEGES {
  DEPARTMENT = 'department-add',
  USER = 'user-add',
  ROLE = 'role-add',
  PLAN = 'plan-add',
  PLAN_ATTACHMENT = 'planAttachment-add'
}

export enum DELETE_PRIVILEGES {
  DEPARTMENT = 'department-delete',
  USER = 'user-delete',
  ROLE = 'role-delete',
  PLAN = 'plan-delete',
  PLAN_ATTACHMENT = 'planAttachment-delete'
}

export enum EDIT_PRIVILEGES {
  DEPARTMENT = 'department-edit',
  USER = 'user-edit',
  ROLE = 'role-edit',
  PLAN = 'plan-edit',
  PLAN_ATTACHMENT = 'planAttachment-edit'
}

export enum VIEW_PRIVILEGES {
  DEPARTMENT = 'department-view',
  USER = 'user-view',
  ROLE = 'role-view',
  PLAN = 'plan-view',
  PLAN_ATTACHMENT = 'planAttachment-view'
}

export enum TAB_PRIVILEGES {
  PREFERENCE = 'preferenceTab-view',
  INTEGRATION = 'integrationTab-view',
  ORGANIZATION = 'organizationTab-view'
}
