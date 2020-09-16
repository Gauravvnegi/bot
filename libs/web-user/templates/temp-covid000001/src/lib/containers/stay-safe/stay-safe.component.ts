import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Measures } from 'libs/web-user/shared/src/lib/data-models/safeMeasureConfig.model';
import { SafeMeasuresService } from 'libs/web-user/shared/src/lib/services/safe-measures.service';
import { HyperlinkElementService } from '../../../../../../shared/src/lib/services/hyperlink-element.service';
import { Subscription } from 'rxjs';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';

@Component({
  selector: 'hospitality-bot-stay-safe',
  templateUrl: './stay-safe.component.html',
  styleUrls: ['./stay-safe.component.scss'],
})
export class StaySafeComponent implements OnInit {
  @ViewChild('precautionaryMeasures') hyperlinkElement: ElementRef;
  safeMeasures: Measures;
  $subscriber: Subscription = new Subscription();
  constructor(
    private _safeMeasures: SafeMeasuresService,
    public _hyperlink: HyperlinkElementService,
    private _hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.getSafeMeasures();
    this.listenForElementClicked();
  }

  listenForElementClicked() {
    this.$subscriber.add(
      this._hyperlink.$element.subscribe((res) => {
        if (
          res &&
          res['element'] &&
          res['element'] === 'precautionaryMeasures'
        ) {
          this.scrollIntoView(this.hyperlinkElement.nativeElement);
        }
      })
    );
  }

  getSafeMeasures() {
    this._safeMeasures
      .getSafeMeasures(this._hotelService.hotelId)
      .subscribe((measuresResponse) => {
        this.safeMeasures = measuresResponse;
      });
  }

  scrollIntoView($element): void {
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
    this._hyperlink.setSelectedElement('');
  }

  ngOnDestroy() {
    this.$subscriber.unsubscribe();
  }
}
