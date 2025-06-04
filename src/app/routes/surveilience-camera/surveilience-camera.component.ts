import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';

interface Section {
  name: string;
  img:string;
  expanded: boolean 
}
interface Location {
  name: string;
  cam:string[];
}

@Component({
    selector: 'app-surveilience-camera',
    imports: [MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule, MatExpansionModule, CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './surveilience-camera.component.html',
    styleUrl: './surveilience-camera.component.css'
})
export class SurveilienceCameraComponent {
  readonly panelOpenState = signal(false);
  
  camera: Section[] = [
    {
      name: 'Camera 1',
      img:'assets/img/cam1.jpg',
      expanded: false 
    },
    {
      name: 'Camera 2',
      img:'assets/img/cam2.jpg',
      expanded: false 
    },
    {
      name: 'Camera 3',
      img:'assets/img/cam3.jpg',
      expanded: false 
    },
    {
      name: 'Camera 4',
      img:'assets/img/cam4.jpg',
      expanded: false 
    }
  ];

  locations: Location[] = [
    {
      name: 'Location 1',
      cam:['Camera 1','Camera 2','Camera 3','Camera 4','Camera 5','Camera 6'],
    },
    {
      name: 'Location 2',
      cam:['Camera 1','Camera 2','Camera 3','Camera 4','Camera 5','Camera 6'],
    },
    {
      name: 'Location 3',
      cam:['Camera 1','Camera 2','Camera 3','Camera 4','Camera 5','Camera 6'],
    },
    {
      name: 'Location 4',
      cam:['Camera 1','Camera 2','Camera 3','Camera 4','Camera 5','Camera 6'],
    },
    {
      name: 'Location 5',
      cam:['Camera 1','Camera 2','Camera 3','Camera 4','Camera 5','Camera 6'],
    },
  ]
 
  toggleExpand(cam: any): void {
    cam.expanded = !cam.expanded;  // Toggle the 'expanded' state of the clicked camera
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top
    document.body.classList.toggle('fullscreenDiv');
  }
}
