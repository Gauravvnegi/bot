import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import {
  LibrarySearchItem,
  LibraryService,
} from '@hospitality-bot/admin/library';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import {
  FlagType,
  ModuleNames,
  NavRouteOptions,
  Option,
} from 'libs/admin/shared/src';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import { Subscription } from 'rxjs';
import {
  iteratorFields,
  noRecordsActionForFeatures,
} from '../../constant/form';
import { roomStatusDetails } from '../../constant/response';
import routes, { roomRoutesConfig } from '../../constant/routes';
import {
  MultipleRoomList,
  SingleRoom,
  SingleRoomList,
} from '../../models/room.model';
import { RoomType, RoomTypeList } from '../../models/rooms-data-table.model';
import { RoomService } from '../../services/room.service';
import { AddRoomTypes, RoomTypeOption } from '../../types/room';
import {
  RoomFoStatus,
  RoomStatus,
  RoomTypeListResponse,
} from '../../types/service-response';
import {
  MultipleRoomForm,
  SingleRoomForm,
  StatusQuoForm,
} from '../../types/use-form';
import { Services } from '../../models/amenities.model';
import { convertToTitleCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'hospitality-bot-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss'],
})
export class AddRoomComponent implements OnInit, OnDestroy {
  draftDate: number | string = Date.now();
  dateTitle: string;

  roomId: string;
  entityId: string;

  useForm: FormGroup;
  statusQuoForm: FormGroup;
  useFormArray: FormArray;
  fields: IteratorField[];

  startMinDate = new Date();
  endMinDate = new Date();

  roomStatuses: Option[] = [];
  roomTypes: RoomTypeOption[] = [];
  submissionType: AddRoomTypes;
  featureIds: string[] = [];

  pageTitle = 'Add rooms';
  navRoutes: NavRouteOptions = [];

  isRoomInfoLoading = false;
  isLoadingFeatures = false;
  isStatusUpdated = false;

  /* roomTypes options variable */
  roomTypeOffSet = 0;
  loadingRoomTypes = false;
  noMoreRoomTypes = false;
  roomTypeLimit = 10;
  features = [];
  noRecordsActionFeatures = noRecordsActionForFeatures;

  $subscription = new Subscription();

  currentRoomState: { value: string; type: FlagType }[] = [];
  isDateRequired = false;

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private modalService: ModalService,
    private libraryService: LibraryService,
    private formService: FormService,
    private routesConfigService: RoutesConfigService
  ) {
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
      }
      this.initNavRoutes(!!res.id);
    });
  }

  ngOnInit(): void {
    this.endMinDate.setDate(this.startMinDate.getDate() + 1);
    this.entityId = this.globalFilterService.entityId;
    this.initForm();
    this.initOptionsConfig();
    if (this.roomId) this.initRoomDetails();
  }

  initNavRoutes(isEdit: boolean) {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes];
      if (isEdit) {
        this.navRoutes.push(...roomRoutesConfig.editRoom.navRoutes);
        return;
      }
      this.navRoutes.push(...roomRoutesConfig.room.navRoutes);
    });
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
      status: ['DIRTY'],
      rooms: this.useFormArray,
      featureIds: [[], Validators.required],
    });

    this.statusQuoForm = this.fb.group({
      status: ['', Validators.required],
      remark: [''],
      foStatus: [],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
    });

    this.registerFormListener();
  }

  /**
   * room form controls
   */
  get roomFormControls() {
    return this.useForm.controls as Record<
      keyof (SingleRoomForm | MultipleRoomForm),
      AbstractControl
    >;
  }

  /**
   * Return status quo form controls
   */
  get statusQuoFormControls() {
    return this.statusQuoForm.controls as Record<
      keyof StatusQuoForm,
      AbstractControl
    >;
  }

  /**
   *Handles Form subscription
   */
  registerFormListener() {
    this.registerRoomTypeChangesListener();
    this.registerRoomStateChangeListener();
    this.listenForRoomStatusChange();
  }

  listenForRoomStatusChange() {
    this.formService.roomStatus.subscribe((res) => {
      if (res) {
        this.statusQuoFormControls.status.patchValue(res);
        this.isStatusUpdated = true;
        const mainLayout = document.getElementById('main-layout');
        mainLayout.scrollTo(0, mainLayout.scrollHeight);
      }
    });
  }

  registerRoomStateChangeListener() {
    const { fromDate, toDate, status, foStatus } = this.statusQuoFormControls;

    foStatus.valueChanges.subscribe((res: RoomFoStatus) => {
      this.currentRoomState[1] = {
        value: roomStatusDetails[res].label,
        type: roomStatusDetails[res].type,
      };
    });

    status.valueChanges.subscribe((res: RoomStatus) => {
      this.currentRoomState[0] = {
        value: roomStatusDetails[res]?.label,
        type: roomStatusDetails[res]?.type,
      };

      this.isDateRequired = res === 'OUT_OF_ORDER' || res === 'OUT_OF_SERVICE';
      if (this.isDateRequired) {
        fromDate.setValidators([Validators.required]);
        toDate.setValidators([Validators.required]);
      } else {
        fromDate.clearValidators();
        toDate.clearValidators();
      }

      fromDate.updateValueAndValidity();
      toDate.updateValueAndValidity();
    });
  }

  /**
   * @function initOptionsConfig Initialize room types options
   */
  initOptionsConfig(): void {
    this.getRoomTypes();
    this.getDefaultFeatures();
  }

  /**
   * @function getCategories to get room type options
   */
  getRoomTypes(): void {
    this.loadingRoomTypes = true;
    this.$subscription.add(
      this.roomService
        .getList<RoomTypeListResponse>(this.entityId, {
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

  getDefaultFeatures() {
    this.isLoadingFeatures = true;
    this.$subscription.add(
      this.roomService.getFeatures().subscribe(
        (res) => {
          this.features = new Services().deserialize(res.features).services;
        },
        (err) => {},
        () => {
          this.isLoadingFeatures = false;
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
        .searchLibraryItem(this.entityId, {
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
        .getRoomById(this.entityId, this.roomId)
        .subscribe((res) => {
          this.featureIds = res.rooms[0].features.map((item) => item.id);
          const roomDetails = res.rooms[0];
          const statusDetails = res.rooms[0].statusDetailsList[0];
          this.draftDate = roomDetails.updated ?? roomDetails.created;
          this.dateTitle = roomDetails.updated ? 'Updated on' : 'Activated on';
          const data: SingleRoomForm = {
            roomTypeId: roomDetails.roomTypeDetails.id,
            price: roomDetails.price,
            currency: roomDetails.currency,
            status: statusDetails.status,
            rooms: [
              {
                roomNo: roomDetails.roomNumber,
                floorNo: roomDetails.floorNumber,
              },
            ],
            featureIds: roomDetails.features.map((item) => item.id),
          };

          if (
            this.roomTypes.findIndex(
              (item) => item.value === roomDetails.roomTypeDetails.id
            ) === -1
          ) {
            this.roomTypes.push({
              label: roomDetails?.roomTypeDetails?.name,
              value: roomDetails?.roomTypeDetails?.id,
              price: roomDetails?.price,
              currency: roomDetails?.currency,
            });
          }

          this.useForm.patchValue(data);

          if (roomDetails?.nextStates) {
            this.roomStatuses = roomDetails?.nextStates?.map((item) => ({
              label: convertToTitleCase(item),
              value: item,
            }));
          }
          this.roomStatuses.push({
            label: convertToTitleCase(statusDetails.status),
            value: statusDetails.status,
          });

          // If status is updated to OUT_OF_ORDER or OUT_OF_SERVICE from table.
          if (!this.isStatusUpdated)
            this.statusQuoFormControls.status.patchValue(statusDetails.status);

          // Only set the dates if available.
          if (statusDetails.fromDate) {
            this.statusQuoForm.patchValue({
              fromDate: statusDetails?.fromDate,
              toDate: statusDetails?.toDate,
            });
          }

          this.statusQuoForm.patchValue({
            remark: statusDetails.remarks,
            foStatus: roomDetails.frontOfficeState,
          });

          this.isRoomInfoLoading = false;
        })
    );
  }

  /**
   * Get loading state
   */
  get loading() {
    return (
      this.isRoomInfoLoading || this.loadingRoomTypes || this.isLoadingFeatures
    );
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
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.ROOM,
      additionalPath: routes.addRoomType,
    });
  }

  /**
   * @function handleSubmit Handle submission
   */
  handleSubmit(): void {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText('Please fill all the fields');
      return;
    }

    if (this.roomId) {
      this.updateRoom();
    } else {
      this.addRooms();
    }
  }

  resetForm() {
    this.useForm.reset();
  }

  /**
   * @function updateRoom To update the room data
   */
  updateRoom(): void {
    let data = this.useForm.getRawValue();
    let statusData = this.statusQuoForm.getRawValue();
    const activeFeatures = data.featureIds;
    const removeFeatures = this.featureIds.filter(
      (item) => !activeFeatures.includes(item)
    );

    this.$subscription.add(
      this.roomService
        .updateRoom(this.entityId, {
          room: new SingleRoom().deserialize({
            id: this.roomId,
            removeFeatures: removeFeatures,
            ...data,
            roomNo: null,
            statusDetailsList: [
              { ...statusData, isCurrentStatus: this.checkCurrentStatus() },
            ],
          }),
        })
        .subscribe(
          (res) => {
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
          },
          (error) => {}
        )
    );
  }

  /**
   * @function addRooms To add the rooms
   */
  addRooms(): void {
    const data = this.useForm.getRawValue();

    this.$subscription.add(
      this.roomService
        .addRooms(this.entityId, {
          rooms:
            this.submissionType === 'single'
              ? new SingleRoomList().deserialize(data).list
              : new MultipleRoomList().deserialize(data).list,
        })
        .subscribe(
          (res) => {
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
          },
          (error) => {}
        )
    );
  }

  checkCurrentStatus() {
    if (!this.statusQuoFormControls?.fromDate.value) return true;
    const todayEpoch = new Date().setHours(0, 0, 0, 0); // Get today's date in epoch format, setting time to midnight
    const fromDate = new Date(
      this.statusQuoFormControls.fromDate.value
    ).setHours(0, 0, 0, 0);
    // Compare the epoch values
    return fromDate === todayEpoch ? true : false;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
    this.fields[0].disabled = false;
  }
}
