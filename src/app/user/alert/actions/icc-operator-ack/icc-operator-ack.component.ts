import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../Material.module';

@Component({
  selector: 'app-icc-operator-ack',
  imports: [CommonModule,MaterialModule],
  templateUrl: './icc-operator-ack.component.html',
  styleUrl: './icc-operator-ack.component.css'
})
export class IccOperatorAckComponent implements OnInit {
  
  @Input() task: any;
  data :any;

ngOnInit(): void {
    this.data = {
      userName : "Sujitㅤ♡ㅤShrutika"
    }
  }
}
