import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-json-tree',
//   template: `
//     <ul>
//       <ng-container *ngFor="let key of objectKeys(data)">
//         <li>
//           <span (click)="onNodeClick(buildPath(key))" style="cursor: pointer; color: blue;">
//             {{ key }}: 
//             <ng-container *ngIf="isObject(data[key]); else leaf">
//               (object)
//             </ng-container>
//           </span>

//           <app-json-tree
//             *ngIf="isObject(data[key])"
//             [data]="data[key]"
//             [path]="buildPath(key)">
//           </app-json-tree>

//           <ng-template #leaf>
//             {{ data[key] }}
//           </ng-template>
//         </li>
//       </ng-container>
//     </ul>
//   `,
//   styles: [
//     `
//       ul {
//         list-style-type: none;
//         padding-left: 20px;
//       }
//     `
//   ],
//   imports: [CommonModule]
// })
// export class JsonTreeComponent {
//   @Input() data: any;
//   @Input() path: string = '';
//   @Output() nodeSelected = new EventEmitter<string>();

//   objectKeys(obj: any): string[] {
//     return Object.keys(obj);
//   }

//   isObject(value: any): boolean {
//     return value !== null && typeof value === 'object';
//   }

//   buildPath(key: string): string {
//     return this.path ? `${this.path}.${key}` : key;
//   }

//   onNodeClick(fullPath: string) {
//     this.nodeSelected.emit(fullPath);
//   }
// }
@Component({
  selector: 'app-json-tree',
  standalone: true,
  imports: [CommonModule, /* If needed, FormsModule, etc */],
  templateUrl: './json-tree.component.html',
})
export class JsonTreeComponent {
  @Input() data: any;
  @Input() parentPath: string = '';
  @Output() nodeSelected = new EventEmitter<string>();

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  isObject(value: any): boolean {
    return value !== null && typeof value === 'object';
  }

  getFullPath(key: string, parent: string): string {
    return parent ? `${parent}.${key}` : key;
  }

  onNodeSelect(key: string, parent: string) {
    const fullPath = this.getFullPath(key, parent);
    this.nodeSelected.emit(fullPath);   // Emits full JSON path string like "result[0].name"
  }
}