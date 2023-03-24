import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  LibrarySearchItem,
  LibraryService,
} from '@hospitality-bot/admin/library';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import routes from '../../constant/routes';
import { NavRouteOptions } from 'libs/admin/shared/src';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import { Subscription } from 'rxjs';
import { iteratorFields } from '../../constant/form';
import { MultipleRoomList, SingleRoomList } from '../../models/room.model';
import { RoomType, RoomTypeList } from '../../models/rooms-data-table.model';
import { RoomService } from '../../services/room.service';
import { AddRoomTypes, RoomTypeOption } from '../../types/room';
import { RoomTypeListResponse } from '../../types/service-response';

@Component({
  selector: 'hospitality-bot-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss'],
})
export class AddRoomComponent implements OnInit, OnDestroy {
  draftDate: number | string = Date.now();

  roomId: string;
  hotelId: string;

  useForm: FormGroup;
  useFormArray: FormArray;
  fields: IteratorField[];

  roomTypes: RoomTypeOption[] = [];
  submissionType: AddRoomTypes;

  pageTitle = 'Add rooms';
  navRoutes: NavRouteOptions = [
    { label: 'Inventory', link: './' },
    { label: 'Rooms', link: '/pages/inventory/room' },
    { label: 'Add Rooms', link: './' },
  ];

  isRoomInfoLoading = false;

  /* roomTypes options variable */
  roomTypeOffSet = 0;
  loadingRoomTypes = false;
  noMoreRoomTypes = false;
  roomTypeLimit = 10;

  $subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private modalService: ModalService,
    private libraryService: LibraryService
  ) {
    this.initForm();
    this.submissionType = this.route.snapshot.paramMap.get(
      'type'
    ) as AddRoomTypes;

    this.pageTitle = `Add ${this.submissionType} room`;
    this.fields = iteratorFields[this.submissionType];
    this.route.queryParams.subscribe((res) => {
      if (res.id) {
        this.roomId = res.id;
        this.fields[0].disabled = true;
        this.pageTitle = 'Edit Room';
        this.navRoutes[2].label = 'Edit Room';
      }
    });
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.initOptionsConfig();
    if (this.roomId) this.initRoomDetails();
  }

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    this.useFormArray = this.fb.array([]);

    this.useForm = this.fb.group({
      roomTypeId: ['', Validators.required],
      price: [''],
      currency: [''],
      rooms: this.useFormArray,
    });

    this.registerRoomTypeChangesListener();
  }

  /**
   * @function initOptionsConfig Initialize room types options
   */
  initOptionsConfig(): void {
    this.getRoomTypes();
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
          this.handleError,
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
          this.handleError,
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

  /**
   * @function loadMoreRoomTypes load more categories options
   */
  loadMoreRoomTypes() {
    this.roomTypeOffSet = this.roomTypeOffSet + 10;
    this.getRoomTypes();
  }

  /**
   * @function initRoomDetails Initialize room details
   */
  initRoomDetails(): void {
    this.isRoomInfoLoading = true;
    this.$subscription.add(
      this.roomService
        .getRoomById(this.hotelId, this.roomId)
        .subscribe((res) => {
          const roomDetails = res.rooms[0];
          this.draftDate = roomDetails.updated ?? roomDetails.created;
          this.useForm.patchValue({
            roomTypeId: roomDetails.roomTypeDetails.id,
            price: roomDetails.price,
            currency: roomDetails.currency,
            rooms: [
              {
                roomNo: roomDetails.roomNumber,
                floorNo: roomDetails.floorNumber,
              },
            ],
          });

          this.isRoomInfoLoading = false;
        })
    );
  }

  /**
   * Get loading state
   */
  get loading() {
    return this.isRoomInfoLoading || this.loadingRoomTypes;
  }

  /**
   * @function registerRoomTypeChangesListener To listen to selected room type
   */
  registerRoomTypeChangesListener(): void {
    this.useForm.get('roomTypeId').valueChanges.subscribe((value: string) => {
      const selectedRoomType = this.roomTypes.find(
        (item) => item.value === value
      );

      this.useForm.patchValue({
        currency: selectedRoomType.currency,
        price: selectedRoomType.price,
      });
    });
  }

  /**
   * @function addRoomType Add room type
   */
  createRoomType() {
    this.router.navigate([`/pages/inventory/room/${routes.addRoomType}`]);
  }

  /**
   * @function handleSubmit Handle submission
   */
  handleSubmit(): void {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText('Invalid Login form');
      return;
    }

    if (this.roomId) {
      this.updateRoom();
    } else {
      this.addRooms();
    }
  }

  /**
   * @function updateRoom To update the room data
   */
  updateRoom(): void {
    const data = this.useForm.getRawValue();

    this.$subscription.add(
      this.roomService
        .updateRoom(this.hotelId, {
          rooms: [
            new SingleRoomList().deserialize({ id: this.roomId, ...data })
              .list[0],
          ],
        })
        .subscribe((res) => {
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.success.updatedRoom`,
                priorityMessage: '',
              },
              '',
              { panelClass: 'success' }
            )
            .subscribe();
          this.location.back();
        }, this.handleError)
    );
  }

  /**
   * @function addRooms To add the rooms
   */
  addRooms(): void {
    const data = this.useForm.getRawValue();

    this.$subscription.add(
      this.roomService
        .addRooms(this.hotelId, {
          rooms:
            this.submissionType === 'single'
              ? new SingleRoomList().deserialize(data).list
              : new MultipleRoomList().deserialize(data).list,
        })
        .subscribe((res) => {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          const togglePopupCompRef = this.modalService.openDialog(
            ModalComponent,
            dialogConfig
          );

          togglePopupCompRef.componentInstance.onClose.subscribe(() => {
            this.modalService.close();
          });

          if (res.errorMessages.length) {
            togglePopupCompRef.componentInstance.content = {
              heading: 'Rooms not added',
              description: res.errorMessages,
            };
          } else this.location.back();

          if (res.rooms.length) {
            this.$subscription.add(
              this.snackbarService
                .openSnackBarWithTranslate(
                  {
                    translateKey: `messages.success.addSingleRoom`,
                    priorityMessage: '',
                  },
                  '',
                  { panelClass: 'success' }
                )
                .subscribe()
            );
          }
        }, this.handleError)
    );
  }

  /**
   * @function handleError to show the error
   * @param param0 network error
   */
  handleError = ({ error }): void => {
    this.snackbarService
      .openSnackBarWithTranslate(
        {
          translateKey: `messages.error.${error?.type}`,
          priorityMessage: error?.message,
        },
        ''
      )
      .subscribe();
  };

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
    this.fields[0].disabled = false;
  }
}
