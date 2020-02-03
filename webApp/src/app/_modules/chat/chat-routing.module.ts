import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupChatComponent, PrivateChatComponent } from './containers';
import { PrivilegeGuard } from '@/core/_guards';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'group-chat' },
  {
    path: 'group-chat',
    data: {
      breadcrumb: 'Group Chat',
      animation: 'ChatsListPage',
      privilege: 'groupChat-view'
    },
    canActivate: [PrivilegeGuard],
    component: GroupChatComponent
  },
  {
    path: 'private-chat',
    data: {
      breadcrumb: 'Private Chat',
      animation: 'ChatsListPage',
      privilege: 'privateChat-view'
    },
    canActivate: [PrivilegeGuard],
    component: PrivateChatComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ChatRoutingModule
      // providers: [DepartmentResolver],
    };
  }
}
