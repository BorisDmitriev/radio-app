import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingDialogComponent } from './rating-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { fakeAsync, tick } from '@angular/core/testing'; 

describe('RatingDialogComponent', () => {
  let component: RatingDialogComponent;
  let fixture: ComponentFixture<RatingDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<RatingDialogComponent>>; 

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']); 

    await TestBed.configureTestingModule({
      imports: [FormsModule, RatingDialogComponent], 
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef }, 
        { provide: MAT_DIALOG_DATA, useValue: {rating: 2, comment: 'Test' }}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy(); 
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sollte die Bewertung initialisieren', () => {
    expect(component.rating).toBe(2); 
    expect(component.comment).toBe('Test'); 
  }); 

  it('sollte die Bewertung korrekt erzeugen', () => {
    component.rating = 2; 
    component.setRating(4); 

    expect(component.rating).toBe(4); 

    component.setRating(4); 

    expect(component.rating).toBe(0); 
  }); 

  it('sollte den Dialog schließen', () => {
    component.close(); 

    expect(mockDialogRef.close).toHaveBeenCalledWith(); 
  }); 

  it('sollte die Bewertung einreichen', fakeAsync(() => {
    component.rating = 1; 
    component.comment = 'Test'; 

    component.submit(); 
    tick(); 
    
    expect(mockDialogRef.close).toHaveBeenCalledWith({
      rating: 1,
      comment: 'Test'
    });
  }));
});
