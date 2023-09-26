import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  Option,
  QueryConfig,
  daysOfWeek,
} from '@hospitality-bot/admin/shared';
import {
  RoomTypes,
  getWeekendBG,
} from 'libs/admin/channel-manager/src/lib/models/bulk-update.models';
import {
  ReservationFormData,
  ReservationList,
  RoomReservation,
} from 'libs/admin/manage-reservation/src/lib/models/reservations.model';
import { FormService } from 'libs/admin/manage-reservation/src/lib/services/form.service';
import { ManageReservationService } from 'libs/admin/manage-reservation/src/lib/services/manage-reservation.service';
import { ReservationListResponse } from 'libs/admin/manage-reservation/src/lib/types/response.type';
import {
  RoomList,
  RoomTypeList,
} from 'libs/admin/room/src/lib/models/rooms-data-table.model';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';
import {
  RoomListResponse,
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

  reservationListData: RoomReservation[];

  $subscription = new Subscription();

  data: IGValue[] = [
    //   {
    //     id: 'RES001',
    //     content: 'Dhruv 101',
    //     // startPos: 1,
    //     // endPos: 3,
    //     startPos: '01Mon',
    //     endPos: '03Wed',
    //     rowValue: 101,
    //   },
    //   {
    //     id: 'RES002',
    //     content: 'Akash 101',
    //     // startPos: 3,
    //     // endPos: 4,
    //     startPos: '03Wed',
    //     endPos: '04Thu',
    //     rowValue: 101,
    //   },
    //   {
    //     id: 'RES003',
    //     content: 'Jag 101',
    //     // startPos: 6,
    //     // endPos: 7,
    //     startPos: '06Sat',
    //     endPos: '08Mon',
    //     rowValue: 101,
    //   },
    //   {
    //     id: 'RES004',
    //     content: 'Tony Stark 102',
    //     // startPos: 6,
    //     // endPos: 7,
    //     startPos: '06Sat',
    //     endPos: '08Mon',
    //     rowValue: 102,
    //   },
    //   {
    //     id: 'RES006',
    //     content: 'Steve Rogers 103',
    //     // startPos: 3,
    //     // endPos: 6,
    //     startPos: '03Wed',
    //     endPos: '06Sat',
    //     rowValue: 103,
    //   },
    //   {
    //     id: 'RES007',
    //     content: 'Pradeep 104',
    //     // startPos: 2,
    //     // endPos: 5,
    //     startPos: '02Tue',
    //     endPos: '05Fri',
    //     rowValue: 104,
    //   },
    //   {
    //     id: 'RES008',
    //     content: 'Ayush 104',
    //     // startPos: 5,
    //     // endPos: 7,
    //     startPos: '05Fri',
    //     endPos: '07Sun',
    //     rowValue: 104,
    //   },
    //   {
    //     id: 'RES007',
    //     content: 'Ayush 104',
    //     startPos: '07Sun',
    //     endPos: '09Tue',
    //     rowValue: 104,
    //   },
  ];

  constructor(
    private fb: FormBuilder,
    private manageReservationService: ManageReservationService,
    private globalFilterService: GlobalFilterService,
    private roomService: RoomService,
    private adminUtilityService: AdminUtilityService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initForm();
    this.initDates(Date.now());
    this.initRoomTypes();
    this.listenChanges();
  }

  initRoomTypes() {
    this.$subscription.add(
      this.roomService
        .getRoomTypesAndNumbers(this.entityId, {
          params: '?type=ROOM_TYPE&offset=0&limit=50',
        })
        .subscribe((res) => {
          this.roomTypes = res.map((roomTypeData) => ({
            label: roomTypeData.name,
            roomTypeId: roomTypeData.id,
            roomNumbers: roomTypeData.roomNumbers,
            loading: false,
          }));
          this.allRoomTypes = this.roomTypes;
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
        this.reservationListData = new ReservationList().deserialize(
          res
        ).reservationData;
        // Step 3: Update the data field in the corresponding IGRoomType object
        this.roomTypes.forEach((roomType) => {
          if (roomType.roomNumbers) {
            const matchingReservations = this.reservationListData.filter(
              (reservation) =>
                roomType.roomNumbers.some((roomNumber) =>
                  reservation.bookingItems.some(
                    (bookingItem) =>
                      bookingItem.roomDetails.roomNumber === roomNumber
                  )
                )
            );

            // Update the data field with matching reservations
            roomType.data = matchingReservations.map((reservation) => ({
              id: reservation.id,
              content: reservation.guestName,
              startPos: this.getDate(reservation.from),
              endPos: this.getDate(reservation.to),
              rowValue: reservation.bookingItems[0].roomDetails.roomNumber,
            }));
          }
        });
        console.log(this.roomTypes);
      });
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
    });

    this.useForm
      .get('roomType')
      .valueChanges.pipe(debounceTime(500))
      .subscribe((res: string[]) => {
        this.roomTypes = this.allRoomTypes.filter((item) =>
          res.includes(item.roomTypeId)
        );
        this.isRoomsEmpty = !res.length;
      });
  }

  getWeekendBG(day: string, isOccupancy = false) {
    return getWeekendBG(day, isOccupancy);
  }

  handleChange(event: IGChangeEvent) {
    const updateData = this.formService.mapCalendarViewData(
      this.reservationListData.filter((item) => item.id === event.id)[0],
      event.id,
      event.startPos,
      event.endPos,
      event.rowValue
    );
    const selectedRoomType = this.roomTypes.find((roomType) => {
      return roomType.roomNumbers.includes(event.rowValue);
    });
    selectedRoomType.loading = true;
    this.manageReservationService
      .updateReservation(this.entityId, event.id, updateData, 'ROOM_TYPE')
      .subscribe(
        (res) => {},
        (error) => {
          selectedRoomType.loading = false;
          this.resetData(event.id);
        },
        () => {
          selectedRoomType.loading = false;
        }
      );
    console.log(event, 'onChange event');
  }

  handleCreate(event: IGCreateEvent) {
    console.log(event, 'onCreate event');
  }

  handleEdit(event: IGEditEvent) {
    console.log(event, 'onEdit event');
  }

  resetData(id: string) {
    
  }

  getRoomsByRoomType() {}
}

type IGRoomType = {
  label: string;
  roomTypeId: string;
  roomNumbers?: IGRow[];
  loading?: boolean;
  data?: IGValue[];
};
