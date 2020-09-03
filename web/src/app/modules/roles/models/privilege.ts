export interface RolePrivilege {
  add: boolean;
  view: boolean;
  edit: boolean;
  delete: boolean;
}

export interface Privilege {
  id: number;
  keyString: string;
  selected: boolean;
  RolePrivilege: RolePrivilege;
}
