import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { DelayedPreloadingStrategy } from './core/strategies';
import { SocketService } from './shared/services';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, CoreModule, AppRoutingModule],
  providers: [SocketService, DelayedPreloadingStrategy],
  bootstrap: [AppComponent]
})
export class AppModule {}
