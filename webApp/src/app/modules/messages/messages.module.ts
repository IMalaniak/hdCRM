import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './components/messages.component';
import { MessageService } from './services/message.service';
import { AppMaterialModule } from '@/shared/modules';

@NgModule({
  imports: [CommonModule, AppMaterialModule],
  declarations: [MessagesComponent],
  providers: [MessageService],
  exports: [MessagesComponent]
})
export class MessageModule {}
