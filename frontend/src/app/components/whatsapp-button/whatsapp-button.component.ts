import { Component, Input, signal, computed } from '@angular/core';
import { api } from '../../core/api';
import { STORAGE_KEYS } from '../../core/languages';

@Component({
  selector: 'app-whatsapp-button',
  templateUrl: './whatsapp-button.component.html'
})
export class WhatsAppButtonComponent {
  @Input({ required: true }) text!: string;

  open = signal(false);
  to = signal('');
  status = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');
  error = signal<string | null>(null);

  get language_code() {
    if (typeof window === 'undefined') return 'en';
    return localStorage.getItem(STORAGE_KEYS.languageCode) || 'en';
  }

  openModal() {
    this.open.set(true);
    this.status.set('idle');
    this.error.set(null);
  }

  closeModal() {
    this.open.set(false);
  }

  async send() {
    this.status.set('sending');
    this.error.set(null);
    try {
      await api.sendWhatsApp({ to: this.to(), text: this.text, language_code: this.language_code });
      this.status.set('sent');
    } catch (e: any) {
      this.status.set('error');
      this.error.set(e?.message || 'Failed');
    }
  }
}
