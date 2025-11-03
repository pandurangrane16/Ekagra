import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../Material.module';

@Component({
  selector: 'app-action-closed',
  imports: [CommonModule,MaterialModule],
  templateUrl: './action-closed.component.html',
  styleUrl: './action-closed.component.css'
})
export class ActionClosedComponent implements OnInit{
  @Input() task:any;
  data:any;

  ngOnInit(): void {
    this.data = {
      userName : "Sujit Gaikwad"
    }
  }
}
