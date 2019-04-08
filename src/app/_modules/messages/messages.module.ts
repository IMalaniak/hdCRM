import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './_components/messages.component';
import { MessageService } from './_services/message.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        MessagesComponent
    ],
    providers: [
        MessageService
    ],
    exports: [
        MessagesComponent
    ]
})
export class MessageModule {}
