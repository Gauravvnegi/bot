import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  NavRouteOptions,
  AdminUtilityService,
  Option,
} from '@hospitality-bot/admin/shared';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import { Subscription } from 'rxjs';
import {
  editModeStatusOptions,
  spaFields,
  statusOptions,
} from '../../constants/reservation';
import { manageReservationRoutes } from '../../constants/routes';
import {
  OfferList,
  OfferData,
  SummaryData,
  BookingInfo,
  OutletForm,
} from '../../models/reservations.model';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { ReservationForm } from '../../constants/form';
import { FormService } from '../../services/form.service';
import { ServiceList } from '../../models/forms.model';
import {
  LibrarySearchItem,
  SelectedEntity,
  ServicesTypeValue,
} from '../../types/reservation.type';
import { ServiceListResponse } from '../../types/response.type';
import { LibraryService } from '@hospitality-bot/admin/library';

@Component({
  selector: 'hospitality-bot-spa-reservation',
  templateUrl: './spa-reservation.component.html',
  styleUrls: ['./spa-reservation.component.scss', '../reservation.styles.scss'],
})
export class SpaReservationComponent implements OnInit {
  userForm: FormGroup;
  spaBookingInfo: FormArray;
  fields: IteratorField[];

  outletId: string;
  entityId: string;
  reservationId: string;

  statusOptions: Option[] = [];

  offersList: OfferList;
  selectedOffer: OfferData;
  summaryData: SummaryData;

  // loading = false;
  formValueChanges = false;
  disabledForm = false;

  date: string;
  time: string;

  /* service options variable */
  servicesOffSet = 0;
  loadingResults = false;
  noMoreResults = false;
  services: (Option & { price: number })[] = [];

  deductedAmount = 0;
  bookingType = 'SPA';

  itemInfo = 'For 1 Adult';

  pageTitle: string;
  routes: NavRouteOptions = [];

  @Input() selectedEntity: SelectedEntity;

  $subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private manageReservationService: ManageReservationService,
    protected activatedRoute: ActivatedRoute,
    private formService: FormService,
    private libraryService: LibraryService,
    private router: Router
  ) {
    this.initForm();
    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id');

    const { navRoutes, title } = manageReservationRoutes[
      this.reservationId ? 'editReservation' : 'addReservation'
    ];
    this.routes = navRoutes;
    this.pageTitle = title;
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.outletId = this.selectedEntity.id;
    this.fields = spaFields;
    this.initOptions();
    this.getReservationId();
    this.getServices();
  }

  initOptions() {
    // Update Fields for search in select component
    this.fields[0] = {
      ...this.fields[0],
      loading: this.loadingResults,
      noMoreResults: this.noMoreResults,
      create: this.create.bind(this),
      searchResults: this.searchResults.bind(this),
      loadMoreResults: this.loadingMoreResults.bind(this),
    };
  }

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    this.spaBookingInfo = this.fb.array([]);

    this.userForm = this.fb.group({
      reservationInformation: this.fb.group({
        dateAndTime: ['', Validators.required],
        status: ['', Validators.required],
        source: ['', Validators.required],
        sourceName: ['', [Validators.required, Validators.maxLength(60)]],
        marketSegment: ['', Validators.required],
      }),
      bookingInformation: this.fb.group({
        numberOfAdults: [1, [Validators.required, Validators.min(1)]],
        spaItems: this.spaBookingInfo,
      }),
      offerId: [''],
    });
  }

  /**
   * @function listenForFormChanges Listen for form values changes.
   */
  listenForFormChanges(): void {
    this.formService.reservationDateAndTime.subscribe((res) => {
      if (res) this.setDateAndTime(res);
    });
    this.userForm
      .get('bookingInformation.numberOfAdults')
      .valueChanges.subscribe((res) => {
        this.itemInfo = `For ${res} Adult`;
      });
  }

  /**
   * @function onItemsAdded To keep track of the current index in the form array.
   * @param index current index
   */
  onItemsAdded(index: number): void {
    this.spaItemsControls[index]
      .get('serviceName')
      .valueChanges.subscribe((res) => {
        const selectedService = this.services.find(
          (service) => service.value === res
        );
        this.spaItemsControls[index]
          .get('price')
          .setValue(selectedService.price);
        this.spaItemsControls[index].get('quantity').setValue(1);
        // this.formService.discountedPrice.next(selectedService.price);
        this.getSummaryData();
      });
    this.spaItemsControls[index]
      .get('quantity')
      .valueChanges.subscribe((res) => {
        this.getSummaryData();
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
    this.date = date;
    this.time = time;
  }

  getReservationId(): void {
    if (this.reservationId) {
      this.statusOptions = [
        ...statusOptions,
        { label: 'In Session', value: 'INSESSION' },
      ];
      this.getReservationDetails();
    } else {
      this.statusOptions = [
        ...editModeStatusOptions,
        { label: 'In Session', value: 'INSESSION' },
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
            this.userForm.patchValue(data);
            this.summaryData = new SummaryData().deserialize(response);
            this.setFormDisability(data.reservationInformation);
            // if (data.offerId)
            //   this.getOfferByRoomType(
            //     this.userForm.get('roomInformation.roomTypeId').value
            //   );
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
    const defaultProps = [
      {
        type: 'OUTLET',
      },
    ];
    const config = {
      params: this.adminUtilityService.makeQueryParams(defaultProps),
    };
    const data = {
      fromDate: this.reservationInfoControls.dateAndTime.value,
      toDate: this.reservationInfoControls.dateAndTime.value,
      adultCount: this.userForm.get('bookingInformation.numberOfAdults').value,
      items: this.spaItemsControls.map((item) => ({
        itemId: item.get('serviceName').value,
        unit: item.get('quantity')?.value ?? 0,
        amount: item.get('price').value,
      })),
      outletType: 'SPA',
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

  // Service

  /**
   * @function getServices to get services options
   */
  getServices() {
    this.loadingResults = true;
    this.$subscription.add(
      this.libraryService
        .getLibraryItems<ServiceListResponse>(this.entityId, {
          params: `?type=SERVICE&offset=${this.servicesOffSet}&limit=10&status=true&serviceType=${ServicesTypeValue.PAID}`,
        })
        .subscribe(
          (res) => {
            const data = new ServiceList()
              .deserialize(res)
              .paidService.map((item) => {
                let price = item.amount;
                return {
                  label: `${item.name} ${
                    price ? `[${item.currency} ${price}]` : ''
                  }`,
                  value: item.id,
                  price,
                };
              });

            this.services = [...this.services, ...data];
            this.fields[0].options = this.services;
            this.noMoreResults = data.length < 10;
            this.loadingResults = false;
          },
          this.handleError,
          this.handleFinal
        )
    );
  }

  /**
   * @function searchResults To search services
   * @param text search text
   */
  searchResults(text: string) {
    if (text) {
      this.loadingResults = true;
      this.libraryService
        .searchLibraryItem(this.entityId, {
          params: `?key=${text}&type=${LibrarySearchItem.SERVICE}`,
        })
        .subscribe(
          (res) => {
            this.loadingResults = false;
            const data = res && res[LibrarySearchItem.SERVICE];
            this.services =
              data
                ?.filter((item) => item.active)
                .map((item) => {
                  let price = item.rate;
                  return {
                    label: `${item.name} ${
                      price ? `[${item.currency} ${price}]` : ''
                    }`,
                    value: item.id,
                    price,
                  };
                }) ?? [];
            this.fields[0].options = this.services;
          },
          this.handleError,
          this.handleFinal
        );
    } else {
      this.servicesOffSet = 0;
      this.services = [];
      this.getServices();
    }
  }

  /**
   * @function loadMoreResults load more services options
   */
  loadingMoreResults() {
    this.servicesOffSet = this.servicesOffSet + 10;
    this.getServices();
  }

  /**
   * @function create Reroute to create service or create package category
   */
  create() {
    this.router.navigate([`/pages/library/services/create-service`]);
  }

  get reservationInfoControls() {
    return (this.userForm.get('reservationInformation') as FormGroup)
      .controls as Record<
      keyof ReservationForm['reservationInformation'],
      AbstractControl
    >;
  }

  get spaItemsControls() {
    return ((this.userForm.get('bookingInformation') as FormGroup).get(
      'spaItems'
    ) as FormArray).controls;
  }

  /**
   * @function handleError to show the error
   * @param param network error
   */
  handleError = ({ error }): void => {
    this.loadingResults = false;
  };

  handleFinal = () => {
    this.loadingResults = false;
  };

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
