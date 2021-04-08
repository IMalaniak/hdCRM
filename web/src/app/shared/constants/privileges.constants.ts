export enum ADD_PRIVILEGE {
  DEPARTMENT = 'department-add',
  USER = 'user-add',
  ROLE = 'role-add',
  PLAN = 'plan-add',
  PLAN_ATTACHMENT = 'planAttachment-add'
}

export enum DELETE_PRIVILEGE {
  DEPARTMENT = 'department-delete',
  USER = 'user-delete',
  ROLE = 'role-delete',
  PLAN = 'plan-delete',
  PLAN_ATTACHMENT = 'planAttachment-delete'
}

export enum EDIT_PRIVILEGE {
  DEPARTMENT = 'department-edit',
  USER = 'user-edit',
  ROLE = 'role-edit',
  PLAN = 'plan-edit',
  PLAN_ATTACHMENT = 'planAttachment-edit'
}

export enum VIEW_PRIVILEGE {
  DEPARTMENT = 'department-view',
  USER = 'user-view',
  ROLE = 'role-view',
  PLAN = 'plan-view',
  PLAN_ATTACHMENT = 'planAttachment-view',
  STAGES = 'stages-view'
}

export enum TAB_PRIVILEGE {
  PREFERENCE = 'preferenceTab-view',
  INTEGRATION = 'integrationTab-view',
  ORGANIZATION = 'organizationTab-view'
}
