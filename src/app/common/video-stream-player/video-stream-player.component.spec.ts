import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoStreamPlayerComponent } from './video-stream-player.component';

describe('VideoStreamPlayerComponent', () => {
  let component: VideoStreamPlayerComponent;
  let fixture: ComponentFixture<VideoStreamPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoStreamPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoStreamPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
