import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import $ from 'jquery';
import 'select2';


@Component({
  selector: 'app-cm-select-search',
  imports: [CommonModule],
  templateUrl: './cm-select-search.component.html',
  styleUrl: './cm-select-search.component.css',
  standalone : true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CmSelectSearchComponent),
      multi: true
    }
  ]
})
export class CmSelectSearchComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @Input() data: any = [];
  @Input() disabled = false;

  @ViewChild('selectElem', { static: true }) selectElem!: ElementRef;

  private onChange = (_: any) => {};
  private onTouched = () => {};

  private $select!: JQuery<HTMLElement>;

  ngAfterViewInit(): void {
    this.$select = $(this.selectElem.nativeElement);

    this.$select.select2();

    this.$select.on('change', () => {
      const value = this.$select.val();
      this.onChange(value);
      this.onTouched();
    });

    if (this.disabled) {
      this.$select.prop('disabled', true);
    }
  }

  writeValue(value: any): void {
    if (this.$select) {
      this.$select.val(value).trigger('change');
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.$select) {
      this.$select.prop('disabled', isDisabled);
    }
  }

  ngOnDestroy(): void {
    if (this.$select) {
      this.$select.select2('destroy');
    }
  }
}
