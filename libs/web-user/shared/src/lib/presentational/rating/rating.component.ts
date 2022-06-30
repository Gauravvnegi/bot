import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base.component';
import { filter } from 'rxjs/operators';
export interface IRatingScaleConfig {
  [key: string]: IRatingConfig;
}

export interface IRatingConfig {
  category: string;
  color: string;
}

export interface ISelectedRatingConfig extends IRatingConfig {
  rating: number;
}
@Component({
  selector: 'web-user-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent extends BaseComponent {
  @Input() ratingScale: number[];
  @Input() ratingScaleConfig: IRatingScaleConfig;
  @Output()
  onRatingSelection: EventEmitter<
    Pick<ISelectedRatingConfig, 'rating'>
  > = new EventEmitter();

  selectedRatingObj: ISelectedRatingConfig;

  ngOnInit() {
    super.ngOnInit();
    this.listenForZeroRating();
  }

  listenForZeroRating() {
    this.parentForm
      .get(this.name)
      .valueChanges.pipe(filter((val) => val === 0))
      .subscribe((res) => {
        this.selectedRatingObj = null;
      });
  }

  setRatingValue(rating: number) {
    Object.keys(this.ratingScaleConfig).map((key) => {
      let ratingKey = JSON.parse(key);
      ratingKey.forEach((element) => {
        if (element === rating) {
          this.selectedRatingObj = { ...this.ratingScaleConfig[key], rating };
        }
      });
    });

    // document.documentElement.style.setProperty(
    //   '--rating-color',
    //   this.selectedRatingObj.color
    // );

    this.parentForm.get(this.name).patchValue(rating);
    this.onRatingSelection.emit({ rating });
  }
}
