import { Component, Input } from '@angular/core';
import { LoaderService } from '../../services/common/loader.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cm-loader',
  imports: [FormsModule,CommonModule],
  templateUrl: './cm-loader.component.html',
  styleUrl: './cm-loader.component.css'
})
export class CmLoaderComponent {
  loading$ = this.loaderService.showLoader;

  constructor(private loaderService: LoaderService) {  }
}
