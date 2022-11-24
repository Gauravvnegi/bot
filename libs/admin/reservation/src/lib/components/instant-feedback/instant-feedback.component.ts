import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { HotelDetailService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'hospitality-bot-instant-feedback',
  templateUrl: './instant-feedback.component.html',
  styleUrls: ['./instant-feedback.component.scss'],
})
export class InstantFeedbackComponent implements OnInit, OnDestroy {
  @Input() title;
  @Input() rowData;
  @Input() openedState: boolean;
  outlets;
  private $subscription = new Subscription();
  constructor(
    public globalFilterService: GlobalFilterService,
    private _hotelDetailService: HotelDetailService,
    private snackbarService: SnackBarService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.getOutlets(data['filter'].value);
      })
    );
  }

  getOutlets(globalQueryValue) {
    const branch = this._hotelDetailService.hotelDetails.brands
      .find((brand) => brand.id === globalQueryValue.property.hotelName)
      .branches.find(
        (branch) => branch['id'] === globalQueryValue.property.branchName
      );
    this.outlets = branch.outlets;
  }

  getOutlet(id) {
    if (this.outlets?.length) {
      return this.outlets.filter((outlet) => outlet.id === id)[0]?.name;
    }
  }

  downloadFeedback(event, id) {
    event.stopPropagation();
    this.$subscription.add(
      this.reservationService.getFeedbackPdf(id).subscribe(
        (response) => {
          const link = document.createElement('a');
          link.href = response.fileDownloadUri;
          link.target = '_blank';
          link.download = response.fileName;
          link.click();
          link.remove();
        },
        ({ error }) =>
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe()
      )
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
