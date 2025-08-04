import {
  ChangeDetectorRef,
  Component,
  OnInit,
  NgZone
} from '@angular/core';
import { LoaderService } from '../../services/common/loader.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../Material.module';

@Component({
  selector: 'app-cm-loader',
  standalone: true,
  imports: [FormsModule, CommonModule, MaterialModule],
  templateUrl: './cm-loader.component.html',
  styleUrl: './cm-loader.component.css'
})
export class CmLoaderComponent implements OnInit {
  loaderVal = false;

  constructor(
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.loaderService.isLoading$.subscribe((val) => {
      this.zone.run(() => {
        this.loaderVal = val;
        console.log("Loader Value : " + this.loaderVal);
        this.cdr.detectChanges(); // Force view update
      });
    });
  }
}
