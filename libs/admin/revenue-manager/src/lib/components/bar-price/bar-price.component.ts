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
import { DateOption } from '../../types/bar-price.types';
import { RatePlanRes } from 'libs/admin/room/src/lib/types/service-response';
import { Accordion } from 'primeng/accordion';
import { RoomTypes } from 'libs/admin/channel-manager/src/lib/models/bulk-update.models';
import { PricingDetails } from 'libs/admin/room/src/lib/models/rooms-data-table.model';

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
  @ViewChild('accordion') accordion: Accordion;
  private valueChangesSubject = new Subject<string[]>();

  constructor(
    private fb: FormBuilder,
    private barPriceService: BarPriceService,
    private globalFilter: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilter.entityId;
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
      this.roomTypes.map((item) =>
        this.fb.group({
          price: [item?.price, [Validators.min(0), Validators.required]],
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
        })
      )
    );
  }

  addRatePlans(ratePlans: RatePlanRes[], priceDetails: PricingDetails) {
    return this.fb.array(
      [
        ...ratePlans,
        { label: 'Double', variablePrice: priceDetails.paxDoubleOccupancy },
        { label: 'Triple', variablePrice: priceDetails.paxTripleOccupancy },
      ].map((item: RatePlanRes) =>
        this.fb.group({
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
    }
  }

  openAllInvalidAccordion() {
    if (!!this.accordion?.tabs) {
      this.accordion.tabs.forEach((tab, index) => {
        if (!tab.selected && this.barPriceControl[index].invalid)
          tab.selected = true;
      });
    }
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
}
