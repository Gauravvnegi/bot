import { Component, OnInit, Input } from '@angular/core';
import { SnackBarService } from 'libs/shared/material/src';
import { ReservationService } from '../../../services/reservation.service';

@Component({
  selector: 'hospitality-bot-default-package',
  templateUrl: './default-package.component.html',
  styleUrls: ['./default-package.component.scss'],
})
export class DefaultPackageComponent implements OnInit {
  @Input() parentForm;
  @Input() paidAmenityFG;
  @Input() config;
  @Input() index;

  constructor(
    private snackbarService: SnackBarService,
    private _reservationService: ReservationService
  ) {}

  ngOnInit(): void {}

  updatePackageStatus(status) {
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
          this.paidAmenityFG
            .get('status')
            .patchValue(status === 'ACCEPT' ? 'COMPLETED' : 'FAILED');
          this.snackbarService.openSnackBarAsText(
            'Status updated sucessfully.',
            '',
            { panelClass: 'success' }
          );
        },
        ({ error }) => {
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe();
        }
      );
  }
}
