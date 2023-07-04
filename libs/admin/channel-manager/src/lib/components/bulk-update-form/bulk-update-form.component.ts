import { Component, Input, OnInit } from '@angular/core';
import { FormComponent } from 'libs/admin/shared/src/lib/components/form-component/form.components';
import { ControlContainer, FormGroup, Validators } from '@angular/forms';
import { updateItems, weeks } from '../constants/bulkupdate-response';
import { RoomTypeOption } from 'libs/admin/room/src/lib/types/room';
import { RoomTypeListResponse } from 'libs/admin/room/src/lib/types/service-response';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  LibrarySearchItem,
  LibraryService,
} from '@hospitality-bot/admin/library';
import {
  RoomType,
  RoomTypeList,
} from 'libs/admin/room/src/lib/models/rooms-data-table.model';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';
import { Subscription } from 'rxjs';
import {
  RestrictionAndValuesOption,
  restrictionsRecord,
  inventoryRestrictions,
} from '../../constants/data';
@Component({
  selector: 'hospitality-bot-bulk-update-form',
  templateUrl: './bulk-update-form.component.html',
  styleUrls: ['./bulk-update-form.component.scss'],
})
export class BulkUpdateFormComponent extends FormComponent {
  readonly restrictionsRecord = restrictionsRecord;

  updateItems = updateItems;

  restrictions: RestrictionAndValuesOption[];

  weeks = weeks;

  hotelId: string;
  parentForm: FormGroup;
  endMinDate = new Date();
  startMinDate = new Date();
  roomTypes: RoomTypeOption[] = [];
  /* roomTypes options variable */
  roomTypeOffSet = 0;
  loadingRoomTypes = false;
  noMoreRoomTypes = false;
  roomTypeLimit = 10;

  $subscription = new Subscription();
  private _controls = {
    update: 'update',
    updateValue: 'updateValue',
    fromDate: 'fromDate',
    toDate: 'toDate',
    roomType: 'roomType',
    selectedDays: 'selectedDays',
  };

  @Input() set controls(value: { [key: string]: string }) {
    this._controls = { ...this._controls, ...value };
  }

  get controls() {
    return this._controls;
  }

  constructor(
    public controlContainer: ControlContainer,
    private roomService: RoomService,
    private globalFilterService: GlobalFilterService,
    private libraryService: LibraryService
  ) {
    super(controlContainer);
  }
  ngOnInit(): void {
    this.parentForm = this.controlContainer.control as FormGroup;
    this.hotelId = this.globalFilterService.hotelId;
    this.listenChanges();
    this.initOptionsConfig();
  }

  listenChanges() {
    this.parentForm
      .get(this.controls.fromDate)
      .valueChanges.subscribe((value) => {
        this.endMinDate = new Date(value);
      });

    this.parentForm
      .get(this.controls.update)
      .valueChanges.subscribe((changedValue) => {
        const target = this.parentForm.controls[this.controls.updateValue];
        target.reset();

        restrictionsRecord[changedValue].type === 'boolean'
          ? target.clearValidators()
          : target.setValidators([Validators.required]);

        target.updateValueAndValidity();
      });
  }

  // reviewPoint: all these function should be in the room type component itself

  /**
   * @function loadMoreRoomTypes load more categories options
   */
  loadMoreRoomTypes() {
    this.roomTypeOffSet = this.roomTypeOffSet + 10;
    this.getRoomTypes();
  }

  /**
   * @function initOptionsConfig Initialize room types options
   */
  initOptionsConfig(): void {
    this.getRoomTypes();
    this.getRestrictions();
  }

  getRestrictions() {
    this.restrictions = inventoryRestrictions.map((item) => {
      const { label, type } = this.restrictionsRecord[item];
      return { label, type, value: item };
    });
  }

  /**
   * @function getCategories to get room type options
   */
  getRoomTypes(): void {
    this.loadingRoomTypes = true;
    this.$subscription.add(
      this.roomService
        .getList<RoomTypeListResponse>(this.hotelId, {
          params: `?type=ROOM_TYPE&offset=${this.roomTypeOffSet}&limit=${this.roomTypeLimit}`,
        })
        .subscribe(
          (res) => {
            const data = new RoomTypeList()
              .deserialize(res)
              .records.map((item) => ({
                label: item.name,
                value: item.id,
                price: item.price,
                currency: item.currency,
              }));
            this.roomTypes = [...this.roomTypes, ...data];
            this.noMoreRoomTypes = data.length < this.roomTypeLimit;
          },
          (error) => {},
          () => {
            this.loadingRoomTypes = false;
          }
        )
    );
  }

  /**
   * @function searchRoomTypes To search categories
   * @param text search text
   */
  searchRoomTypes(text: string) {
    if (text) {
      this.loadingRoomTypes = true;
      this.libraryService
        .searchLibraryItem(this.hotelId, {
          params: `?key=${text}&type=${LibrarySearchItem.ROOM_TYPE}`,
        })
        .subscribe(
          (res) => {
            const data = res && res[LibrarySearchItem.ROOM_TYPE];
            this.roomTypes =
              data
                ?.filter((item) => item.status)
                .map((item) => {
                  const roomType = new RoomType().deserialize(item);

                  return {
                    label: roomType.name,
                    value: roomType.id,
                    price: roomType.price,
                    currency: roomType.currency,
                  };
                }) ?? [];
          },
          (error) => {},
          () => {
            this.loadingRoomTypes = false;
          }
        );
    } else {
      this.roomTypeOffSet = 0;
      this.roomTypes = [];
      this.getRoomTypes();
    }
  }
}
