import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorRatingComponent } from './moderator-rating.component';

describe('ModeratorRatingComponent', () => {
  let component: ModeratorRatingComponent;
  let fixture: ComponentFixture<ModeratorRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratorRatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeratorRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
