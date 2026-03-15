import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './pages/home/home.component';
import { AboutPageComponent } from './pages/about/about.component';
import { ChatPageComponent } from './pages/chat/chat.component';
import { ReportPageComponent } from './pages/report/report.component';
import { ScamsPageComponent } from './pages/scams/scams.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'chat', component: ChatPageComponent },
  { path: 'report', component: ReportPageComponent },
  { path: 'scams', component: ScamsPageComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
