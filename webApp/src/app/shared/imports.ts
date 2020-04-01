import * as _components from './components';

const ATOMS = [
    _components.AtomsIconButtonComponent,
    _components.AtomsUserPicComponent
];
const MOLECULES = [
    _components.MoleculesUserListSmItemComponent
];
const ORGANISMS = [
    _components.ContentBoxComponent,
    _components.OrganismsUserListSmComponent
];
const TEMPLATES = [
    _components.TemplatesBoxUserListSmComponent
];

export const COMPONENTS = [...ATOMS, ...MOLECULES, ...ORGANISMS, ...TEMPLATES];
