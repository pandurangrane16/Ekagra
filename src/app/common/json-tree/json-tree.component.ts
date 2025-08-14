import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-json-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './json-tree.component.html',
})
export class JsonTreeComponent {
  @Input() data: any;
  @Input() parentPath: string = '';
  @Input() showValues = false; // toggle for displaying values
  @Output() nodeSelected = new EventEmitter<string>();

  getKeys(obj: any): string[] {
    return obj && typeof obj === 'object' ? Object.keys(obj) : [];
  }

  isObject(value: any): boolean {
    return value !== null && typeof value === 'object';
  }

  getFullPath(key: string, parent: string): string {
    return parent ? `${parent}.${key}` : key;
  }

  onNodeSelect(key: string, parent: string) {
    const fullPath = this.getFullPath(key, parent);
    this.nodeSelected.emit(fullPath);
  }
}