import { Component, OnInit, Inject } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rating-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rating-dialog.component.html',
  styleUrl: './rating-dialog.component.scss'
})
export class RatingDialogComponent implements OnInit {
  rating = 0;
  comment = "";

  constructor(
    private dialogRef: MatDialogRef<RatingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  setRating(star: number) {
    this.rating = star === this.rating ? 0 : star;
  }
  
  
  close() {
    this.dialogRef.close();
  }
  submit() {
    this.dialogRef.close({
      rating: this.rating,
      comment: this.comment
    })
  }

  ngOnInit() {
    if (this.data) {
      this.rating = this.data.rating || 0; 
      this.comment = this.data.comment || '';
    }
  }
}