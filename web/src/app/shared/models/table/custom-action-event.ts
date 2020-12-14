import { MatCheckboxChange } from '@angular/material/checkbox';

import { CellActionType } from './cellActionType.enum';

export interface CustomActionEvent {
  action: CellActionType;
  id: number;
  event?: Event | MatCheckboxChange;
}
