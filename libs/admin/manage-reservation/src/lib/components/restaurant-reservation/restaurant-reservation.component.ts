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
  HotelDetailService,
} from '@hospitality-bot/admin/shared';
import { SummaryData } from '../../models/reservations.model';
import { ManageReservationService } from '../../services/manage-reservation.service';
import {
  editModeStatusOptions,
  menuItemFields,
  restaurantReservationTypes,
  statusOptions,
} from '../../constants/reservation';
import { ReservationForm } from '../../constants/form';
import { FormService } from '../../services/form.service';
import { OutletItems } from '../../constants/reservation-table';
import { debounceTime } from 'rxjs/operators';
import { OutletForm } from '../../models/reservations.model';
import { ReservationSummary } from '../../types/forms.types';
import { MenuItemListResponse } from 'libs/admin/all-outlets/src/lib/types/outlet';
import { BaseReservationComponent } from '../base-reservation.component';
import { OutletService } from 'libs/admin/all-outlets/src/lib/services/outlet.service';
import { FoodPackageList } from 'libs/admin/all-outlets/src/lib/models/outlet.model';

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
    private outletService: OutletService,
    protected formService: FormService,
    protected hotelDetailService: HotelDetailService
  ) {
    super(globalFilterService, activatedRoute, hotelDetailService, formService);
    this.initForm();
  }
  ngOnInit(): void {
    this.initDetails();
    this.getMenuItems();
    this.initOptions();
    this.getReservationId();
    this.initFormData();
    this.listenForFormChanges();
    this.getFoodPackages();
  }

  initDetails() {
    this.bookingType = EntitySubType.RESTAURANT;
    this.outletId = this.selectedEntity.value;
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
        if (res.menuItems[0].menuItems === null) {
          this.summaryData = new SummaryData().deserialize();
          return;
        }
        if (res.menuItems[res.menuItems?.length - 1].menuItems?.length) {
          this.getSummaryData();
        }
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

        // Do not patch in edit mode
        if (this.menuItemsValues.length < index + 1)
          this.menuItemsControls[index].get('unit').setValue(1);
      });
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

  initFormData() {
    this.$subscription.add(
      this.formService.reservationForm
        .pipe(debounceTime(500))
        .subscribe((res) => {
          if (res) {
            const {
              orderInformation: { menuItems, ...orderInfo },
              ...formData
            } = res;
            this.menuItemsValues = menuItems;
            this.userForm.patchValue({
              orderInformation: orderInfo,
              ...formData,
            });
          }
        })
    );
  }

  getReservationId(): void {
    if (this.reservationId) {
      this.getReservationDetails();
    } else {
      this.statusOptions = [
        ...statusOptions,
        // { label: 'Seated', value: 'SEATED' },
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
              guestInformation,
              reservationInformation: {
                source,
                sourceName,
                ...reservationInfo
              },
              ...formData
            } = data;

            this.formService.sourceData.next({
              source: source,
              sourceName: sourceName,
            });

            this.formValueChanges = true;

            // Menu Items Array Values
            this.menuItemsValues = menuItems;
            this.formService.guestInformation.next(guestInformation);

            this.userForm.patchValue({
              reservationInformation: reservationInfo,
              orderInformation: orderInfo,
              ...formData,
            });
          },
          (error) => {}
        )
    );
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

  getSummaryData(): void {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        { type: EntityType.OUTLET },
      ]),
    };

    const data: ReservationSummary = {
      from: this.reservationInfoControls.dateAndTime.value,
      to: this.reservationInfoControls.dateAndTime.value,
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

            if (this.formValueChanges) {
              this.setFormDisability();
              this.formValueChanges = false;
            }
          },
          (error) => {}
        )
    );
  }

  getFoodPackages() {
    this.outletService
      .getFoodPackageList(this.outletId, {
        params: `?type=FOOD_PACKAGE&pagination=false`,
      })
      .subscribe(
        (res) => {
          this.foodPackages = new FoodPackageList()
            .deserialize(res)
            .records.map((foodPackage) => ({
              label: foodPackage.name,
              value: foodPackage.id,
            }));
        },
        (err) => {}
      );
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
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

  get menuControls() {
    return this.userForm.get('orderInformation') as FormGroup;
  }
}
