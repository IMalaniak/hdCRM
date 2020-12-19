export interface RolePrivilege {
  add: boolean;
  view: boolean;
  edit: boolean;
  delete: boolean;
}

export interface Privilege {
  id: number;
  keyString: string;
  title: string;
  RolePrivilege: RolePrivilege;
  selected?: boolean;
}
