import { Injectable } from '@angular/core';
import { IGRoomType } from '../components/reservation-calendar-view/reservation-calendar-view.component';
import {
  CalendarJourneyResponse,
  JourneyTypeConfig,
  JourneyTypeRequests,
  JourneyTypes,
} from '../types/reservation-types';
import { openModal } from '@hospitality-bot/admin/shared';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ReservationService } from './reservation.service';
import { ReservationCurrentStatus } from 'libs/admin/manage-reservation/src/lib/models/reservations.model';
import { JourneyDialogComponent } from '../components/journey-dialog/journey-dialog.component';
import { ConfirmDialogData } from '../components/journey-dialog/journey-dialog.component';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { calculateJourneyTime } from '../constants/reservation';
import { Validators } from '@angular/forms';
@Injectable()
export class ReservationFormService {
  data: JourneyData;

  constructor(
    private dialogService: DialogService,
    private snackbarService: SnackBarService,
    private reservationService: ReservationService,
    private globalFilterService: GlobalFilterService
  ) {}

  manualCheckin(
    checkinDate: number,
    reservationId: string,
    callback?: (data?: JourneyData) => void,
    entityId?: string,
    roomType?: IGRoomType
  ) {
    this.data = {
      reservationId: reservationId,
      roomType: roomType,
    };
    this.reservationService
      .getJourneyDetails(entityId, JourneyTypes.EARLYCHECKIN)
      .subscribe((res: CalendarJourneyResponse) => {
        if (res) {
          const { currentTime, defaultTime } = calculateJourneyTime(
            res[JourneyTypes.EARLYCHECKIN].journeyEndTime
          );
          const todayEpoch = new Date().setHours(0, 0, 0, 0);
          const checkinEpoch = new Date(checkinDate).setHours(0, 0, 0, 0);
          if (currentTime < defaultTime && checkinEpoch === todayEpoch) {
            this.openModalComponent(
              JourneyTypes.EARLYCHECKIN,
              callback,
              reservationId
            );
          } else {
            this.openJourneyDialog(
              {
                title: JourneyTypeConfig.CHECKIN.title,
                descriptions: JourneyTypeConfig.CHECKIN.descriptions,
                isSendInvoice: false,
              },
              callback,
              undefined,
              undefined,
              true
            );
          }
        }
      });
  }

  manualCheckout(
    reservationId: string,
    callback?: (data?: JourneyData) => void,
    entityId?: string,
    roomType?: IGRoomType
  ) {
    this.data = {
      reservationId: reservationId,
      roomType: roomType,
    };
    this.reservationService
      .getJourneyDetails(entityId, JourneyTypes.LATECHECKOUT)
      .subscribe((res: CalendarJourneyResponse) => {
        if (res) {
          this.openJourneyDialog(
            {
              title: JourneyTypeConfig.CHECKOUT.title,
              descriptions: JourneyTypeConfig.CHECKOUT.descriptions,
              isSendInvoice: true,
            },
            callback
          );
        }
      });
  }

  openModalComponent(
    journeyType: JourneyTypes,
    callback?: (data?: JourneyData) => void,
    reservationId?: string
  ) {
    let modalRef: DynamicDialogRef;
    const data = {
      content: {
        heading: JourneyTypeConfig[journeyType].title,
        descriptions: JourneyTypeConfig[journeyType].descriptions,
        isReservation: true,
        isRemarks: true,
        remarksValidators: [Validators.required],
      },
      actions: [
        {
          label: 'Cancel',
          onClick: () => modalRef.close(),
          variant: 'outlined',
        },
        {
          label: 'Ok',
          onClick: (res) => {
            let data = res;
            if (journeyType === JourneyTypes.EARLYCHECKIN)
              this.checkIn(callback, data);
            // else this.checkOut(callback, false, data);
            else this.lateCheckout(res, callback, reservationId);
            modalRef.close();
          },
          variant: 'contained',
        },
      ],
    };
    modalRef = openModal({
      config: {
        width: '35vw',
        styleClass: 'confirm-dialog',
        data: data,
      },
      component: ModalComponent,
      dialogService: this.dialogService,
    });
  }

  lateCheckout(
    data: LateCheckoutData,
    callback?: (data?: JourneyData) => void,
    reservationId?: string
  ) {
    this.reservationService
      .updateLateCheckout(reservationId, data)
      .subscribe((res) => {
        callback && callback();
        this.snackbarService.openSnackBarAsText(
          'Late checkout charges updated.',
          '',
          {
            panelClass: 'success',
          }
        );
      });
  }

  checkIn(callback?: (data?: JourneyData) => void, data = {}) {
    this.reservationService
      .manualCheckin(this.data.reservationId, data)
      .subscribe((res) => {
        callback &&
          callback({
            reservationId: this.data?.reservationId,
            status: ReservationCurrentStatus.INHOUSE,
            roomType: this.data?.roomType,
            isCheckout: false,
          });
        this.snackbarService.openSnackBarAsText('Checkin completed.', '', {
          panelClass: 'success',
        });
      });
  }

  confirmAndNotifyCheckin(journeyType: JourneyTypes, bookingId: string) {
    this.openJourneyDialog(
      {
        title: JourneyTypeRequests[journeyType].title,
        descriptions: JourneyTypeRequests[journeyType].descriptions,
      },
      undefined,
      JourneyTypeRequests[journeyType].args,
      bookingId
    );
  }

  verifyJourney(journeyName: string, status: string, bookingId: string) {
    const data = {
      journey: journeyName,
      state: status,
      remarks: '',
    };
    this.reservationService
      .updateJourneyStatus(bookingId, data)
      .subscribe((res) => {
        this.snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: 'messages.SUCCESS.JOURNEY_COMPLETED',
              priorityMessage: `${journeyName[0]
                .toUpperCase()
                .concat(
                  journeyName.slice(1, journeyName.length).toLowerCase()
                )} completed`,
            },
            '',
            { panelClass: 'success' }
          )
          .subscribe();
      });
  }

  checkOut(
    callback?: (data?: JourneyData) => void,
    isInvoice: boolean = false,
    data = {}
  ) {
    this.reservationService
      .manualCheckout(this.data.reservationId, data, {
        params: `?sendInvoice=${isInvoice}`,
      })
      .subscribe((res) => {
        callback &&
          callback({
            reservationId: this.data?.reservationId,
            status: ReservationCurrentStatus.CHECKEDOUT,
            roomType: this.data?.roomType,
            isCheckout: true,
          });
        this.snackbarService.openSnackBarAsText('Checkout completed.', '', {
          panelClass: 'success',
        });
      });
  }

  openJourneyDialog(
    config: ConfirmDialogData,
    callback?: (data?: JourneyData) => void,
    args?: string[],
    bookingId?: string,
    isCheckin: boolean = false
  ) {
    const ref = openModal({
      config: {
        width: '450px',
        styleClass: 'confirm-dialog',
        data: config,
      },
      component: JourneyDialogComponent,
      dialogService: this.dialogService,
    });
    ref.onClose.subscribe((res) => {
      if (res) {
        if (isCheckin) this.checkIn(callback);
        else this.checkOut(callback, res?.isInvoice);
        args && this.verifyJourney(args[0], args[1], bookingId);
      }
    });
  }
}

export type JourneyData = {
  reservationId: string;
  roomType: IGRoomType;
  status?: ReservationCurrentStatus;
  isCheckout?: boolean;
};

export type LateCheckoutData = {
  remarks: string;
  chargeable: boolean;
  chargedAmount: number;
};
