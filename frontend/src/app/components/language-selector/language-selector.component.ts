import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { LANGUAGES, STORAGE_KEYS } from '../../core/languages';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {
  languages = LANGUAGES;
  selected = signal<string>('en');

  selectedLabel = computed(() => {
    return LANGUAGES.find(l => l.code === this.selected())?.label || "English";
  });

  constructor(private router: Router) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.languageCode);
      if (stored) this.selected.set(stored);
    }
  }

  choose(code: string) {
    this.selected.set(code);
    const label = LANGUAGES.find(l => l.code === code)?.label || code;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.languageCode, code);
      localStorage.setItem(STORAGE_KEYS.languageLabel, label);
    }
    this.router.navigate(['/chat']);
  }
}
