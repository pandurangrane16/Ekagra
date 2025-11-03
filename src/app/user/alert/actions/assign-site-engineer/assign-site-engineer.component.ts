import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../Material.module';

@Component({
  selector: 'app-assign-site-engineer',
  imports: [CommonModule,MaterialModule],
  templateUrl: './assign-site-engineer.component.html',
  styleUrl: './assign-site-engineer.component.css'
})
export class AssignSiteEngineerComponent implements OnInit {
  @Input() task : any;

  ngOnInit(): void {
    
  }


  SubmitAction(){

  }
}
