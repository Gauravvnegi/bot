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
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { manageReservationRoutes } from '../../constants/routes';
import {
  OfferList,
  OfferData,
  SummaryData,
  ReservationFormData,
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
import { MenuItemList } from '../../models/forms.model';
import { SelectedEntity } from '../../types/reservation.type';
import { OutletItems } from '../../constants/reservation-table';

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
  fields: IteratorField[];

  entityId: string;
  reservationId: string;
  outletId: string;

  reservationTypes: Option[] = [];
  statusOptions: Option[] = [];

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
  bookingType = 'RESTAURANT';

  pageTitle: string;
  routes: NavRouteOptions = [];

  /* menu options variable */
  loadingResults = false;
  menuItems: Option[] = [];
  outletItems: OutletItems[] = [];
  // summaryInfo: SummaryInfo;
  tableNumber = '';
  numberOfAdults = '';
  price = 0;

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
    this.initOptions();
    this.getReservationId();
  }

  initDetails() {
    this.entityId = this.globalFilterService.entityId;
    this.expandAccordion = this.formSerivce.enableAccordion;
    if (this.expandAccordion) {
      this.formSerivce.enableAccordion = false;
    }
    // this.setDateAndTime(this.reservationInfoControls.dateAndTime.value);
  }

  initOptions() {
    // Update fields for search in select component
    this.fields[0] = {
      ...this.fields[0],
      loading: this.loadingResults,
      searchResults: this.searchResults.bind(this),
    };
    this.reservationTypes = restaurantReservationTypes;
  }

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    this.menuItemsArray = this.fb.array([]);

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
        numberOfAdults: [''],
        menuItems: this.menuItemsArray,
        kotInstructions: [''],
      }),
      offerId: [''],
    });
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
        this.menuItemsControls[index]
          .get('price')
          .setValue(selectedMenuItem.price);
        // this.formService.discountedPrice.next(selectedService.price);
      });
    // this.orderInfoControls[index].valueChanges.subscribe((res) => {
    //   this.getSummaryData();
    // });
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
            const data = new ReservationFormData().deserialize(response);
            this.userForm.patchValue(data);
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
        { type: 'RESTAURANT' },
      ]),
    };

    const data = {
      fromDate: this.reservationInfoControls.dateAndTime.value,
      toDate: this.reservationInfoControls.dateAndTime.value,
      adultCount: this.orderInfoControls.numberOfAdults,
      items: this.menuItemsControls.map((item) => ({
        itemId: item.get('serviceName').value,
        unit: item.get('quantity')?.value ?? 0,
        price: item.get('price').value,
      })),
      outletType: 'SPA',
    };
    if (this.userForm.get('roomInformation.roomTypeId')?.value) {
      this.$subscription.add(
        this.manageReservationService
          .getSummaryData(this.outletId, data, config)
          .subscribe(
            (res) => {
              this.summaryData = new SummaryData()?.deserialize(res);
              this.userForm
                .get('roomInformation')
                .patchValue(this.summaryData, { emitEvent: false });
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
  }

  /**
   * @function searchServices To search services
   * @param text search text
   */
  searchResults(text: string) {
    if (text) {
      this.loadingResults = true;
      this.outletService
        .searchItem(this.outletId, {
          params: `?key=${text}&type=${OutletItems.MENU_ITEM}`,
        })
        .subscribe((res) => {
          this.loadingResults = false;
          this.menuItems = res
            ? this.outletItems.reduce((prev, curr) => {
                let currentList = res[curr] as Option[];
                let descriptiveType: string = curr;

                let data =
                  currentList.map((item) => {
                    return {
                      label: item.name,
                      value: item.id,
                    };
                  }) ?? [];
                return [...prev, ...data];
              }, [])
            : [];
          this.fields[0].options = this.menuItems;
        });
    }
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
