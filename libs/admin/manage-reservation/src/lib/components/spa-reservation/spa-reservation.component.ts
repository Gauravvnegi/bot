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
import { editModeStatusOptions, spaFields } from '../../constants/reservation';
import { SummaryData, OutletForm } from '../../models/reservations.model';
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
import { convertToTitleCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';

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
    this.listenForFormChanges();
    this.initFormData();
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
        sourceName: [''],
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
    this.$subscription.add(
      this.formService.reservationDateAndTime.subscribe((res) => {
        if (res) this.setDateAndTime(res);
      })
    );
    this.inputControls.bookingInformation.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((res) => {
        if (res.spaItems[0].serviceName === null) {
          this.summaryData = new SummaryData().deserialize();
          return;
        }
        if (res.spaItems[res.spaItems?.length - 1].serviceName.length)
          this.getSummaryData();
      });
  }

  initFormData() {
    this.$subscription.add(
      this.formService.reservationForm
        .pipe(debounceTime(500))
        .subscribe((res) => {
          if (res) {
            const {
              bookingInformation: { spaItems, ...spaInfo },
              ...formData
            } = res;
            if (spaItems[0].serviceName) this.spaItemsValues = spaItems;
            this.userForm.patchValue({
              bookingInformation: spaInfo,
              ...formData,
            });
          }
        })
    );
  }

  /**
   * @function onItemsAdded To keep track of the current index in the form array.
   * @param index current index
   */
  onItemsAdded(index: number): void {
    this.spaItemsControls[index]
      .get('serviceName')
      .valueChanges.pipe(debounceTime(500))
      .subscribe((res) => {
        if (res) {
          const selectedService = this.services.find(
            (service) => service.value === res
          );
          this.spaItemsControls[index]
            .get('amount')
            .setValue(selectedService?.price);

          // Do not patch in edit mode
          if (this.spaItemsValues.length < index + 1)
            this.spaItemsControls[index].get('unit').setValue(1);
        }
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
      this.getReservationDetails();
    } else {
      this.statusOptions = [
        ...editModeStatusOptions,
        { label: 'In Session', value: 'INSESSION' },
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
              bookingInformation: { spaItems, ...spaInfo },
              guestInformation,
              nextStates,
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

            if (nextStates)
              this.statusOptions = nextStates.map((item) => ({
                label: convertToTitleCase(item),
                value: item,
              }));

            this.formValueChanges = true;
            this.spaItemsValues = spaItems;
            this.formService.guestInformation.next(guestInformation);

            this.userForm.patchValue({
              bookingInformation: spaInfo,
              reservationInformation: reservationInfo,
              ...formData,
            });
          },
          (error) => {}
        )
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

            if (this.formValueChanges) {
              this.setFormDisability();
              this.formValueChanges = false;
            }
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
        .getLibraryItems<ServiceListResponse>(this.outletId, {
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
        .searchLibraryItem(this.outletId, {
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
    this.formService.reservationForm.next(this.userForm.getRawValue());
    this.router.navigate([`/pages/library/services/create-service`]);
  }

  get spaItemsControls() {
    return ((this.userForm.get('bookingInformation') as FormGroup).get(
      'spaItems'
    ) as FormArray).controls;
  }

  get spaControls() {
    return this.userForm.get('bookingInformation') as FormGroup;
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
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
