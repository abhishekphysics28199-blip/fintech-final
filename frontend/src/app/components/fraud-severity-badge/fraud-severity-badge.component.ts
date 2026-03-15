import { Component, Input, computed, signal } from '@angular/core';

@Component({
  selector: 'app-fraud-severity-badge',
  templateUrl: './fraud-severity-badge.component.html'
})
export class FraudSeverityBadgeComponent {
  @Input({ required: true }) set severity(val: 'HIGH' | 'MEDIUM' | 'LOW') {
    this._severity.set(val);
  }

  private _severity = signal<'HIGH' | 'MEDIUM' | 'LOW'>('LOW');

  currentBadge = computed(() => {
    const s = this._severity();
    if (s === 'HIGH') return { label: 'High', cls: 'bg-red-500/20 text-red-200 border-red-400/30', dot: '🔴' };
    if (s === 'MEDIUM') return { label: 'Medium', cls: 'bg-yellow-500/20 text-yellow-100 border-yellow-400/30', dot: '🟡' };
    return { label: 'Low', cls: 'bg-green-500/20 text-green-100 border-green-400/30', dot: '🟢' };
  });
}
