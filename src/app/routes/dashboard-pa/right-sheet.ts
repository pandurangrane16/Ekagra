import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormField, MatFormFieldModule, MatHint, MatLabel } from "@angular/material/form-field";
import { MatSelect, MatOption } from "@angular/material/select";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from "@angular/material/checkbox";
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
@Component({
  selector: 'app-right-sheet',
  templateUrl: './right-sheet.html',
  styleUrl: './right-sheet.css',
  imports: [CommonModule, MatFormField, MatSelect, MatOption, MatButtonModule, MatCheckbox, MatIcon, MatHint, MatLabel,MatFormFieldModule,
    MatInputModule,
    MatIconModule,MatTabsModule ,MatIconModule 
    ]
})
export class RightSheetComponent {
links = [
  // { label: 'Live', icon: 'campaign' },
  { label: 'Recorded File', icon: 'settings_voice' },
  // { label: 'Uploaded File', icon: 'upload' }
];
activeLink = this.links[0]; // default tab
innerlinks = ['PA', 'Zone'];
activeInnerlink = this.innerlinks[0]; // default tab
selectedFileName = '';

onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFileName = input.files[0].name;
    // store file, upload etc
  } else {
    this.selectedFileName = '';
  }
}

}
