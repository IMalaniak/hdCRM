import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { FilePondModule, registerPlugin } from 'ngx-filepond';

import { UploaderListComponent } from './components';
import { AttachmentService } from './services';

registerPlugin(FilePondPluginFileValidateType);

@NgModule({
  imports: [CommonModule, FilePondModule],
  declarations: [UploaderListComponent],
  exports: [UploaderListComponent],
  providers: [AttachmentService]
})
export class AttachmentsModule {}
