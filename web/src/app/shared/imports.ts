import * as _components from './components';
import * as _pipes from './pipes';

const ATOMS = [
  _components.AtomsIconButtonComponent,
  _components.AtomsProfilePicComponent,
  _components.AtomsUserPicComponent,
  _components.AtomsLinkButtonComponent,
  _components.AtomsFormFieldComponent,
  _components.AtomsReadonlyFormFieldComponent,
  _components.AtomsIntegrationCardComponent
];
const MOLECULES = [
  _components.MoleculesProfilePicWithUploaderComponent,
  _components.MoleculesUserListSmItemComponent,
  _components.MoleculesChartComponent,
  _components.MoleculesServerMessageComponent,
  _components.MoleculesFormFieldComponent
];
const ORGANISMS = [
  _components.OrganismsUserListSmComponent,
  _components.OrganismsCardComponent,
  _components.OrganismsUserDetailsDialogComponent,
  _components.OrganismsDynamicFormComponent
];
const TEMPLATES = [
  _components.TemplatesAttachmentsListComponent,
  _components.TemplatesBoxUserListSmComponent,
  _components.TemplatesUserDetailsComponent
];
const DIALOGS = [
  _components.DialogBaseComponent,
  _components.DialogConfirmComponent,
  _components.DialogWithTwoButtonsComponent
];

export const COMPONENTS = [...ATOMS, ...MOLECULES, ...ORGANISMS, ...TEMPLATES, ...DIALOGS];
export const PIPES = [_pipes.MemoizePipe, _pipes.DateTimeFormatPipe];
