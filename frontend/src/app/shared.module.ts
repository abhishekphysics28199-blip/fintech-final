import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Shared Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { ScamTickerComponent } from './components/scam-ticker/scam-ticker.component';
import { FraudSeverityBadgeComponent } from './components/fraud-severity-badge/fraud-severity-badge.component';
import { WhatsAppButtonComponent } from './components/whatsapp-button/whatsapp-button.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';

const SHARED_COMPONENTS = [
  NavbarComponent,
  ScamTickerComponent,
  FraudSeverityBadgeComponent,
  WhatsAppButtonComponent,
  LanguageSelectorComponent,
  ChatWindowComponent
];

@NgModule({
  declarations: [
    ...SHARED_COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ...SHARED_COMPONENTS
  ]
})
export class SharedModule { }
