import * as _components from './components';

const ATOMS = [
    _components.AtomsIconButtonComponent,
    _components.AtomsProfilePicComponent,
    _components.AtomsUserPicComponent
];
const MOLECULES = [
    _components.MoleculesProfilePicWithUploaderComponent,
    _components.MoleculesUserListSmItemComponent
];
const ORGANISMS = [
    _components.ContentBoxComponent,
    _components.OrganismsUserListSmComponent
];
const TEMPLATES = [
    _components.TemplatesAttachmentsListComponent,
    _components.TemplatesBoxUserListSmComponent,
    _components.TemplatesUserProfilePageComponent
];

export const COMPONENTS = [...ATOMS, ...MOLECULES, ...ORGANISMS, ...TEMPLATES];
