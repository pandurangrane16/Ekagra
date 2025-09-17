import { Component, SimpleChanges,OnInit ,Input,EventEmitter,Output} from '@angular/core';
import { MaterialModule } from '../../Material.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CmInputComponent } from '../cm-input/cm-input.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cm-cron',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './cm-cron.component.html',
  styleUrls: ['./cm-cron.component.css']
})
export class CmCronComponent {
  cronForm: FormGroup;
  cronExpression: string = '* * * * *';
  humanReadable: string = 'Every minute';
  @Output() cronChange = new EventEmitter<string>();
  @Input() initialCron: string = '* * * * *';  

  constructor(private fb: FormBuilder) {
    this.cronForm = this.fb.group({
      minute: ['*'],
      hour: ['*'],
      dayOfMonth: ['*'],
      month: ['*'],
      dayOfWeek: ['*']
    });
    this.buildCron();
    this.cronForm.valueChanges.subscribe(() => this.buildCron());
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialCron'] && changes['initialCron'].currentValue) {
      this.applyCron(this.initialCron);
    }
  }

    private applyCron(cron: string) {
    const parts = cron.split(' ');
    if (parts.length === 5) {
      this.cronForm.patchValue({
        minute: parts[0],
        hour: parts[1],
        dayOfMonth: parts[2],
        month: parts[3],
        dayOfWeek: parts[4]
      }, { emitEvent: false });

      this.cronExpression = cron;
      this.humanReadable = this.humanize(parts);
    }
  }


  buildCron() {
    const { minute, hour, dayOfMonth, month, dayOfWeek } = this.cronForm.value;
    this.cronExpression = `${minute || '*'} ${hour || '*'} ${dayOfMonth || '*'} ${month || '*'} ${dayOfWeek || '*'}`;
    this.humanReadable = this.humanize([minute, hour, dayOfMonth, month, dayOfWeek]);

       this.cronChange.emit(this.cronExpression);
       
  }


humanize(parts: string[]) {
  const [m, h, dM, mon, dow] = parts;

  const months = [
    '',
    'January','February','March','April','May','June','July','August',
    'September','October','November','December'
  ];
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  // --- helpers ---
  let formatMinute :any;
  formatMinute = (val: string): string => {
  if (val === '*') return 'every minute';
  if (val.includes(',')) {
    return val
      .split(',')
      .map(v => formatMinute(v))
      .join(' and ');
  }
  if (val.startsWith('*/')) return `every ${val.slice(2)}th minute`;
  if (val.includes('-')) {
    const [s, e] = val.split('-');
    return `from minute ${s} through ${e}`;
  }
  return `${val} past`;
};

  const formatHour = (val: string) => {
    if (val === '*') return 'every hour';
    return `hour ${val}`;
  };

  const formatDayOfMonth = (val: string) => {
    if (val === '*') return 'every day';
    if (val.includes('-')) {
      const [s,e] = val.split('-');
      return `from day ${s} through ${e}`;
    }
    return `on day-of-month ${val}`;
  };

  const formatMonth = (val: string) => {
    if (val === '*') return 'every month';
    if (months[+val]) return `in ${months[+val]}`;
    return `month ${val}`;
  };

  const formatDayOfWeek = (val: string) => {
    if (val === '*') return '';
    if (val.includes(',')) {
      return 'on ' + val.split(',').map(v => days[+v] || v).join(' and ');
    }
    return `on ${days[+val] || val}`;
  };

  // --- build sentence ---
  let sentence = 'At ';

  // Minute
  sentence += formatMinute(m) + ' ';

  // Hour
  sentence += formatHour(h) + ' ';

  // Day of month
  if (dM !== '*') sentence += formatDayOfMonth(dM) + ' ';

  // Month
  if (mon !== '*') sentence += formatMonth(mon) + ' ';

  // Day of week
  if (dow !== '*') sentence += formatDayOfWeek(dow);

  return sentence.trim().replace(/\s+/g, ' ');
}


  dayName(d: string) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[+d] || d;
  }


  pad(val: string) {
    return String(val).padStart(2, '0');
  }


  applyPreset(cron: string, description: string) {
    const parts = cron.split(' ');
    this.cronForm.patchValue({
      minute: parts[0],
      hour: parts[1],
      dayOfMonth: parts[2],
      month: parts[3],
      dayOfWeek: parts[4]
    });
    this.cronExpression = cron;
    this.humanReadable = description;
  }


  reset() {
    this.cronForm.setValue({ minute: '*', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' });
  }


  copy() {
    navigator.clipboard.writeText(this.cronExpression).then(() => {
      alert('Copied: ' + this.cronExpression);
    });
  }
}
