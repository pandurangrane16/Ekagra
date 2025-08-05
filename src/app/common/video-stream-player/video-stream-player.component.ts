import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
@Component({
   selector: 'app-video-stream-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-stream-player.component.html',
  // styleUrls: ['./video-stream-player.component.scss'] // <-- remove or comment this
})
export class VideoStreamPlayerComponent {
 @Input() streamUrl: SafeResourceUrl | null = null;
  safeUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.safeUrl = this.streamUrl;
  }

  ngOnDestroy(): void {
    // Cleanup logic if needed
  }
}
