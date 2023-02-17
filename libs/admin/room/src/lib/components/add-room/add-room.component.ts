import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import { FormProps } from 'libs/admin/shared/src/lib/types/form.type';
import { Subscription } from 'rxjs';
import { iteratorFields } from '../../constant/form';
import { MultipleRoomList, SingleRoomList } from '../../models/room.model';
import { RoomTypeList } from '../../models/rooms-data-table.model';
import { RoomService } from '../../services/room.service';
import { AddRoomTypes, RoomTypeOption } from '../../types/room';

@Component({
  selector: 'hospitality-bot-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss'],
})
export class AddRoomComponent implements OnInit, OnDestroy {
  draftDate: string;

  roomId: string;
  roomTypeId: string;
  hotelId: string;

  useForm: FormGroup;
  useFormArray: FormArray;
  fields: IteratorField[];

  roomTypes: RoomTypeOption[] = [];
  submissionType: AddRoomTypes;

  props: FormProps = {
    variant: 'standard',
  };

  isRoomTypesLoading = false;
  isRoomInfoLoading = false;

  $subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private route: ActivatedRoute,
    private location: Location,
    private modalService: ModalService
  ) {
    this.initForm();
    this.submissionType = this.route.snapshot.paramMap.get(
      'type'
    ) as AddRoomTypes;
    this.fields = iteratorFields[this.submissionType];
    this.route.queryParams.subscribe((res) => {
      if (res.id) {
        this.roomId = res.id;
        this.fields[0].disabled = true;
      }
    });
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.initRoomTypes();
    if (this.roomId) this.initRoomDetails();
  }

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    this.useFormArray = this.fb.array([]);

    this.useForm = this.fb.group({
      roomType: ['', Validators.required],
      price: [''],
      currency: [''],
      rooms: this.useFormArray,
    });

    this.registerRoomTypeChangesListener();
  }

  /**
   * @function initRoomTypes Initialize room types options
   */
  initRoomTypes(): void {
    this.isRoomTypesLoading = true;
    this.$subscription.add(
      this.roomService.getRoomsTypeList(this.hotelId).subscribe((res) => {
        this.roomTypes = new RoomTypeList()
          .deserialize(res)
          .records.map((item) => ({
            id: item.id,
            label: item.name,
            price: item.price,
            currency: item.currency,
          }));

        this.patchRoomTypeValue();
        this.isRoomTypesLoading = false;
      })
    );
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
          this.roomTypeId = res.roomTypeDetails.id;
          this.draftDate = res.updated ?? res.created;
          this.useForm.patchValue({
            roomType: res.roomTypeDetails,
            price: res.price,
            currency: res.currency,
            rooms: [
              {
                roomNo: res.roomNumber,
                floorNo: res.floorNumber,
              },
            ],
          });

          this.patchRoomTypeValue();
          this.isRoomInfoLoading = false;
        })
    );
  }

  /**
   * @function patchRoomTypeValue Updates room types value
   */
  patchRoomTypeValue(): void {
    if (this.roomTypeId && this.roomTypes.length) {
      this.useForm.patchValue({
        roomType: this.roomTypes.find((item) => item.id === this.roomTypeId),
      });
    }
  }

  /**
   * Get loading state
   */
  get loading() {
    return this.isRoomInfoLoading && this.isRoomTypesLoading;
  }

  /**
   * @function registerRoomTypeChangesListener To listen to selected room type
   */
  registerRoomTypeChangesListener(): void {
    this.useForm
      .get('roomType')
      .valueChanges.subscribe((value: RoomTypeOption) => {
        this.useForm.patchValue({
          currency: value.currency,
          price: value.price,
        });
      });
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
        .updateRoom(
          this.hotelId,
          new SingleRoomList().deserialize({ id: this.roomId, ...data }).list[0]
        )
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
        .addRooms(
          this.hotelId,
          this.submissionType === 'single'
            ? new SingleRoomList().deserialize(data).list
            : new MultipleRoomList().deserialize(data).list
        )
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
          }
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
          this.initForm();
        }, this.handleError)
    );
  }

  /**
   * @function handleError to show the error
   * @param param0
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
