import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../Material.module';

@Component({
  selector: 'app-cm-toggle',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './cm-toggle.component.html',
  styleUrl: './cm-toggle.component.css'
})
export class CmToggleComponent {
  @Input() settings:any;
}
