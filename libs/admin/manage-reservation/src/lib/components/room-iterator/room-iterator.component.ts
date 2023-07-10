import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { AdminUtilityService, Option } from 'libs/admin/shared/src';
import { IteratorComponent } from 'libs/admin/shared/src/lib/components/iterator/iterator.component';
import { Subscription } from 'rxjs';
import { roomFields, RoomFieldTypeOption } from '../../constants/reservation';
import { ManageReservationService } from '../../services/manage-reservation.service';

import {
  RoomTypeOption,
  RoomTypeOptionList,
} from '../../models/reservations.model';
@Component({
  selector: 'hospitality-bot-room-iterator',
  templateUrl: './room-iterator.component.html',
  styleUrls: ['./room-iterator.component.scss'],
})
export class RoomIteratorComponent extends IteratorComponent
  implements OnInit, OnDestroy {
  parentFormGroup: FormGroup;
  @Output() refreshData = new EventEmitter();
  @Output() listenChanges = new EventEmitter();
  fields = roomFields;
  globalQueries = [];
  errorMessages = {};
  roomTypeOffSet = 0;
  roomTypeLimit = 10;
  roomTypes: RoomFieldTypeOption[] = [];
  entityId: string;
  $subscription = new Subscription();
  loadingRoomTypes = false;

  constructor(
    protected fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private manageReservationService: ManageReservationService,
    private snackbarService: SnackBarService,
    private controlContainer: ControlContainer
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.createNewFields();
    this.listenForGlobalFilters();
  }

  /**
   * @function createNewFields To get the initial value config
   */
  createNewFields(): void {
    this.parentFormGroup = this.controlContainer.control as FormGroup;
    const data = {
      roomTypeId: [''],
      roomCount: ['', [Validators.required, Validators.min(1)]],
      roomNumber: [''],
      adultCount: ['', [Validators.required, Validators.min(1)]],
      childCount: ['', [Validators.min(0)]],
    };
    this.parentFormGroup.addControl('roomInformation', this.fb.group(data));
  }

  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      // set-global query everytime global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];

      this.getRoomType(this.globalQueries);
      this.listenForFormChanges();
    });
  }

  /**
   * @function loadMoreRoomTypes load more categories options
   */
  loadMoreRoomTypes(): void {
    this.roomTypeOffSet = this.roomTypeOffSet + 10;
    this.getRoomType(this.globalQueries);
  }

  /**
   * @function searchRoomTypes To search categories
   * @param text search text
   */
  searchRoomTypes(text: string): void {
    this.loadingRoomTypes = true;
    if (text) {
      this.manageReservationService
        .searchLibraryItem(this.entityId, {
          params: `?key=${text}&type=ROOM_TYPE`,
        })
        .subscribe(
          (res: any) => {
            const data = res;
            this.roomTypes =
              data.ROOM_TYPE?.filter((item) => item.status).map((item) => {
                new RoomTypeOption().deserialize(item);
                return {
                  label: item.name,
                  value: item.id,
                  roomCount: item.roomCount,
                  maxChildren: item.maxChildren,
                  maxAdult: item.maxAdult,
                };
              }) ?? [];
            this.fields[0].options = this.roomTypes;
          },
          ({ error }) => {
            this.snackbarService.openSnackBarAsText(error.message);
          },
          () => {
            this.loadingRoomTypes = false;
          }
        );
    } else {
      this.roomTypeOffSet = 0;
      this.roomTypes = [];
      this.getRoomType(this.globalQueries);
    }
  }

  getSummaryData(): void {
    this.refreshData.emit();
  }

  listenForFormChanges(): void {
    this.listenChanges.emit();
  }

  /**
   * @function getRoomType to get room types.
   * @param queries global Queries.
   */
  getRoomType(queries): void {
    queries = [
      ...queries,
      {
        type: 'ROOM_TYPE',
        offset: this.roomTypeOffSet,
        limit: this.roomTypeLimit,
        createBooking: true,
      },
    ];

    const config = {
      params: this.adminUtilityService.makeQueryParams(queries),
    };

    this.loadingRoomTypes = true;
    this.$subscription.add(
      this.manageReservationService
        .getRoomTypeList(this.entityId, config)
        .subscribe(
          (response) => {
            const data = new RoomTypeOptionList()
              .deserialize(response)
              .records.map((item) => ({
                label: item.name,
                value: item.id,
                roomCount: item.roomCount,
                maxChildren: item.maxChildren,
                maxAdult: item.maxAdult,
              }));
            this.roomTypes = [...this.roomTypes, ...data];
            this.fields[0].options = this.roomTypes;
          },
          ({ error }) => {
            this.snackbarService.openSnackBarAsText(error.message);
          },
          () => {
            this.loadingRoomTypes = false;
          }
        )
    );
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
