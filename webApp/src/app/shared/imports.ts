import * as _components from './components';

const ATOMS = [
  _components.AtomsIconButtonComponent,
  _components.AtomsProfilePicComponent,
  _components.AtomsUserPicComponent,
  _components.AtomsLinkButtonComponent
];
const MOLECULES = [
  _components.MoleculesProfilePicWithUploaderComponent,
  _components.MoleculesUserListSmItemComponent,
  _components.MoleculesChartComponent
];
const ORGANISMS = [
  _components.OrganismsUserListSmComponent,
  _components.OrganismsCardComponent,
  _components.OrganismsUserDetailsDialogComponent
];
const TEMPLATES = [
  _components.TemplatesAttachmentsListComponent,
  _components.TemplatesBoxUserListSmComponent,
  _components.TemplatesUserProfilePageComponent,
  _components.TemplatesUserDetailsComponent
];

export const COMPONENTS = [...ATOMS, ...MOLECULES, ...ORGANISMS, ...TEMPLATES];
