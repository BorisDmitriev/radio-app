import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongRequestComponent } from './song-request.component';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SongRequestComponent', () => {
  let component: SongRequestComponent;
  let fixture: ComponentFixture<SongRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongRequestComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
