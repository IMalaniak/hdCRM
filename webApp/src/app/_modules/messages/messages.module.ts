import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './_components/messages.component';
import { MessageService } from './_services/message.service';
import { AppMaterialModule } from '@/_shared/modules';

@NgModule({
  imports: [CommonModule, AppMaterialModule],
  declarations: [MessagesComponent],
  providers: [MessageService],
  exports: [MessagesComponent]
})
export class MessageModule {}
