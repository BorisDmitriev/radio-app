import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistRatingComponent } from './playlist-rating.component';

describe('PlaylistRatingComponent', () => {
  let component: PlaylistRatingComponent;
  let fixture: ComponentFixture<PlaylistRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistRatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
