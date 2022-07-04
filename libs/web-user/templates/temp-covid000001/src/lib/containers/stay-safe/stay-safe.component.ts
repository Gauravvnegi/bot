import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Measures } from 'libs/web-user/shared/src/lib/data-models/safeMeasureConfig.model';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { SafeMeasuresService } from 'libs/web-user/shared/src/lib/services/safe-measures.service';
import { Subscription } from 'rxjs';
import { HyperlinkElementService } from '../../../../../../shared/src/lib/services/hyperlink-element.service';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hospitality-bot-stay-safe',
  templateUrl: './stay-safe.component.html',
  styleUrls: ['./stay-safe.component.scss'],
})
export class StaySafeComponent implements OnInit, OnDestroy {
  @ViewChild('precautionaryMeasures') hyperlinkElement: ElementRef;
  safeMeasures: Measures;
  $subscription: Subscription = new Subscription();
  constructor(
    private _safeMeasures: SafeMeasuresService,
    public _hyperlink: HyperlinkElementService,
    private _hotelService: HotelService,
    private _snackBarService: SnackBarService,
    private _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getSafeMeasures();
    this.listenForElementClicked();
  }

  listenForElementClicked() {
    this.$subscription.add(
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
    this.$subscription.add(
      this._safeMeasures.getSafeMeasures(this._hotelService.hotelId).subscribe(
        (measuresResponse) => {
          this.safeMeasures = measuresResponse;
        },
        ({ error }) => {
          this._translateService
            .get(`MESSAGES.ERROR.${error.type}`)
            .subscribe((translatedMsg) => {
              this._snackBarService.openSnackBarAsText(translatedMsg);
            });
        }
      )
    );
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
    this.$subscription.unsubscribe();
  }
}
