import { Component, Input } from '@angular/core';
import { LoaderService } from '../../services/common/loader.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../Material.module';

@Component({
  selector: 'app-cm-loader',
  imports: [FormsModule,CommonModule,MaterialModule],
  templateUrl: './cm-loader.component.html',
  styleUrl: './cm-loader.component.css',
  standalone:true
})
export class CmLoaderComponent {
  loaderVal : any;
 constructor(public loaderService: LoaderService) {
 
 }
}
