import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '@/modules/users';
import { Asset } from '@/shared';

@Component({
  selector: 'templates-user-details',
  templateUrl: './templates-user-details.component.html',
  styleUrls: ['./templates-user-details.component.scss']
})
export class TemplatesUserDetailsComponent {
  @Input() user: User;
  @Input() isDialog = false;

  @Output() addFileCall: EventEmitter<Asset> = new EventEmitter();

  onAddFile(asset: Asset): void {
    this.addFileCall.emit(asset);
  }
}
