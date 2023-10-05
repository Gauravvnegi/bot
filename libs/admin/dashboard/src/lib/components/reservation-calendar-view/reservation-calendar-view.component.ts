import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  QueryConfig,
  daysOfWeek,
} from '@hospitality-bot/admin/shared';
import { getWeekendBG } from 'libs/admin/channel-manager/src/lib/models/bulk-update.models';
import { ReservationType } from 'libs/admin/manage-reservation/src/lib/constants/reservation-table';
import {
  ReservationList,
  RoomReservation,
} from 'libs/admin/manage-reservation/src/lib/models/reservations.model';
import { FormService } from 'libs/admin/manage-reservation/src/lib/services/form.service';
import { ManageReservationService } from 'libs/admin/manage-reservation/src/lib/services/manage-reservation.service';
import { ReservationListResponse } from 'libs/admin/manage-reservation/src/lib/types/response.type';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';
import {
  Features,
  RoomTypeListResponse,
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
import { getColorCode } from '../../constants/response';

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
  dates: { day: string; date: number }[];
  globalQueries = [];
  entityId: string;
  useForm: FormGroup;
  currentDate = new Date();

  isRoomsEmpty = false;
  roomsLoaded = false;
  viewReservationForm = false;

  reservationListData: RoomReservation[];
  $subscription = new Subscription();
  previousData: IGValue[] = [];

  formProps: QuickFormProps;

  constructor(
    private fb: FormBuilder,
    private manageReservationService: ManageReservationService,
    private globalFilterService: GlobalFilterService,
    private roomService: RoomService,
    private adminUtilityService: AdminUtilityService,
    private formService: FormService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initForm();
    this.initDates(Date.now());
    this.initRoomTypes();
    this.listenChanges();
  }

  initRoomTypes() {
    this.roomsLoaded = false;
    this.$subscription.add(
      this.roomService
        .getList<RoomTypeListResponse>(this.entityId, {
          params:
            '?type=ROOM_TYPE&offset=0&limit=200&raw=true&roomTypeStatus=true',
        })
        .subscribe((res) => {
          this.roomTypes = res.roomTypes
            .filter((roomType) => roomType.rooms.length)
            .map((roomTypeData) => ({
              label: roomTypeData.name,
              value: roomTypeData.id,
              rooms: roomTypeData.rooms.map((room) => ({
                roomNumber: room.roomNumber,
                features: room.features,
              })),
              loading: false,
              data: {
                rows: [],
                columns: [],
                values: [],
              },
            }));
          this.initReservationData();
        })
    );
  }

  initReservationData() {
    this.manageReservationService
      .getReservationItems<ReservationListResponse>(
        this.getQueryConfig(),
        this.entityId
      )
      .subscribe((res) => {
        this.reservationListData = new ReservationList()
          .deserialize(res)
          .reservationData.filter(
            (reservation) =>
              reservation.reservationType === ReservationType.CONFIRMED
          );

        this.roomTypes.forEach((roomType) => {
          this.mapReservationsData(roomType);
        });
        this.roomsLoaded = true;
      });
  }

  mapReservationsData(roomType: IGRoomType) {
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
      // Update the data field with matching reservations
      roomType.data = {
        rows: this.getRooms(roomType.rooms),
        columns: this.gridCols,
        values: matchingReservations.map((reservation) => ({
          id: reservation.id,
          content: reservation.guestName,
          startPos: this.getDate(reservation.from),
          endPos: this.getDate(reservation.to),
          rowValue: reservation.bookingItems[0].roomDetails.roomNumber,
          colorCode: getColorCode(reservation.journeysStatus),
          nonInteractive: reservation.journeysStatus.CHECKOUT === 'COMPLETED',
        })),
      };
      this.allRoomTypes = this.roomTypes;
    }
  }

  getDate(date: number) {
    const data = new Date(date);
    return data.setHours(0, 0, 0, 0);
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
          offset: 0,
          limit: 200,
        },
      ]),
    };
    return config;
  }

  initDates(startDate: number, limit = 14) {
    const dates = [];
    const cols = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < limit; i++) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + i);
      const day = nextDate.getDay();
      const data = {
        day: daysOfWeek[day].substring(0, 3),
        date: nextDate.getDate(),
      };
      dates.push(data);

      const colsData = this.getDate(nextDate.getTime());
      cols.push(colsData);
    }

    this.dates = dates;
    this.gridCols = cols;
    this.globalQueries = [
      { fromDate: this.gridCols[0] },
      { toDate: this.gridCols[13] },
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
      this.initDates(res);
      this.initReservationData();
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
      );
    console.log(event, 'onChange event');
  }

  handleCreate(event: IGCreateEvent, roomType: IGRoomType) {
    this.viewQuickForm(roomType, undefined, event);
    console.log(event, 'onCreate event');
  }

  handleEdit(event: IGEditEvent, roomType: IGRoomType) {
    this.viewQuickForm(roomType, event.id, undefined);
    console.log(event, 'onEdit event');
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

  handleCloseSidebar(resetData: boolean) {
    this.viewReservationForm = false;
    if (resetData) {
      this.ngOnInit();
    }
  }

  getRooms(rooms: IGRoom[]) {
    return rooms.map((room) => room.roomNumber);
  }

  getFeatureImage(features: Features[]) {
    if (features) return features.map((feature) => feature.imageUrl);
    else return;
  }
}

export type IGRoomType = {
  label: string;
  value: string;
  rooms?: IGRoom[];
  loading?: boolean;
  reinitialize?: boolean;
  data?: GridData;
};

type GridData = {
  rows: IGRow[];
  columns: IGCol[];
  values: IGValue[];
};

type IGRoom = {
  roomNumber: IGRow;
  features?: Features[];
};

export type CalendarViewData = {
  date: number;
  room: string;
  value: string;
};

export type QuickFormProps = {
  reservationId: string;
  room: string | number;
  date?: number | string;
  roomType: IGRoomType;
};