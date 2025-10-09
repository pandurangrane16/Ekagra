import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as cronstrue from 'cronstrue';
import { MaterialModule } from '../../Material.module';

@Component({
  selector: 'app-cm-cron-expression',
  imports: [CommonModule,MaterialModule,ReactiveFormsModule],
  templateUrl: './cm-cron-expression.component.html',
  styleUrl: './cm-cron-expression.component.css',
  standalone:true
})
export class CmCronExpressionComponent {
cronForm: FormGroup;
  cronPreview: string = '';
  humanReadable: string = '';

  minutes = ['*', ...Array.from({ length: 60 }, (_, i) => i.toString())];
  hours = ['*', ...Array.from({ length: 24 }, (_, i) => i.toString())];
  daysOfMonth = ['*', ...Array.from({ length: 31 }, (_, i) => (i + 1).toString())];
  months = ['*', ...Array.from({ length: 12 }, (_, i) => (i + 1).toString())];
  daysOfWeek = ['*', '0', '1', '2', '3', '4', '5', '6']; // 0 = Sunday

  dayOfWeekNames: Record<string, string> = {
    '0': 'Sunday',
    '1': 'Monday',
    '2': 'Tuesday',
    '3': 'Wednesday',
    '4': 'Thursday',
    '5': 'Friday',
    '6': 'Saturday',
  };

  constructor(private fb: FormBuilder) {
    this.cronForm = this.fb.group({
      minute: ['*'],
      hour: ['*'],
      dayOfMonth: ['*'],
      month: ['*'],
      dayOfWeek: ['*'],
    });

    this.cronForm.valueChanges.subscribe(() => {
      this.updateCronPreview();
    });

    this.updateCronPreview(); // Initial value
  }

  updateCronPreview() {
    const { minute, hour, dayOfMonth, month, dayOfWeek } = this.cronForm.value;
    this.cronPreview = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    this.humanReadable = cronstrue.toString(this.cronPreview);
  }

  getDayOfWeekLabel(value: string) {
    return this.dayOfWeekNames[value] ?? value;
  }
}