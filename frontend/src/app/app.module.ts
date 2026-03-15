import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared.module';

// App root and pages
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home/home.component';
import { AboutPageComponent } from './pages/about/about.component';
import { ChatPageComponent } from './pages/chat/chat.component';
import { ReportPageComponent } from './pages/report/report.component';
import { ScamsPageComponent } from './pages/scams/scams.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    AboutPageComponent,
    ChatPageComponent,
    ReportPageComponent,
    ScamsPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
