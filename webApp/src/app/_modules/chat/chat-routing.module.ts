import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { 
    ChatsComponent,
    ChatShellComponent
    } from './_components';

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'list' },
    {path: 'list', data: { breadcrumb: 'List', animation: "ChatsListPage" }, component: ChatShellComponent },
    // {path: 'list', data: { breadcrumb: 'Chats' }, component: ChatsComponent },
    // {path: 'details/:id', data: { breadcrumb: 'Chat details' }, component: ChatComponent, resolve: {department: DepartmentResolver}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule {
  static forRoot(): ModuleWithProviders {
    return {
        ngModule: ChatRoutingModule,
        // providers: [DepartmentResolver],
    }
  }
}