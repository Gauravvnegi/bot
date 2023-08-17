import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  Option,
  EntityType,
  EntitySubType,
} from '@hospitality-bot/admin/shared';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import {
  editModeStatusOptions,
  spaFields,
  statusOptions,
} from '../../constants/reservation';
import {
  OfferList,
  OfferData,
  SummaryData,
  BookingInfo,
  OutletForm,
} from '../../models/reservations.model';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { FormService } from '../../services/form.service';
import {
  LibrarySearchItem,
  LibraryService,
} from '@hospitality-bot/admin/library';
import { debounceTime } from 'rxjs/operators';
import { ReservationSummary } from '../../types/forms.types';
import { ServiceListResponse } from 'libs/admin/services/src/lib/types/response';
import { ServiceList } from 'libs/admin/services/src/lib/models/services.model';
import { ServicesTypeValue } from 'libs/admin/room/src/lib/constant/form';
import { BaseReservationComponent } from '../base-reservation.component';
import { ReservationType } from '../../constants/reservation-table';

@Component({
  selector: 'hospitality-bot-spa-reservation',
  templateUrl: './spa-reservation.component.html',
  styleUrls: ['./spa-reservation.component.scss', '../reservation.styles.scss'],
})
export class SpaReservationComponent extends BaseReservationComponent
  implements OnInit {
  spaBookingInfo: FormArray;
  fields: IteratorField[];

  statusOptions: Option[] = [];
  spaItemsValues = [];

  date: string;
  time: string;

  /* service options variable */
  servicesOffSet = 0;
  loadingResults = false;
  noMoreResults = false;
  services: (Option & { price: number })[] = [];

  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    protected globalFilterService: GlobalFilterService,
    private manageReservationService: ManageReservationService,
    protected activatedRoute: ActivatedRoute,
    private formService: FormService,
    private libraryService: LibraryService,
    private router: Router
  ) {
    super(globalFilterService, activatedRoute);
  }

  ngOnInit(): void {
    this.initForm();
    this.initDetails();
    this.getReservationId();
    this.getServices();
  }

  initDetails() {
    this.bookingType = EntitySubType.SPA;
    this.outletId = this.selectedEntity.id;
    this.fields = spaFields;
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
      .valueChanges.pipe(debounceTime(1000))
      .subscribe((res) => {
        this.getSummaryData();
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
          .get('amount')
          .setValue(selectedService?.price);
        this.spaItemsControls[index].get('unit').setValue(1);
        this.getSummaryData();
      });
    this.spaItemsControls[index]
      .get('unit')
      .valueChanges.pipe(debounceTime(1000))
      .subscribe((res) => this.getSummaryData());
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

            const {
              bookingInformation: { spaItems, ...spaInfo },
              ...formData
            } = data;

            this.spaItemsValues = spaItems;
            this.userForm.patchValue({
              bookingInformation: spaInfo,
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
      adultCount: this.userForm.get('bookingInformation.numberOfAdults').value,
      items: this.spaItemsControls.map((item) => ({
        itemId: item.get('serviceName').value,
        unit: item.get('unit')?.value ?? 0,
        amount: item.get('amount').value,
      })),
      outletType: EntitySubType.SPA,
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
}
