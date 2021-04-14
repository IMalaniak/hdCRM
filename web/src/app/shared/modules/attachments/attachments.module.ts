import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// import filepond module
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import { FilePondModule, registerPlugin } from 'ngx-filepond';

import { UploaderListComponent, ProfilepicUploaderComponent } from './components';
import { AttachmentService } from './services';

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageTransform
);

@NgModule({
  imports: [CommonModule, FilePondModule],
  declarations: [UploaderListComponent, ProfilepicUploaderComponent],
  exports: [UploaderListComponent, ProfilepicUploaderComponent],
  providers: [AttachmentService]
})
export class AttachmentsModule {}
