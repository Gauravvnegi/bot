import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  Option,
  EntitySubType,
  EntityType,
} from '@hospitality-bot/admin/shared';
import {
  OfferList,
  OfferData,
  SummaryData,
  BookingInfo,
} from '../../models/reservations.model';
import { ManageReservationService } from '../../services/manage-reservation.service';
import {
  editModeStatusOptions,
  menuItemFields,
  restaurantReservationTypes,
  statusOptions,
} from '../../constants/reservation';
import { ReservationForm } from '../../constants/form';
import { FormService } from '../../services/form.service';
import {
  OutletItems,
  ReservationType,
} from '../../constants/reservation-table';
import { debounceTime } from 'rxjs/operators';
import { OutletForm } from '../../models/reservations.model';
import { ReservationSummary } from '../../types/forms.types';
import { MenuItemListResponse } from 'libs/admin/all-outlets/src/lib/types/outlet';
import { BaseReservationComponent } from '../base-reservation.component';

@Component({
  selector: 'hospitality-bot-restaurant-reservation',
  templateUrl: './restaurant-reservation.component.html',
  styleUrls: [
    './restaurant-reservation.component.scss',
    '../reservation.styles.scss',
  ],
})
export class RestaurantReservationComponent extends BaseReservationComponent
  implements OnInit {
  menuItemsArray: FormArray;
  foodPackageArray: FormArray;

  reservationType: string;

  menuItemsValues = [];
  reservationTypes: Option[] = [];
  statusOptions: Option[] = [];
  foodPackages: Option[] = [];

  expandAccordion = false;

  date: string;
  time: string;

  /* menu options variable */
  menuItems: (Option & { deliveryPrice?: number; dineInPrice: number })[] = [];
  outletItems: OutletItems[] = [];

  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    protected globalFilterService: GlobalFilterService,
    private manageReservationService: ManageReservationService,
    protected activatedRoute: ActivatedRoute,
    private formService: FormService
  ) {
    super(globalFilterService, activatedRoute);
    this.initForm();
  }

  ngOnInit(): void {
    this.initDetails();
    this.getMenuItems();
    this.initOptions();
    this.getReservationId();
    this.listenForFormChanges();
  }

  initDetails() {
    this.bookingType = EntitySubType.RESTAURANT;
    this.outletId = this.selectedEntity.id;
    this.fields = menuItemFields;
    this.outletItems = [OutletItems.MENU_ITEM, OutletItems.FOOD_PACKAGE];
    this.expandAccordion = this.formService.enableAccordion;
    if (this.expandAccordion) {
      this.formService.enableAccordion = false;
    }
  }

  initOptions() {
    // Update fields for search in select component
    this.fields[0] = {
      ...this.fields[0],
      noMoreResults: true,
    };
    this.reservationTypes = restaurantReservationTypes;
  }

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    this.menuItemsArray = this.fb.array([]);
    this.foodPackageArray = this.fb.array([]);

    this.userForm = this.fb.group({
      reservationInformation: this.fb.group({
        dateAndTime: ['', Validators.required],
        reservationType: ['', Validators.required],
        status: ['', Validators.required],
        source: ['', Validators.required],
        sourceName: ['', [Validators.required, Validators.maxLength(60)]],
        marketSegment: ['', Validators.required],
      }),
      orderInformation: this.fb.group({
        tableNumber: [''],
        numberOfAdults: [1],
        foodPackages: new FormArray([]),
        menuItems: this.menuItemsArray,
        kotInstructions: [''],
      }),
      offerId: [''],
    });

    // Add food package items to the form
    this.foodPackageArray = this.userForm.get(
      'orderInformation.foodPackages'
    ) as FormArray;

    // Add the first food package item to the form
    this.foodPackageArray.push(this.createFoodPackageItem());
  }

  createFoodPackageItem(): FormGroup {
    return this.fb.group({
      type: [''],
      count: [''],
    });
  }

  addFoodPackageItem(): void {
    this.foodPackageArray.push(this.createFoodPackageItem());
  }

  removeFoodPackageItem(index: number): void {
    this.foodPackageArray.removeAt(index);
  }

  /**
   * @function listenForFormChanges Listen for form values changes.
   */
  listenForFormChanges(): void {
    this.inputControls.orderInformation.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((res) => {
        this.getSummaryData();
      });

    this.formService.reservationDateAndTime.subscribe((res) => {
      if (res) this.setDateAndTime(res);
    });

    this.listenReservationTypeChanges();
    this.reservationInfoControls.status.valueChanges.subscribe((res) => {
      if (res === 'NOSHOW' || res === 'CANCELED') {
        this.orderInfoControls.tableNumber.disable();
        this.orderInfoControls.numberOfAdults.disable();
      } else {
        this.orderInfoControls.numberOfAdults.enable();
        this.orderInfoControls.tableNumber.enable();
      }
    });
  }

  listenReservationTypeChanges() {
    // Filter menu items which has delivery price
    this.reservationInfoControls.reservationType.valueChanges.subscribe(
      (res) => {
        this.reservationType = res;
        res === 'DELIVERY'
          ? (this.fields[0].options = this.fields[0].options.filter(
              (items) => items.deliveryPrice
            ))
          : (this.fields[0].options = this.menuItems);

        const indexesToRemove: number[] = [];

        // remove the items if already patched
        this.menuItemsControls.forEach((control, index) => {
          const value = control.get('menuItems').value;
          if (value) {
            const item = this.fields[0].options.find(
              (option) => option.value === value
            );
            if (!item) {
              indexesToRemove.push(index);
            }
          }
        });
        // Remove the controls after the loop
        indexesToRemove.reverse().forEach((index) => {
          this.menuItemsArray.removeAt(index);
        });
      }
    );
  }

  /**
   * @function onItemsAdded To keep track of current index of form array
   * @param index current index
   */
  onItemsAdded(index: number): void {
    this.menuItemsControls[index]
      .get('menuItems')
      .valueChanges.subscribe((res) => {
        const selectedMenuItem = this.menuItems.find(
          (service) => service.value === res
        );

        const selectedPrice =
          this.reservationType === 'DELIVERY'
            ? selectedMenuItem?.deliveryPrice
            : selectedMenuItem?.dineInPrice;

        this.menuItemsControls[index].get('amount').setValue(selectedPrice);
        this.menuItemsControls[index].get('unit').setValue(1);

        this.getSummaryData();
      });
    this.menuItemsControls[index]
      .get('unit')
      .valueChanges.pipe(debounceTime(1000))
      .subscribe((res: number) => this.getSummaryData());
  }

  /**
   * @function setDateAndTime Set date and time in summary data
   * @param dateTime epoch date
   */
  setDateAndTime(dateTime: number) {
    const dateAndTime = new Date(dateTime);
    const date = dateAndTime.toLocaleDateString();
    const time = dateAndTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    // Update template variables
    this.date = date;
    this.time = time;
  }

  getReservationId(): void {
    if (this.reservationId) {
      this.statusOptions = [
        ...statusOptions,
        { label: 'Seated', value: 'SEATED' },
      ];
      this.getReservationDetails();
    } else {
      this.statusOptions = [
        ...editModeStatusOptions,
        { label: 'Seated', value: 'SEATED' },
      ];
    }
  }

  getReservationDetails(): void {
    this.$subscription.add(
      this.manageReservationService
        .getReservationDataById(this.reservationId, this.entityId)
        .subscribe(
          (response) => {
            const data = new OutletForm().deserialize(response);
            const {
              orderInformation: { menuItems, ...orderInfo },
              ...formData
            } = data;

            // Menu Items Array Values
            this.menuItemsValues = menuItems;
            this.userForm.patchValue({
              orderInformation: orderInfo,
              ...formData,
            });
          },
          (error) => {}
        )
    );
  }

  setFormDisability(): void {
    // this.userForm.get('reservationInformation.source').disable();
    if (this.reservationId) {
      const reservationType = this.reservationInfoControls.reservationType
        .value;
      switch (true) {
        case reservationType === ReservationType.CONFIRMED:
          this.userForm.disable();
          this.disabledForm = true;
          break;
        case reservationType === ReservationType.CANCELED:
          this.userForm.disable();
          this.disabledForm = true;
          break;
        // case data.source === 'CREATE_WITH':
        //   this.disabledForm = true;
        //   break;
        // case data.source === 'OTHERS':
        //   this.disabledForm = true;
        //   break;
      }
    }
  }

  getMenuItems() {
    this.$subscription.add(
      this.manageReservationService
        .getMenuList(this.outletId)
        .subscribe((items: MenuItemListResponse) => {
          this.menuItems = items.records.map((item) => ({
            label: item.name,
            value: item.id,
            deliveryPrice: item?.deliveryPrice ?? null,
            dineInPrice: item.dineInPrice,
          }));
          this.fields[0].options = this.menuItems;
        })
    );
  }

  offerSelect(offerData?: OfferData): void {
    if (offerData) {
      this.userForm.patchValue({ offerId: offerData.id });
      this.getSummaryData();
    } else {
      this.userForm.get('offerId').reset();
      this.getSummaryData();
    }
    this.selectedOffer = offerData;
  }

  getSummaryData(): void {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        { type: EntityType.OUTLET },
      ]),
    };

    const data: ReservationSummary = {
      fromDate: this.reservationInfoControls.dateAndTime.value,
      toDate: this.reservationInfoControls.dateAndTime.value,
      occupancyDetails: {
        maxAdult: this.orderInfoControls.numberOfAdults.value,
      },
      items: this.menuItemsControls.map((item) => ({
        itemId: item.get('menuItems').value,
        unit: item.get('unit')?.value ?? 0,
        amount: item.get('amount').value,
      })),
      outletType: EntitySubType.RESTAURANT,
    };

    this.$subscription.add(
      this.manageReservationService
        .getSummaryData(this.outletId, data, config)
        .subscribe(
          (res) => {
            this.summaryData = new SummaryData()?.deserialize(res);
            this.userForm
              .get('paymentMethod.totalPaidAmount')
              .setValidators([Validators.max(this.summaryData?.totalAmount)]);
            this.userForm
              .get('paymentMethod.totalPaidAmount')
              .updateValueAndValidity();
            this.userForm
              .get('paymentRule.deductedAmount')
              .patchValue(this.summaryData?.totalAmount);
            this.deductedAmount = this.summaryData?.totalAmount;
          },
          (error) => {},
          () => this.setFormDisability()
        )
    );
  }

  get orderInfoControls() {
    return (this.userForm.get('orderInformation') as FormGroup)
      .controls as Record<
      keyof ReservationForm['orderInformation'],
      AbstractControl
    >;
  }

  get menuItemsControls() {
    return ((this.userForm.get('orderInformation') as FormGroup).get(
      'menuItems'
    ) as FormArray).controls;
  }
}
