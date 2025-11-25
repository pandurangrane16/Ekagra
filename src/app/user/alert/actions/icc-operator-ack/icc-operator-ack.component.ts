import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../Material.module';
import { Globals } from '../../../../utils/global';
@Component({
  selector: 'app-icc-operator-ack',
  imports: [CommonModule,MaterialModule],
  templateUrl: './icc-operator-ack.component.html',
  styleUrl: './icc-operator-ack.component.css'
})
export class IccOperatorAckComponent implements OnInit {
  
  @Input() task: any;
  data :any;

// ngOnInit(): void {
//     this.data = {
//       userName : "Sujitㅤ♡ㅤShrutika"
//     }
//   }



constructor(private globals: Globals) {}
  ngOnInit(): void {

    // 🟢 Ensure user info exists in globals; restore from session if missing
    if (!this.globals.user) {
      const storedUser = sessionStorage.getItem('userInfo');
      if (storedUser) {
        this.globals.user = JSON.parse(storedUser);
        console.log('✅ User restored from sessionStorage:', this.globals.user);
      }
    }

    // 🧾 Set data with username from globals
    this.data = {
      userName: this.globals.user?.name || this.globals.user?.userName ||'Unknown User'
    };
  }
}
