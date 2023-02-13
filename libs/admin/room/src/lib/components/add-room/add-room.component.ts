import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import { FormProps } from 'libs/admin/shared/src/lib/types/form.type';
import { Subscription } from 'rxjs';
import { iteratorFields } from '../../constant/form';
import {
  MultipleRoomList,
  SingleRoom,
  SingleRoomList,
} from '../../models/room.model';
import { RoomTypeList } from '../../models/rooms-data-table.model';
import { RoomService } from '../../services/room.service';
import { AddRoomTypes, RoomTypeOption } from '../../types/room';

@Component({
  selector: 'hospitality-bot-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss'],
})
export class AddRoomComponent implements OnInit, OnDestroy {
  // this is needed to be udpated
  updatedAt: string;

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
    private route: ActivatedRoute
  ) {
    this.initForm();
    this.submissionType = this.route.snapshot.paramMap.get(
      'type'
    ) as AddRoomTypes;
    this.fields = iteratorFields[this.submissionType];
    this.route.queryParams.subscribe((res) => {
      this.roomId = res.id;
    });
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.initRoomTypes();
    if (this.roomId) this.initRoomDetails();
  }

  initForm() {
    this.useFormArray = this.fb.array([]);

    this.useForm = this.fb.group({
      roomType: ['', Validators.required],
      price: [''],
      currency: [''],
      rooms: this.useFormArray,
    });

    this.registerRoomTypeChangesListener();
  }

  initRoomTypes() {
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

  initRoomDetails() {
    this.isRoomInfoLoading = true;
    this.$subscription.add(
      this.roomService
        .getRoomById(this.hotelId, this.roomId)
        .subscribe((res) => {
          this.roomTypeId = res.roomTypeDetails.id;

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

  patchRoomTypeValue() {
    if (this.roomTypeId && this.roomTypes.length) {
      this.useForm.patchValue({
        roomType: this.roomTypes.find((item) => item.id === this.roomTypeId),
      });
    }
  }

  get loading() {
    return this.isRoomInfoLoading && this.isRoomTypesLoading;
  }

  registerRoomTypeChangesListener() {
    this.useForm
      .get('roomType')
      .valueChanges.subscribe((value: RoomTypeOption) => {
        this.useForm.patchValue({
          currency: value.currency,
          price: value.price,
        });
      });
  }

  handleSubmit() {
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

  updateRoom() {
    const data = this.useForm.getRawValue();

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
      }, this.handleError);
  }

  addRooms() {
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
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.success.addSingleRoom`,
                priorityMessage: res.errorMessages[0],
              },
              '',
              { panelClass: res.errorMessages?.length ? 'danger' : 'success' }
            )
            .subscribe();
        }, this.handleError)
    );
  }

  /**
   * @function handleError to show the error
   * @param param0
   */
  handleError = ({ error }) => {
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
  }
}
