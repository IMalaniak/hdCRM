import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// import filepond module
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

import { AttachmentService } from './services';
import { UploaderListComponent, ProfilepicUploaderComponent } from './components';

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
