import { Component, OnInit, signal, computed } from '@angular/core';
import { api, ScamAlert } from '../../core/api';

@Component({
  selector: 'app-scams-page',
  templateUrl: './scams.component.html'
})
export class ScamsPageComponent implements OnInit {
  items = signal<ScamAlert[]>([]);
  stateInput = signal('');
  loading = signal(true);
  error = signal<string | null>(null);

  title = computed(() => {
    return this.stateInput() ? `Live Scam Alerts — ${this.stateInput()}` : "Trending Scams in India Today";
  });

  ngOnInit() {
    this.load();
  }

  onStateChange(val: string) {
    this.stateInput.set(val);
    this.load();
  }

  async load() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = this.stateInput() ? await api.scamsByState(this.stateInput()) : await api.trendingScams();
      this.items.set(res.items || []);
    } catch (e: any) {
      this.error.set(e?.message || "Failed");
    } finally {
      this.loading.set(false);
    }
  }
}
