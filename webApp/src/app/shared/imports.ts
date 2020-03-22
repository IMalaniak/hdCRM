import * as _atoms from './components/atoms';
import * as _molecules from './components/molecules';
import * as _organisms from './components/organisms';
import * as _templates from './components/templates';

const ATOMS = [
    _atoms.AtomsIconButtonComponent,
    _atoms.AtomsUserPicComponent
];
const MOLECULES = [
    _molecules.MoleculesUserListSmItemComponent
];
const ORGANISMS = [
    _organisms.ContentBoxComponent,
    _organisms.OrganismsUserListSmComponent
];
const TEMPLATES = [
    _templates.TemplatesBoxUserListSmComponent
];

export const COMPONENTS = [...ATOMS, ...MOLECULES, ...ORGANISMS, ...TEMPLATES];
