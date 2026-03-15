import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { api, ScamAlert } from '../../core/api';

@Component({
  selector: 'app-scam-ticker',
  templateUrl: './scam-ticker.component.html'
})
export class ScamTickerComponent implements OnInit, OnDestroy {
  items = signal<ScamAlert[]>([]);
  error = signal<string | null>(null);
  
  private intervalId: any;

  text = computed(() => {
    if (this.error()) return "Trending Scams: unable to load right now.";
    const currentItems = this.items();
    if (!currentItems.length) return "Trending Scams in India Today: Loading…";
    const top = currentItems.slice(0, 6).map(x => x.title);
    return `Trending Scams in India Today: ${top.join(" • ")}`;
  });

  async refresh() {
    try {
      this.error.set(null);
      const res = await api.trendingScams();
      this.items.set(res.items || []);
    } catch (e: any) {
      this.error.set(e?.message || "Failed to load");
    }
  }

  ngOnInit() {
    this.refresh();
    this.intervalId = setInterval(() => this.refresh(), 30 * 60 * 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
