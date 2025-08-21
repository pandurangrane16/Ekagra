import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cm-query-builder',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cm-query-builder.component.html',
  styleUrl: './cm-query-builder.component.css',
  standalone : true
})
export class CmQueryBuilderComponent {
queryForm!: FormGroup;   // "!" to assure Angular it will be initialized

  fields = ['name', 'age', 'email', 'createdAt'];
  operators = ['$eq', '$ne', '$gt', '$lt', '$in'];

  constructor(private fb: FormBuilder) {
    this.queryForm = this.fb.group({
      conditions: this.fb.array([])   // ✅ initialize FormArray
    });
  }

  get conditions(): FormArray {
    return this.queryForm.get('conditions') as FormArray;
  }

  addCondition() {
    this.conditions.push(
      this.fb.group({
        field: [''],
        operator: ['$eq'],
        value: ['']
      })
    );
  }

  removeCondition(index: number) {
    this.conditions.removeAt(index);
  }

  buildQuery() {
    const query: any = {};
    this.conditions.value.forEach((c: any) => {
      if (c.field && c.operator) {
        query[c.field] = { [c.operator]: c.value };
      }
    });
    return query;
  }  
}
