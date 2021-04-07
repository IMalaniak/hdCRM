import * as _components from './components';
import * as _pipes from './pipes';
import * as _directives from './directives';

const ATOMS = [
  _components.AtomsIconButtonComponent,
  _components.AtomsProfilePicComponent,
  _components.AtomsUserPicComponent,
  _components.AtomsLinkButtonComponent,
  _components.AtomsNoContentInfoComponent,
  _components.AtomsReadonlyFormFieldComponent,
  _components.AtomsIntegrationCardComponent,
  _components.AtomsInputComponent,
  _components.AtomsTextareaComponent,
  _components.AtomsSelectComponent,
  _components.AtomsDateComponent,
  _components.AtomsCheckboxComponent,
  _components.AtomsRadiogroupComponent
];
const MOLECULES = [
  _components.MoleculesProfilePicWithUploaderComponent,
  _components.MoleculesUserListSmItemComponent,
  _components.MoleculesChartComponent,
  _components.MoleculesToastMessageComponent,
  _components.MoleculesFormFieldComponent,
  _components.MoleculesCardHeaderActionsComponent
];
const ORGANISMS = [
  _components.OrganismsUserListSmComponent,
  _components.OrganismsCardComponent,
  _components.OrganismsUserDetailsDialogComponent
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

export const COMPONENTS = [
  ...ATOMS,
  ...MOLECULES,
  ...ORGANISMS,
  ...TEMPLATES,
  ...DIALOGS,
  _components.InputValidationComponent,
  _components.DynamicFormComponent,
  _components.TableComponent
];
export const PIPES = [_pipes.MemoizePipe, _pipes.DateTimeFormatPipe];
export const DIRECTIVES = [_directives.TrimInputDirective];
