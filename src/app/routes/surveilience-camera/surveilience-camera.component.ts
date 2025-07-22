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
   id: number;
  name: string;
  cameras: Camera[];
}
interface Site {
  id: number;
  name: string;
  locations: Location[];
}
interface Camera {
  id: number;
  name: string;
  img: string;
  expanded: boolean;
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
sites: Site[] = [
  {
    id: 1,
    name: 'Mulund',
    locations: [
      {
        id: 101,
        name: 'Mulund Checknaka',
        cameras: [
          { id: 1001, name: 'Camera 1', img: 'assets/img/cam1.jpg', expanded: false },
          { id: 1002, name: 'Camera 2', img: 'assets/img/cam2.jpg', expanded: false }
        ]
      },
      {
        id: 102,
        name: 'Mulund station',
        cameras: [
          { id: 1003, name: 'Camera 3', img: 'assets/img/cam3.jpg', expanded: false }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Bhandup',
    locations: [
      {
        id: 201,
        name: 'Sonapur signal',
        cameras: [
          { id: 2001, name: 'Camera A1', img: 'assets/img/cam1.jpg', expanded: false }
        ]
      },
      {
        id: 202,
        name: 'Asian paints',
        cameras: [
          { id: 2002, name: 'Camera A2', img: 'assets/img/cam1.jpg', expanded: false }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Vikhroli',
    locations: [
      {
        id: 301,
        name: 'Asian Paint signal',
        cameras: [
          { id: 3001, name: 'Camera B1', img: 'assets/img/cam1.jpg', expanded: false }
        ]
      }
    ]
  },
  {
    id: 4,
    name: 'Thane',
    locations: [
      {
        id: 401,
        name: 'Bhandup station signal',
        cameras: [
          { id: 4001, name: 'Camera C1', img: 'assets/img/cam1.jpg', expanded: false }
        ]
      }
    ]
  },
  {
    id: 5,
    name: 'Dombivali',
    locations: [
      {
        id: 501,
        name: 'Metro mall junction',
        cameras: [
          { id: 5001, name: 'Camera D1', img: 'assets/img/cam1.jpg', expanded: false }
        ]
      }
    ]
  },
  {
    id: 6,
    name: 'Dadar',
    locations: [
      {
        id: 601,
        name: 'Magnet mall junction',
        cameras: [
          { id: 6001, name: 'Camera E1', img: 'assets/img/cam1.jpg', expanded: false }
        ]
      }
    ]
  }
];
onCameraSelect(siteId: number, locId: number, camId: number) {
  const site = this.sites.find(s => s.id === siteId);
  const location = site?.locations.find(l => l.id === locId);
  const camera = location?.cameras.find(c => c.id === camId);

  if (camera) {
    console.log('Selected Camera:', camera);
    // You can display details, open a modal, or fetch API data here
  }
}
  // locations: Location[] = [
  //   {
  //     name: 'Location 1',
  //     cameras:['Camera 1','Camera 2','Camera 3','Camera 4','Camera 5','Camera 6'],
  //   },
  //   {
  //     name: 'Location 2',
  //     cameras:['Camera 1','Camera 2','Camera 3','Camera 4','Camera 5','Camera 6'],
  //   },
  //   {
  //     name: 'Location 3',
  //     cameras:['Camera 1','Camera 2','Camera 3','Camera 4','Camera 5','Camera 6'],
  //   },
  //   {
  //     name: 'Location 4',
  //     cameras:['Camera 1','Camera 2','Camera 3','Camera 4','Camera 5','Camera 6'],
  //   },
  //   {
  //     name: 'Location 5',
  //     cameras:['Camera 1','Camera 2','Camera 3','Camera 4','Camera 5','Camera 6'],
  //   },
  // ]
 
  toggleExpand(cam: any): void {
    cam.expanded = !cam.expanded;  // Toggle the 'expanded' state of the clicked camera
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top
    document.body.classList.toggle('fullscreenDiv');
  }
}
