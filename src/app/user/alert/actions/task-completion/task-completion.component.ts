import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../Material.module';

@Component({
  selector: 'app-task-completion',
  imports: [CommonModule,MaterialModule],
  templateUrl: './task-completion.component.html',
  styleUrl: './task-completion.component.css'
})
export class TaskCompletionComponent implements OnInit{
  @Input() task : any;
  
  
  ngOnInit(): void {
  
  }

  SubmitAction() {
    
  }
  
}
