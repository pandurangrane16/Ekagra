import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as cronstrue from 'cronstrue';
import { MaterialModule } from '../../Material.module';

@Component({
  selector: 'app-cm-cron-expression',
  standalone: true, // ✅ standalone comes before imports, not after
  imports: [CommonModule, MaterialModule, ReactiveFormsModule], // ✅ valid modules
  templateUrl: './cm-cron-expression.component.html',
  styleUrls: ['./cm-cron-expression.component.css'] // ✅ must be plural: styleUrls
})
export class CmCronExpressionComponent implements OnInit {
  @Input() selectedCron: string | null = null;   // 👈 Added Input for edit mode
@Output() cronChange = new EventEmitter<{
  cronString: string;
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}>();

  cronForm: FormGroup;
  cronPreview = '';
  humanReadable = '';

  minutes = ['*', ...Array.from({ length: 60 }, (_, i) => i.toString())];
  hours = ['*', ...Array.from({ length: 24 }, (_, i) => i.toString())];
  daysOfMonth = ['*', ...Array.from({ length: 31 }, (_, i) => (i + 1).toString())];
  months = ['*', ...Array.from({ length: 12 }, (_, i) => (i + 1).toString())];
  daysOfWeek = ['*', '0', '1', '2', '3', '4', '5', '6']; // 0 = Sunday

  minuteSteps: string[] = [...Array.from({ length: 60 }, (_, i) => '*/' + i.toString())];
  hourSteps: string[] = [...Array.from({ length: 24 }, (_, i) => '*/' + i.toString())];

  constructor(private fb: FormBuilder) {
    this.cronForm = this.fb.group({
      minute: ['*'],
      hour: ['*'],
      dayOfMonth: ['*'],
      month: ['*'],
      dayOfWeek: ['*']
    });

    this.cronForm.valueChanges.subscribe(() => this.updateCronPreview());
    this.updateCronPreview();
  }

  ngOnInit() {
    this.cronForm.valueChanges.subscribe(() => this.returnForm());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedCron'] && this.selectedCron) {
      this.setCronValues(this.selectedCron);
    }
  }

  //  setCronValues(cron: string) {
  //   const parts = cron.trim().split(' ');
  //   if (parts.length >= 6) {
  //     this.cronForm.patchValue({
  //       minute: parts[1] ?? '*',
  //       hour: parts[2] ?? '*',
  //       dayOfMonth: parts[3] ?? '*',
  //       month: parts[4] ?? '*',
  //       dayOfWeek: parts[5] ?? '*'
  //     }, { emitEvent: false }); // prevent immediate change emission
  //     this.updatePreview();
  //   }
  // }

  setCronValues(cron: string) {
  const parts = cron.trim().split(' ');
  
  if (parts.length === 5) {
    // Standard 5-field cron: minute hour dayOfMonth month dayOfWeek
    this.cronForm.patchValue({
      minute: parts[0] ?? '*',
      hour: parts[1] ?? '*',
      dayOfMonth: parts[2] ?? '*',
      month: parts[3] ?? '*',
      dayOfWeek: parts[4] ?? '*'
    }, { emitEvent: false });
  } else if (parts.length === 6) {
    // Optional Quartz-like 6-field cron
    this.cronForm.patchValue({
      minute: parts[1] ?? '*',
      hour: parts[2] ?? '*',
      dayOfMonth: parts[3] ?? '*',
      month: parts[4] ?? '*',
      dayOfWeek: parts[5] ?? '*'
    }, { emitEvent: false });
  }

  this.updatePreview();
}

  updateCronPreview() {
    const { minute, hour, dayOfMonth, month, dayOfWeek } = this.cronForm.value;
    this.cronPreview = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    this.humanReadable = cronstrue.toString(this.cronPreview);
  }

  returnForm() {
  const { minute, hour, dayOfMonth, month, dayOfWeek } = this.cronForm.value;
  // this.cronPreview = `0 ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  this.cronPreview = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  this.updatePreview();

  this.cronChange.emit({
    cronString: this.cronPreview,
    minute,
    hour,
    dayOfMonth,
    month,
    dayOfWeek
  });
}

  updatePreview() {
    const { minute, hour, dayOfMonth, month, dayOfWeek } = this.cronForm.value;
    this.humanReadable = `Runs at ${hour}:${minute} on day ${dayOfMonth}, month ${month}, weekday ${dayOfWeek}`;
  }

  getDayOfWeekLabel(value: string): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return value === '*' ? 'Every Day (*)' : days[parseInt(value, 10)] ?? value;
  }
}
