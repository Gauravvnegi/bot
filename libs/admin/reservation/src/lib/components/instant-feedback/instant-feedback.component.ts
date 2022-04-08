import { Component, Input, OnInit } from '@angular/core';
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
export class InstantFeedbackComponent implements OnInit {
  @Input() title;
  @Input() rowData;
  @Input() openedState: boolean;
  @Input() colorMap;
  outlets;
  private $subscription = new Subscription();
  constructor(
    public _globalFilterService: GlobalFilterService,
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

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.getOutlets(data['filter'].value);
      })
    );
  }

  getOutlets(globalQueryValue) {
    const branch = this._hotelDetailService.hotelDetails.brands
      .find((brand) => brand.id === globalQueryValue.property.hotelName)
      .branches.find(
        (branch) => branch['id'] == globalQueryValue.property.branchName
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
        ({ error }) => this.snackbarService.openSnackBarAsText(error.message)
      )
    );
  }
}
