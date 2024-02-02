import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { BarPriceService } from '../../services/bar-price.service';
import { DateOption, UpdateBarPriceRequest } from '../../types/bar-price.types';
import { RatePlanRes } from 'libs/admin/room/src/lib/types/service-response';
import { Accordion } from 'primeng/accordion';
import { RoomTypes } from 'libs/admin/channel-manager/src/lib/models/bulk-update.models';
import { PricingDetails } from 'libs/admin/room/src/lib/models/rooms-data-table.model';
import {
  AdminUtilityService,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { BarPriceFactory } from '../../models/bar-price.model';
import { BarPriceRatePlan } from '../../constants/barprice.const';

/**
 * @remarks To be discarded
 */
@Component({
  selector: 'hospitality-bot-bar-price',
  templateUrl: './bar-price.component.html',
  styleUrls: ['./bar-price.component.scss'],
})
export class BarPriceComponent implements OnInit {
  useForm: FormGroup;
  roomTypes: RoomTypes[] = [];
  allRoomTypes: RoomTypes[] = [];
  entityId: string;
  dates: DateOption[];
  loading = false;
  isRoomsEmpty = false;
  isLoaderVisible = false;
  loadingError = false;
  active = [0];
  $subscription = new Subscription();
  isPreview = false;
  hasPreviewRendered = false;
  @ViewChild('accordion') accordion: Accordion;
  private valueChangesSubject = new Subject<string[]>();

  constructor(
    private fb: FormBuilder,
    private barPriceService: BarPriceService,
    private globalFilter: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilter.entityId;
    this.barPriceService.resetRoomDetails();
    this.initRoomTypes();
  }

  listenChanges() {
    this.useFormControl.roomType.valueChanges
      .pipe(
        tap((value) => {
          this.isLoaderVisible = true;
        }),
        debounceTime(600)
      )
      .subscribe((res: string[]) => {
        this.valueChangesSubject.next(res);
      });

    this.valueChangesSubject.subscribe((res: string[]) => {
      this.roomTypes = this.allRoomTypes.filter((item) =>
        res.includes(item.value)
      );
      this.isRoomsEmpty = !res.length;
      this.useForm.removeControl('roomTypes');
      this.addRoomTypesControl();
      this.isLoaderVisible = false;
    });
  }

  getArray(value?: number, restrictionFA?: FormArray) {
    if (restrictionFA && value) {
      return restrictionFA.controls.map((FG: FormGroup) =>
        FG.get('value').disabled ? FG.get('value').value : value
      );
    }
  }

  initRoomTypes() {
    this.barPriceService.roomDetails.subscribe((rooms: RoomTypes[]) => {
      if (this.barPriceService.isRoomDetailsLoaded) {
        rooms.sort((a, b) => (a.isBase === b.isBase ? 0 : a.isBase ? -1 : 1));
        this.roomTypes = rooms;
        this.allRoomTypes = rooms;
        this.initForm();
      } else {
        this.barPriceService.loadRoomTypes(this.entityId);
      }
    });
  }

  initForm() {
    this.useForm = this.fb.group({
      roomType: [],
      barPrices: this.getValuesArrayControl(),
    });
    this.addRoomsControl();
    this.useForm.markAllAsTouched();
  }

  addRoomsControl() {
    this.addRoomTypesControl();
    this.listenChanges();
  }

  /**
   * Return value controls form array
   * @returns FormArray
   */
  getValuesArrayControl() {
    return this.fb.array(
      this.roomTypes.map((item) => {
        const baseDetail = item?.ratePlans.find((ratePlan) => ratePlan.isBase);
        const dataForm = this.fb.group({
          isBase: [item.isBase],
          price: [
            { value: item?.price, disabled: !item.isBase },
            [Validators.min(0), Validators.required],
          ],
          baseId: [baseDetail?.id],
          variablePrice: [
            baseDetail?.variablePrice ?? null,
            [Validators.min(0), Validators.required],
          ],
          ratePlans: this.addRatePlans(item.ratePlans, item.pricingDetails),
          childBelowFive: [
            item.pricingDetails.paxChildBelowFive,
            [Validators.min(0), Validators.required],
          ],
          chileFiveToTwelve: [
            item.pricingDetails.paxChildAboveFive,
            [Validators.min(0), Validators.required],
          ],
          adult: [
            item.pricingDetails.paxAdult,
            [Validators.min(0), Validators.required],
          ],
          exceptions: this.fb.array([]),
          id: [item.value],
          label: [item.label],
        });
        this.listenBasePriceChanges(dataForm, item);
        return dataForm;
      })
    );
  }

  listenBasePriceChanges(formGroup: FormGroup, roomType: RoomTypes) {
    if (roomType.isBase) {
      formGroup.get('price').valueChanges.subscribe((res) => {
        (this.useFormControl.barPrices as FormArray).controls.forEach(
          (control: FormGroup) => {
            const { isBase, price } = control.controls;
            if (!isBase.value) {
              price.patchValue(res);
            }
          }
        );
      });
    }
  }

  addRatePlans(ratePlans: RatePlanRes[], priceDetails: PricingDetails) {
    return this.fb.array(
      [
        ...ratePlans.filter((item) => !item.isBase),
        {
          id: '',
          label: BarPriceRatePlan.double,
          variablePrice: priceDetails.paxDoubleOccupancy,
        },
        {
          id: '',
          label: BarPriceRatePlan.triple,
          variablePrice: priceDetails.paxTripleOccupancy,
        },
      ].map((item: RatePlanRes) =>
        this.fb.group({
          id: [item?.id],
          label: [item.label],
          value: [item.variablePrice, [Validators.min(0), Validators.required]],
        })
      )
    );
  }

  /**
   * @function addRoomTypesControl Add Room Types Control
   */
  addRoomTypesControl() {
    this.useForm.addControl('roomTypes', this.fb.array([]));
    this.roomTypes.forEach((roomType, _roomTypeIdx) => {
      this.useFormControl.roomTypes.push(
        this.fb.group({
          label: roomType.label,
          value: roomType.value,
        })
      );
    });
  }

  handleSave() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.openAllInvalidAccordion();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix the errors.'
      );
      return;
    }
    // this.hasPreviewRendered = true;
    // this.isPreview = true;
    this.saveData();
  }

  saveData() {
    this.loading = true;
    const data: UpdateBarPriceRequest = BarPriceFactory.buildRequest(
      this.useForm.getRawValue()
    );
    this.loading = true;
    this.$subscription.add(
      this.barPriceService
        .updateBarPrice(this.entityId, data, this.getQueryConfig())
        .subscribe(
          (res) => {
            this.snackbarService.openSnackBarAsText(
              `Bar Price Updated Successfully.`,
              '',
              { panelClass: 'success' }
            );

            this.useFormControl.barPrices.controls.sort(
              (control1: AbstractControl, control2: AbstractControl) =>
                control1.get('isBase').value === control2.get('isBase').value
                  ? 0
                  : control1.get('isBase').value
                  ? -1
                  : 1
            );
            this.loading = false;
            this.isPreview = false;
          },
          (error) => {
            this.loading = false;
          },
          this.handleFinal
        )
    );
  }

  openAllInvalidAccordion() {
    if (!!this.accordion?.tabs) {
      this.accordion.tabs.forEach((tab, index) => {
        if (!tab.selected && this.barPriceControl[index].invalid)
          tab.selected = true;
      });
    }
  }

  getQueryConfig(): QueryConfig {
    return {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: 'ROOM_TYPE',
          inventoryUpdateType: 'SETUP_BAR_PRICE',
        },
      ]),
    };
  }

  handleFinal() {
    this.loading = false;
    this.loadingError = false;
  }

  checkForRoomTypeSelection(id: string) {
    return !!this.useFormControl.roomTypes?.value.filter(
      (item) => item.value == id
    ).length;
  }

  addException(barPrice: FormGroup) {
    const fa = barPrice.controls.exceptions as FormArray;
    fa.push(
      this.fb.group({
        name: ['', Validators.required],
        price: ['', [Validators.required, Validators.min(0)]],
        fromDate: ['', Validators.required],
        toDate: ['', Validators.required],
        selectedDays: [[], [Validators.required]],
      })
    );
  }

  removeException(barPrice: FormGroup, index: number) {
    const fa = barPrice.controls.exceptions as FormArray;
    fa.removeAt(index);
  }

  statusUpdate(status: boolean, barPrice: AbstractControl) {
    this.useFormControl.barPrices.controls.forEach((item) => {
      item.patchValue({
        isBase: false,
      });
    });
    barPrice.patchValue({
      isBase: status,
    });
  }

  /** Getters */
  get useFormControl() {
    return this.useForm.controls as Record<
      'roomType' | 'barPrices',
      AbstractControl
    > & {
      roomTypes: FormArray;
      barPrices: FormArray;
    };
  }

  get roomTypesControl() {
    return this.useFormControl.roomTypes?.controls;
  }

  get barPriceControl() {
    return this.useFormControl.barPrices?.controls;
  }

  ngOnDestroy() {
    this.barPriceService.resetRoomDetails();
  }
}
