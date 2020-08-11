import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'web-user-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent extends BaseComponent {
  @Input() ratingScale: number[];
  @Input() ratingScaleConfig;

  @Output()
  ratingData = new EventEmitter();

  ratingValue: string;
  ratingColor: string;
  selectedRating: number;

  setRatingValue(event) {
    this.selectedRating = event;
    Object.keys(this.ratingScaleConfig).map((key) => {
      let ratingKey = JSON.parse(key);
      ratingKey.forEach((element) => {
        if (element === event) {
          const rating = this.ratingScaleConfig[key];
          this.ratingValue = rating.category;
          this.ratingColor = rating.color;
        }
      });
    });

    document.documentElement.style.setProperty(
      '--rating-color',
      this.ratingColor
    );

    this.ratingData.emit(event);
  }
}
