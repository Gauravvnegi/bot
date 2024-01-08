import { Injectable } from '@angular/core';
import {
  IGRoomType,
  ReservationCalendarViewComponent,
} from '../components/reservation-calendar-view/reservation-calendar-view.component';
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
import { DetailsComponent, JourneyDialogComponent } from '../components';
import { ConfirmDialogData } from '../components/journey-dialog/journey-dialog.component';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
@Injectable()
export class ReservationFormService {
  data: JourneyData;
  entityId: string;

  constructor(
    private dialogService: DialogService,
    private snackbarService: SnackBarService,
    private reservationService: ReservationService,
    private globalFilterService: GlobalFilterService
  ) {
    this.entityId = this.globalFilterService.entityId;
  }

  calculateTime(
    defaultEndTime: string
  ): { currentTime: number; defaultTime: number } {
    const currentDateTime = new Date();
    const currentHours = currentDateTime.getHours();
    const currentMinutes = currentDateTime.getMinutes();
    const currentSeconds = currentDateTime.getSeconds();

    const [journeyHours, journeyMinutes, journeySeconds] = defaultEndTime.split(
      ':'
    );

    const currentEpochTime =
      currentHours * 3600 + currentMinutes * 60 + currentSeconds;
    const defaultJourneyEpoch =
      parseInt(journeyHours) * 3600 +
      parseInt(journeyMinutes) * 60 +
      parseInt(journeySeconds);

    return { currentTime: currentEpochTime, defaultTime: defaultJourneyEpoch };
  }

  manualCheckin<T extends ReservationCalendarViewComponent | DetailsComponent>(
    reservationId: string,
    instance?: T,
    roomType?: IGRoomType
  ) {
    this.data = {
      reservationId: reservationId,
      instance: instance,
      roomType: roomType,
    };
    this.reservationService
      .getJourneyDetails(this.entityId, JourneyTypes.EARLYCHECKIN)
      .subscribe((res: CalendarJourneyResponse) => {
        if (res) {
          const { currentTime, defaultTime } = this.calculateTime(
            res[JourneyTypes.EARLYCHECKIN].journeyEndTime
          );
          if (currentTime < defaultTime) {
            this.openModalComponent(JourneyTypes.EARLYCHECKIN);
          } else {
            this.openJourneyDialog(
              {
                title: JourneyTypeConfig.CHECKIN.title,
                descriptions: JourneyTypeConfig.CHECKIN.descriptions,
                isSendInvoice: true,
              },
              undefined,
              undefined,
              true
            );
          }
        }
      });
  }

  manualCheckout<T extends ReservationCalendarViewComponent | DetailsComponent>(
    reservationId: string,
    instance?: T,
    roomType?: IGRoomType
  ) {
    this.data = {
      reservationId: reservationId,
      instance: instance,
      roomType: roomType,
    };
    this.reservationService
      .getJourneyDetails(this.entityId, JourneyTypes.LATECHECKOUT)
      .subscribe((res: CalendarJourneyResponse) => {
        if (res) {
          // Compare current time with the default early checkin time to show different popups
          const { currentTime, defaultTime } = this.calculateTime(
            res[JourneyTypes.LATECHECKOUT].journeyStartTime
          );
          if (currentTime > defaultTime) {
            this.openModalComponent(JourneyTypes.LATECHECKOUT);
          } else {
            this.openJourneyDialog({
              title: JourneyTypeConfig.CHECKOUT.title,
              descriptions: JourneyTypeConfig.CHECKOUT.descriptions,
            });
          }
        }
      });
  }

  openModalComponent(journeyType: JourneyTypes) {
    let modalRef: DynamicDialogRef;
    const data = {
      content: {
        heading: JourneyTypeConfig[journeyType].title,
        descriptions: JourneyTypeConfig[journeyType].descriptions,
        isReservation: true,
        isRemarks: true,
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
            if (journeyType === JourneyTypes.EARLYCHECKIN) this.checkIn(data);
            else this.checkOut(false, data);
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

  checkIn(data = {}) {
    this.reservationService
      .manualCheckin(this.data.reservationId, data)
      .subscribe((res) => {
        this.triggerComponentChanges(true);
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

  checkOut(isInvoice: boolean = false, data = {}) {
    this.reservationService
      .manualCheckout(this.data.reservationId, data, {
        params: `?sendInvoice=${isInvoice}`,
      })
      .subscribe((res) => {
        this.triggerComponentChanges();
        this.snackbarService.openSnackBarAsText('Checkout completed.', '', {
          panelClass: 'success',
        });
      });
  }

  triggerComponentChanges(isCheckin: boolean = false) {
    const instance = this.data?.instance;
    instance instanceof ReservationCalendarViewComponent &&
      instance.updateRoomType(
        this.data.reservationId,
        this.data.roomType,
        isCheckin
          ? ReservationCurrentStatus.INHOUSE
          : ReservationCurrentStatus.CHECKEDOUT
      );

    if (instance instanceof DetailsComponent)
      instance.details.currentJourneyDetails.status = 'COMPLETED';
  }

  openJourneyDialog(
    config: ConfirmDialogData,
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
        if (isCheckin) this.checkIn();
        else this.checkOut(res?.isInvoice);
        args && this.verifyJourney(args[0], args[1], bookingId);
      }
    });
  }
}

export type JourneyData = {
  reservationId: string;
  instance?: ReservationCalendarViewComponent | DetailsComponent;
  roomType?: IGRoomType;
};
