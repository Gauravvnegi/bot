import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BookingDetailService,
  FlagType,
  ModuleNames,
  QueryConfig,
  daysOfWeek,
  openModal,
} from '@hospitality-bot/admin/shared';
import { getWeekendBG } from 'libs/admin/channel-manager/src/lib/models/bulk-update.models';
import {
  ReservationCurrentStatus,
  ReservationList,
  RoomReservation,
} from 'libs/admin/manage-reservation/src/lib/models/reservations.model';
import { ManageReservationService } from 'libs/admin/manage-reservation/src/lib/services/manage-reservation.service';
import {
  BookingItems,
  ReservationListResponse,
} from 'libs/admin/manage-reservation/src/lib/types/response.type';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';
import {
  Features,
  RoomStatus,
  RoomTypeListResponse,
  StatusDetails,
} from 'libs/admin/room/src/lib/types/service-response';
import {
  IGChangeEvent,
  IGCol,
  IGCreateEvent,
  IGEditEvent,
  IGRow,
  IGValue,
} from 'libs/admin/shared/src/lib/components/interactive-grid/interactive-grid.component';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  reservationMenuOptions,
  reservationStatusColorCode,
} from '../../constants/reservation';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { RoomMapType } from 'libs/admin/channel-manager/src/lib/types/channel-manager.types';
import * as moment from 'moment';
import { ReservationService } from '../../services/reservation.service';
import { JourneyState } from 'libs/admin/manage-reservation/src/lib/constants/reservation';
import { roomStatusDetails } from 'libs/admin/housekeeping/src/lib/constant/room';
import { NightAuditService } from 'libs/admin/global-shared/src/lib/services/night-audit.service';
import { CalendarOccupancy } from '../../models/reservation-table.model';
import { JourneyDialogComponent } from '../journey-dialog/journey-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ReservationRatePlan } from 'libs/admin/room/src/lib/constant/form';
import {
  JourneyData,
  ReservationFormService,
} from '../../services/reservation-form.service';

@Component({
  selector: 'hospitality-bot-reservation-calendar-view',
  templateUrl: './reservation-calendar-view.component.html',
  styleUrls: ['./reservation-calendar-view.component.scss'],
})
export class ReservationCalendarViewComponent implements OnInit {
  // gridRows: IGRow[] = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110];
  gridCols: IGCol[] = [];
  allRoomTypes: IGRoomType[] = [];
  roomTypes: IGRoomType[] = [];
  dates: IGDate[];
  globalQueries = [];
  entityId: string;
  useForm: FormGroup;
  currentDate = new Date();

  isRoomsEmpty = false;
  roomsLoaded = false;
  viewReservationForm = false;
  reservationsLoaded = false;

  roomStatusDetails = roomStatusDetails;
  reservationListData: RoomReservation[];
  $subscription = new Subscription();
  previousData: IGValue[] = [];
  ratesRoomDetails = new Map<string, RoomMapType>();
  occupancyData = new Map<
    number,
    Map<string, { available: number; occupancy: number }>
  >();

  formProps: QuickFormProps;
  fullView: boolean;

  constructor(
    private fb: FormBuilder,
    private manageReservationService: ManageReservationService,
    private globalFilterService: GlobalFilterService,
    private roomService: RoomService,
    private adminUtilityService: AdminUtilityService,
    private _reservationService: ReservationService,
    private snackbarService: SnackBarService,
    private _clipboard: Clipboard,
    private routesConfigService: RoutesConfigService,
    private auditService: NightAuditService,
    private bookingDetailService: BookingDetailService,
    private dialogService: DialogService,
    private formService: ReservationFormService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.globalFilterService.toggleFullView.subscribe((res) => {
      this.fullView = res;
    });
    this.checkAudit();
  }

  initRoomTypes() {
    this.roomsLoaded = false;
    this.hideFooter(true);
    this.$subscription.add(
      this.roomService
        .getList<RoomTypeListResponse>(this.entityId, {
          params:
            '?type=ROOM_TYPE&offset=0&limit=200&raw=true&roomTypeStatus=true',
        })
        .subscribe(
          (res) => {
            this.roomTypes = res.roomTypes
              .filter((roomType) => roomType.rooms.length)
              .map((roomTypeData) => ({
                label: roomTypeData.name,
                value: roomTypeData.id,
                rooms: roomTypeData.rooms.map((room) => {
                  let currentStatus = room?.statusDetailsList.filter(
                    (item) => item?.isCurrentStatus
                  )[0];
                  return {
                    roomNumber: room?.roomNumber,
                    features: room?.features,
                    statusDetails: room?.statusDetailsList ?? [],
                    currentStatus: currentStatus?.status,
                    nextStates: [...room.nextStates, currentStatus?.status],
                    id: room?.id,
                  };
                }),
                loading: false,
                data: {
                  rows: [],
                  columns: [],
                  values: [],
                },
                ratePlans: roomTypeData.ratePlans.map((item) => ({
                  label: item.label,
                  value: item.id,
                  isBase: item.isBase,
                })),
              }));
            this.initReservationData();
          },
          (error) => {
            this.reservationsLoaded = true;
            this.roomsLoaded = true;
            this.hideFooter(false);
          },
          () => {
            this.roomsLoaded = true;
          }
        )
    );
  }

  close() {
    this.globalFilterService.toggleFullView.next(false);
  }

  initReservationData() {
    this.roomTypes.map((roomType) => (roomType.loading = true));
    this.$subscription.add(
      this.manageReservationService
        .getReservationItems<ReservationListResponse>(
          this.getQueryConfig(),
          this.entityId
        )
        .subscribe(
          (res) => {
            this.reservationListData = new ReservationList().deserialize(
              res
            ).reservationData;
            this.roomTypes.forEach((roomType) => {
              this.mapGridData(roomType);
            });
            this.getRates();
          },
          (error) => {
            setTimeout(() => {
              this.reservationsLoaded = true;
            }, 200);
            this.roomTypes.map((roomType) => (roomType.loading = false));
            this.hideFooter(false);
          },
          () => {
            this.hideFooter(false);
            setTimeout(() => {
              this.reservationsLoaded = true;
            }, 200);
            this.roomTypes.map((roomType) => (roomType.loading = false));
          }
        )
    );
  }

  mapGridData(roomType: IGRoomType) {
    if (roomType.rooms) {
      const matchingReservations = this.reservationListData.filter(
        (reservation) =>
          roomType.rooms.some((room) =>
            reservation.bookingItems.some(
              (bookingItem) =>
                bookingItem.roomDetails.roomNumber === room.roomNumber
            )
          )
      );

      const unavailableRooms = roomType.rooms.filter((room) => {
        const hasUnavailableStatus = room?.statusDetails.some(
          (statusDetail) => statusDetail.status === 'OUT_OF_SERVICE'
        );

        return hasUnavailableStatus;
      });

      // Map data for matching reservations
      const matchingData = matchingReservations.map((reservation) => ({
        id: reservation.id,
        content: `${reservation.guestName} ${this.getOccupancy(
          reservation.bookingItems
        )}`,
        startPos: this.getDate(reservation.from),
        endPos: this.getDate(reservation.to),
        rowValue: reservation.bookingItems[0].roomDetails.roomNumber,
        colorCode: reservationStatusColorCode[reservation?.status],
        nonInteractive:
          reservation.status === ReservationCurrentStatus.CHECKEDOUT,
        additionContent: reservation?.companyName ?? '',
        options: this.getMenuOptions(reservation),
      }));

      // Map data for unavailable rooms
      const unavailableData = unavailableRooms.reduce((result, room) => {
        const unavailableStatusDetails = room.statusDetails.filter(
          (status) => status.status === 'OUT_OF_SERVICE'
        );
        const roomValues = unavailableStatusDetails
          .filter((status) => {
            const endDate = this.getStatusDate(status.toDate, status.fromDate);
            return endDate !== null;
          })
          .map((status) => ({
            id: null, // Set id as needed for unavailable rooms
            content: 'Out Of Service',
            startPos: this.getDate(status.fromDate),
            endPos: this.getStatusDate(status.toDate, status.fromDate),
            rowValue: room.roomNumber,
            colorCode: 'draft',
            nonInteractive: true,
            additionContent: status.remarks,
          }));
        return [...result, ...roomValues];
      }, []);

      // Combine data for matching reservations and unavailable rooms
      roomType.data = {
        rows: this.getRooms(roomType.rooms),
        columns: this.gridCols,
        values: [...matchingData, ...unavailableData],
      };

      this.allRoomTypes = this.roomTypes;
    }
  }

  getDate(date: number) {
    const data = new Date(date);
    return data.setHours(0, 0, 0, 0);
  }

  getStatusDate(toDateEpochdate: number, fromDateEpoch: number) {
    const currentDate = new Date(this.dates[0].currentDate);
    const toDate = new Date(toDateEpochdate);
    const fromDate = new Date(fromDateEpoch);
    const endDate = new Date(this.dates[this.dates.length - 1].currentDate);

    // Set both dates to midnight to compare only the dates
    currentDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    fromDate.setHours(0, 0, 0, 0);

    // Compare the dates
    if (toDate >= currentDate && fromDate <= endDate) {
      return toDate.setHours(0, 0, 0, 0); // Return the date if it's today or later
    }

    // Return null to skip the status if toDate is before today
    return null;
  }

  /**
   * @function getQueryConfig to configuration
   */
  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          type: 'ROOM_TYPE',
          entityType: 'ALL',
          pagination: false,
          calendarView: true,
          entityState: 'CONFIRMED',
        },
      ]),
    };
    return config;
  }

  checkAudit() {
    this.$subscription.add(
      this.auditService.checkAudit(this.entityId).subscribe(
        (res) => {
          const date = res?.shift() ?? Date.now();
          this.initConfig(date);
        },
        (error) => {
          this.initConfig(Date.now());
        }
      )
    );
  }

  initConfig(date: number) {
    this.initDates(date);
    this.initForm();
    this.initRoomTypes();
    this.listenChanges();
  }

  initDates(startDate: number, limit = 21) {
    const dates = [];
    const cols = [];
    const currentDate = new Date(startDate);
    this.currentDate = currentDate;

    for (let i = 0; i < limit; i++) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + i);
      const day = nextDate.getDay();
      const data = {
        day: daysOfWeek[day]?.substring(0, 3),
        date: nextDate?.getDate(),
        currentDate: nextDate,
      };
      dates.push(data);

      const colsData = this.getDate(nextDate.getTime());
      cols.push(colsData);
    }

    this.dates = dates;
    this.gridCols = cols;
    this.globalQueries = [
      { fromDate: this.gridCols[0] },
      { toDate: this.gridCols[limit - 1] },
    ];
  }

  initForm() {
    this.currentDate.setHours(0, 0, 0, 0);
    this.useForm = this.fb.group({
      roomType: [],
      date: [this.currentDate.getTime()],
    });
  }

  listenChanges() {
    this.useForm.get('date').valueChanges.subscribe((res) => {
      if (res) {
        this.initDates(res);
        this.initReservationData();
      }
    });

    this.useForm
      .get('roomType')
      .valueChanges.pipe(debounceTime(500))
      .subscribe((res: string[]) => {
        this.roomTypes = this.allRoomTypes.filter((item) =>
          res.includes(item.value)
        );
        this.isRoomsEmpty = !res.length;
      });
  }

  getWeekendBG(day: string, isOccupancy = false) {
    return getWeekendBG(day, isOccupancy);
  }

  getOccupancy(bookingItems: BookingItems[]) {
    const totalGuests = bookingItems.map(
      (item) =>
        +item.occupancyDetails.maxAdult + +item.occupancyDetails.maxChildren
    )[0];
    if (totalGuests > 1) return `(+${totalGuests - 1})`;
    else return '';
  }

  getRates(selectedDate = this.useForm.value.date) {
    this.$subscription.add(
      this._reservationService
        .getCalendarViewOccupancy(
          this.entityId,
          this.getRatesConfig(selectedDate)
        )
        .subscribe(
          (res) => {
            const data = new CalendarOccupancy().deserialize(res);
            this.occupancyData = data;
          },
          (error) => {}
        )
    );
  }

  getFromAndToDateEpoch(currentTime) {
    const fromDate = currentTime;
    const toDate = new Date(currentTime);
    toDate.setDate(toDate.getDate() + this.dates.length - 1);
    return {
      fromDate: moment(fromDate).unix() * 1000,
      toDate: moment(toDate).unix() * 1000,
    };
  }

  getRatesConfig(selectedDate?: number, roomTypeId?: string): QueryConfig {
    const { fromDate, toDate } = this.getFromAndToDateEpoch(
      selectedDate ? selectedDate : this.useForm.controls['date'].value
    );
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: 'ROOM_TYPE',
          roomTypeStatus: true,
        },
        selectedDate && {
          fromDate: fromDate,
          toDate: roomTypeId ? fromDate : toDate,
        },
      ]),
    };
    return config;
  }

  // getAvailability(
  //   nextDate: number,
  //   type: 'quantity' | 'occupancy',
  //   roomTypeId: string
  // ) {
  //   if (
  //     Object.keys(this.occupancyData).length === 0 ||
  //     !this.occupancyData[nextDate]?.availability
  //   )
  //     return 0;
  //   const date = new Date(this.useForm.controls['date'].value);
  //   date.setDate(date.getDate() + nextDate);
  //   let room = this.occupancyData[roomTypeId]['availability'][
  //     date.getTime()
  //   ];
  //   if (room) return room[type] === 'NaN' || !room[type] ? 0 : room[type];
  //   return 0;
  // }

  getAvailability(
    nextDate: { currentDate: Date },
    index: number,
    type: 'available' | 'occupancy',
    roomTypeId: string
  ) {
    const currentDate = new Date(nextDate.currentDate);
    currentDate.setHours(0, 0, 0, 0);
    const currentEpoch = currentDate.getTime();
    const obj = this.occupancyData.get(currentEpoch)?.get(roomTypeId)
      ?.available;
    if (
      this.occupancyData.size === 0 ||
      (!this.occupancyData.get(currentEpoch)?.get(roomTypeId)?.available &&
        !this.occupancyData.get(currentEpoch)?.get(roomTypeId)?.occupancy)
    ) {
      return 0;
    }
    const date = new Date(this.useForm.controls['date'].value);
    date.setDate(date.getDate() + index);
    const roomData = this.occupancyData.get(date.getTime())?.get(roomTypeId);
    if (roomData) {
      const value = roomData[type];
      return !value ? 0 : value;
    }

    return 0;
  }

  handleChange(event: IGChangeEvent, roomType: IGRoomType) {
    const updateData = {
      from: event.startPos,
      to: event.endPos,
      bookingItems: [
        {
          roomDetails: {
            roomNumber: event.rowValue,
          },
        },
      ],
    };

    roomType.loading = true;
    this.$subscription.add(
      this.manageReservationService
        .updateCalendarView(event.id, updateData, 'ROOM_TYPE')
        .subscribe(
          (res) => {
            const updatedValues = roomType.data.values.map((item) => {
              if (item.id === event.id) {
                return {
                  ...item,
                  rowValue: event.rowValue,
                  startPos: event.startPos,
                  endPos: event.endPos,
                  options: this.getMenuOptions(res),
                };
              }
              return item; // Keep other items unchanged
            });

            roomType.data = {
              ...roomType.data,
              values: updatedValues,
            };
          },
          (error) => {
            roomType.loading = false;
            roomType.data = { ...roomType.data };
          },
          () => {
            roomType.loading = false;
          }
        )
    );
  }

  getMenuOptions(reservation: RoomReservation) {
    return reservation.journeysStatus.PRECHECKIN === JourneyState.PENDING
      ? reservationMenuOptions['PRECHECKIN']
      : reservationMenuOptions[reservation.status];
  }

  hideFooter(hide: boolean) {
    const footer = document.querySelector('.main-footer') as HTMLElement;
    // Check if the cdk container has zIndex 1500 already
    if (footer && hide) {
      // Increase the z-index before showing the snackbar
      footer.style.display = 'none';
    } else {
      footer.style.display = 'flex';
    }
  }

  handleCreate(event: IGCreateEvent, roomType: IGRoomType) {
    this.viewQuickForm(roomType, undefined, event);
  }

  handleEdit(event: IGEditEvent, roomType: IGRoomType) {
    this.viewQuickForm(roomType, event.id, undefined);
  }

  handleDisabledClick(event: IGEditEvent) {
    this.openDetailsPage(event.id);
  }

  viewQuickForm(roomType: IGRoomType, id: string, event: IGCreateEvent) {
    this.formProps = {
      reservationId: id,
      room:
        roomType.data.values.find((value) => value.id === id)?.rowValue ??
        event.rowValue,
      roomType: roomType,
      date: event?.colValue,
    };
    this.viewReservationForm = true;
  }

  handleMenuClick(
    event: { label: string; value: string; id: string },
    roomType: IGRoomType
  ) {
    switch (event.value) {
      case 'CHECKIN':
        this.formService.manualCheckin(
          this.getCheckinDate(event.id),
          event.id,
          (data: JourneyData) => {
            this.updateRoomType(data);
          },
          roomType
        );
        break;
      case 'CHECKOUT':
        this.formService.manualCheckout(
          event.id,
          (data: JourneyData) => {
            this.updateRoomType(data);
          },
          roomType
        );
        break;
      case 'CANCEL_CHECKIN':
        this._reservationService.cancelCheckin(event.id).subscribe((res) => {
          this.updateRoomType({
            reservationId: event.id,
            roomType: roomType,
            status: ReservationCurrentStatus.DUEIN,
          });
          this.snackbarService.openSnackBarAsText('Checkin canceled.', '', {
            panelClass: 'success',
          });
        });
        break;
      case 'CANCEL_CHECKOUT':
        this._reservationService.cancelCheckout(event.id).subscribe((res) => {
          this.updateRoomType({
            reservationId: event.id,
            roomType: roomType,
            status: ReservationCurrentStatus.DUEOUT,
          });
          this.snackbarService.openSnackBarAsText('Checkin canceled.', '', {
            panelClass: 'success',
          });
        });
        break;
      case 'PRECHECKIN':
        this.activateAndGeneratePrecheckin(event.id);
        break;
      case 'VEIW_DETAILS':
        this.openDetailsPage(event.id);
        break;
      case 'MANAGE_INVOICE':
        this.routesConfigService.navigate({
          subModuleName: ModuleNames.INVOICE,
          additionalPath: `${event.id}`,
        });
    }
  }

  getCheckinDate(id: string) {
    const reservation = this.reservationListData.find(
      (reservation) => reservation.id === id
    );
    return reservation.from;
  }

  activateAndGeneratePrecheckin(reservationId: string) {
    this._reservationService
      .generateJourneyLink(reservationId, 'PRECHECKIN')
      .subscribe((res) => {
        this._clipboard.copy(`${res.domain}?token=${res.journey.token}`);
        this.snackbarService.openSnackBarAsText(
          'Link copied successfully',
          '',
          {
            panelClass: 'success',
          }
        );
      });
  }

  updateRoomType(data: JourneyData) {
    const { reservationId, roomType, status, isCheckout } = data;
    // this.reservationFormService.manualCheckin(reservationId, roomType, this)
    let currentDateEpoch = new Date();
    const updatedValues = roomType.data.values.map((item) => {
      const selectedRoom = roomType.rooms.find(
        (room) => room.roomNumber === item.rowValue
      );
      if (item.id === reservationId) {
        const updatedItem: any = {
          ...item,
          colorCode: reservationStatusColorCode[status] as FlagType,
          options: reservationMenuOptions[status],
        };
        isCheckout && this.handleRoomStatus('DIRTY', selectedRoom.id, roomType);
        if (isCheckout) {
          updatedItem.endPos = this.getDate(currentDateEpoch.getTime());
        }

        return updatedItem;
      }
      return item; // Keep other items unchanged
    });
    roomType.data = {
      ...roomType.data,
      values: updatedValues,
    };
  }

  openDetailsPage(reservationId: string) {
    this.bookingDetailService.openBookingDetailSidebar({
      bookingId: reservationId,
      tabKey: 'guest_details',
    });
  }

  openJourneyDialog(config) {
    openModal({
      config: {
        width: '450px',
        styleClass: 'confirm-dialog',
        data: config,
      },
      component: JourneyDialogComponent,
      dialogService: this.dialogService,
    });
  }

  /**
   * @function handleRoomStatus handle the room status toggle
   * @param status room status
   * @param id room id
   */
  handleRoomStatus(status: RoomStatus, id: string, roomType: IGRoomType): void {
    if (status === 'OUT_OF_ORDER' || status === 'OUT_OF_SERVICE') {
      this.routesConfigService.navigate({
        subModuleName: ModuleNames.ROOM,
        additionalPath: `add-room/single`,
        queryParams: { id: id, data: btoa(JSON.stringify({ status: status })) },
      });
      return;
    }
    this.roomService
      .updateRoomStatus(this.entityId, {
        room: {
          id: id,
          statusDetailsList: [{ isCurrentStatus: true, status: status }],
        },
      })
      .subscribe(
        (res) => {
          // this.initRoomTypes();
          let currentStatus = res.rooms[0]?.statusDetailsList.filter(
            (item) => item.isCurrentStatus
          )[0]?.status;
          const updatedValues = roomType.rooms.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                currentStatus: currentStatus,
                nextStates: [currentStatus, ...res.rooms[0].nextStates],
                statusDetails: res.rooms[0].statusDetailsList,
              };
            }
            return item; // Keep other items unchanged
          });
          this.roomTypes.find(
            (item) => item.value === roomType.value
          ).rooms = updatedValues;

          this.snackbarService.openSnackBarAsText(
            'Status changes successfully',
            '',
            { panelClass: 'success' }
          );
        },
        () => {}
      );
  }

  handleCloseSidebar(resetData: boolean) {
    this.viewReservationForm = false;
    if (resetData) {
      this.initReservationData();
    }
  }

  getRooms(rooms: IGRoom[]) {
    return rooms.map((room) => room.roomNumber);
  }

  getFeatureImage(features: Features[]) {
    if (features) return features.map((feature) => feature.imageUrl);
    else return;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}

export type IGRoomType = {
  label: string;
  value: string;
  rooms?: IGRoom[];
  loading?: boolean;
  reinitialize?: boolean;
  data?: GridData;
  ratePlans?: ReservationRatePlan[];
};

type GridData = {
  rows: IGRow[];
  columns: IGCol[];
  values: IGValue[];
};

type IGRoom = {
  roomNumber?: IGRow;
  features?: Features[];
  label?: string;
  value?: string;
  statusDetails: StatusDetails[];
  nextStates: string[];
  id?: string;
};

export type QuickFormProps = {
  reservationId: string;
  room: string | number;
  date?: number | string;
  roomType: IGRoomType;
};

export type IGDate = {
  day: string;
  date: number;
  currentDate: Date;
};
