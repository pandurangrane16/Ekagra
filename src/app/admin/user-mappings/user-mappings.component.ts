import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MaterialModule } from '../../Material.module';
import { FormBuilder } from '@angular/forms';

// jQuery declared globally
declare var $: any;

@Component({
  selector: 'app-user-mappings',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './user-mappings.component.html',
  styleUrl: './user-mappings.component.css',
})
export class UserMappingsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('selectElement') selectElement!: ElementRef;
  @Input() options: { id: number; text: string }[] = [];
yourOptions = [
  { id: 0, text: 'All' },
  { id: 1, text: 'One' },
  { id: 2, text: 'Two' },
  { id: 3, text: 'Three' },
  { id: 4, text: 'Shridhar' },
  { id: 5, text: 'Pandu' },
  { id: 6, text: 'Sujit' },
  { id: 7, text: 'AKshay' },
  { id: 8, text: 'Manoj' },
  { id: 9, text: 'Ashutosh' },
];
  selectedValue: number | null = null;
  form: any;

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      select2Control: [null],
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize select2
      $(this.selectElement.nativeElement).select2();

      // Handle change event
      $(this.selectElement.nativeElement).on('change', (event: any) => {
        this.selectedValue = $(event.target).val();
      });
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Destroy select2 instance
      $(this.selectElement.nativeElement).select2('destroy');
    }
  }

  close() {
    // handle modal or dialog close logic if needed
  }
  submit() {}
}
