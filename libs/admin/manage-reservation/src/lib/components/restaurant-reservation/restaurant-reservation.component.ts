import { Component, Input, OnInit } from '@angular/core';
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
  NavRouteOptions,
  AdminUtilityService,
  Option,
  EntitySubType,
  EntityType,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { manageReservationRoutes } from '../../constants/routes';
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
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import { ReservationForm } from '../../constants/form';
import { FormService } from '../../services/form.service';
import { OutletService } from 'libs/admin/all-outlets/src/lib/services/outlet.service';
import { SelectedEntity } from '../../types/reservation.type';
import { OutletItems } from '../../constants/reservation-table';
import { MenuItemListResponse } from '../../types/response.type';
import { debounceTime } from 'rxjs/operators';
import { OutletForm } from '../../models/reservations.model';

@Component({
  selector: 'hospitality-bot-restaurant-reservation',
  templateUrl: './restaurant-reservation.component.html',
  styleUrls: [
    './restaurant-reservation.component.scss',
    '../reservation.styles.scss',
  ],
})
export class RestaurantReservationComponent implements OnInit {
  userForm: FormGroup;
  menuItemsArray: FormArray;
  foodPackageArray: FormArray;

  fields: IteratorField[];

  entityId: string;
  reservationId: string;
  reservationType: string;
  outletId: string;

  menuItemsValues = [];
  reservationTypes: Option[] = [];
  statusOptions: Option[] = [];
  foodPackages: Option[] = [];

  offersList: OfferList;
  selectedOffer: OfferData;
  summaryData: SummaryData;

  // loading = false;
  formValueChanges = false;
  disabledForm = false;
  expandAccordion = false;

  date: string;
  time: string;
  deductedAmount = 0;
  bookingType = EntitySubType.RESTAURANT;

  pageTitle: string;
  routes: NavRouteOptions = [];

  /* menu options variable */
  menuItems: (Option & { deliveryPrice?: number; dineInPrice: number })[] = [];
  outletItems: OutletItems[] = [];
  // summaryInfo: SummaryInfo;
  tableNumber = '';
  numberOfAdults = '';

  @Input() selectedEntity: SelectedEntity;

  $subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private manageReservationService: ManageReservationService,
    protected activatedRoute: ActivatedRoute,
    private formSerivce: FormService,
    private outletService: OutletService
  ) {
    this.initForm();
    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id');

    const { navRoutes, title } = manageReservationRoutes[
      this.reservationId ? 'editReservation' : 'addReservation'
    ];
    this.routes = navRoutes;
    this.pageTitle = title;
    this.outletItems = [OutletItems.MENU_ITEM, OutletItems.FOOD_PACKAGE];
  }

  ngOnInit(): void {
    this.initDetails();
    this.entityId = this.globalFilterService.entityId;
    this.outletId = this.selectedEntity.id;
    this.fields = menuItemFields;
    this.getMenuItems();
    this.initOptions();
    this.getReservationId();
  }

  initDetails() {
    this.entityId = this.globalFilterService.entityId;
    this.expandAccordion = this.formSerivce.enableAccordion;
    if (this.expandAccordion) {
      this.formSerivce.enableAccordion = false;
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
        numberOfAdults: [0],
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
    this.inputControl.orderInformation.valueChanges.subscribe((res) => {
      this.numberOfAdults = `For ${res?.numberOfAdults} Adults`;
      this.tableNumber = `Table Number: ${res?.tableNumber}`;
    });

    this.formSerivce.reservationDateAndTime.subscribe((res) => {
      if (res) this.setDateAndTime(res);
    });

    // Filter menu items which has delivery price
    this.reservationInfoControls.reservationType.valueChanges.subscribe(
      (res) => {
        this.reservationType = res;
        res === 'DELIVERY'
          ? (this.fields[0].options = this.fields[0].options.filter(
              (items) => items.deliveryPrice
            ))
          : (this.fields[0].options = this.menuItems);
      }
    );

    this.reservationInfoControls.reservationType.valueChanges.subscribe(
      (res) => {
        if (res === 'NOSHOW' || res === 'CANCELED') {
          this.orderInfoControls.tableNumber.disable();
          this.orderInfoControls.numberOfAdults.disable();
        } else {
          this.orderInfoControls.numberOfAdults.enable();
          this.orderInfoControls.tableNumber.enable();
        }
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
        this.menuItemsControls[index].get('quantity').setValue(1);

        this.getSummaryData();
      });
    this.menuItemsControls[index]
      .get('quantity')
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
      this.userForm.valueChanges.subscribe((_) => {
        if (!this.formValueChanges) {
          this.formValueChanges = true;
          this.listenForFormChanges();
        }
      });
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
            this.menuItemsValues = menuItems;
            this.userForm.patchValue({
              orderInformation: orderInfo,
              ...formData,
            });
            this.summaryData = new SummaryData().deserialize(response);
            this.setFormDisability(data.reservationInformation);
            if (data.offerId)
              this.getOfferByRoomType(
                this.userForm.get('roomInformation.roomTypeId').value
              );
            this.userForm.valueChanges.subscribe((_) => {
              if (!this.formValueChanges) {
                this.formValueChanges = true;
                this.listenForFormChanges();
              }
            });
          },
          (error) => {}
        )
    );
  }

  setFormDisability(data: BookingInfo): void {
    this.userForm.get('reservationInformation.source').disable();
    switch (true) {
      case data.reservationType === 'CONFIRMED':
        this.userForm.disable();
        this.disabledForm = true;
        break;
      case data.reservationType === 'CANCELED':
        this.userForm.disable();
        this.disabledForm = true;
        break;
      case data.source === 'CREATE_WITH':
        this.disabledForm = true;
        break;
      case data.source === 'OTHERS':
        this.disabledForm = true;
        break;
    }
  }

  getOfferByRoomType(id: string): void {
    if (id)
      this.$subscription.add(
        this.manageReservationService
          .getOfferByRoomType(this.entityId, id)
          .subscribe(
            (response) => {
              this.offersList = new OfferList().deserialize(response);
              if (this.userForm.get('offerId').value) {
                this.selectedOffer = this.offersList.records.filter(
                  (item) => item.id === this.userForm.get('offerId').value
                )[0];
              }
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
          const menuList = items.records;
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

    const data = {
      fromDate: this.reservationInfoControls.dateAndTime.value,
      toDate: this.reservationInfoControls.dateAndTime.value,
      adultCount: this.orderInfoControls.numberOfAdults.value,
      items: this.menuItemsControls.map((item) => ({
        itemId: item.get('menuItems').value,
        unit: item.get('quantity')?.value ?? 0,
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
          (error) => {}
        )
    );
  }

  get inputControl() {
    return this.userForm.controls as Record<
      keyof ReservationForm,
      AbstractControl
    >;
  }

  get reservationInfoControls() {
    return (this.userForm.get('reservationInformation') as FormGroup)
      .controls as Record<
      keyof ReservationForm['reservationInformation'],
      AbstractControl
    >;
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

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
