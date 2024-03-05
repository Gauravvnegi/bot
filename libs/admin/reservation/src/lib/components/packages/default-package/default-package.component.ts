import { Component, Input, OnInit } from '@angular/core';
import { DateService } from '@hospitality-bot/shared/utils';
import { SnackBarService } from 'libs/shared/material/src';
import { MetaData } from '../../../models/guest-table.model';
import { ReservationService } from '../../../services/reservation.service';

@Component({
  selector: 'hospitality-bot-default-package',
  templateUrl: './default-package.component.html',
  styleUrls: ['./default-package.component.scss'],
})
export class DefaultPackageComponent implements OnInit {
  @Input() parentForm;
  @Input() paidAmenityFG;
  @Input() index;

  isPmsBooking = false;
  isToggleOn: boolean = false;
  metaDataList: MetaData[] = [];
  @Input() set config(value) {
    this.getMetaDataList(value);
  }

  constructor(
    protected snackbarService: SnackBarService,
    private _reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.isPmsBooking = this.parentForm.get(
      'reservationDetails.isPmsBooking'
    ).value;
  }

  // onToggleSwitch(isAccepted: boolean) {
  //   this.updatePackageStatus(isAccepted ? 'ACCEPT' : 'REJECT');
  // }

  updatePackageStatus(status: string) {
    const data = {
      stepName: 'PACKAGE',
      state: status,
      remarks: this.paidAmenityFG.get('remarks').value,
      packageId: this.paidAmenityFG.get('id').value,
    };

    this._reservationService
      .updateStepStatus(
        this.parentForm.get('reservationDetails').get('bookingId').value,
        data
      )
      .subscribe(
        (response) => {
          this.isToggleOn = status === 'ACCEPT';

          this.paidAmenityFG.get('status').patchValue(status);
          this.snackbarService.openSnackBarWithTranslate(
            {
              translateKey: `messages.SUCCESS.REQUEST_STATUS_UPDATED`,
              priorityMessage: 'Request status updated',
            },
            '',
            { panelClass: 'success' }
          );
        },
        ({ error }) => {}
      );
  }

  getMetaDataList(value) {
    /**
     * @Remark value is in second, it may be change in future,
     * we have to convert it in millisecond.
     *
     */
    let format: string = 'DD-MM-YYYY , HH:mm A';
    this.metaDataList = Object.entries(value.metaData as MetaData).map(
      ([key, value]) => ({
        label: (key.charAt(0).toUpperCase() + key.slice(1)).replace(
          /([A-Z])/g,
          ' $1'
        ),
        value:
          key == 'pickupTime' ? this.convertEpochToDate(+value, format) : value,
      })
    );
  }

  convertEpochToDate(epochTime: any, format: string) {
    return epochTime
      ? DateService.getDateFromTimeStamp(epochTime, format).replace(',', 'at')
      : '--';
  }
}
