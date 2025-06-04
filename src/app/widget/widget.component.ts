import { NgComponentOutlet } from '@angular/common';
import { Widget } from './../models/dashboard';
import { Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { WidgetOptionsComponent } from './widget-options/widget-options/widget-options.component';
import { CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-widget',
    imports: [NgComponentOutlet, MatButtonModule, MatIcon, WidgetOptionsComponent, CdkDrag, CdkDragPlaceholder],
    templateUrl: './widget.component.html',
    styleUrl: './widget.component.css',
    host: {
        '[style.grid-area]': '"span " + (data().rows ?? 1) + "/ span " + (data().cols ?? 1)',
    }
})
export class WidgetComponent {

  data=input.required<Widget>();

  showOptions = signal(false);

}
