import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  LibrarySearchItem,
  ServiceTypeOptionValue,
} from '@hospitality-bot/admin/library';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { DiscountType, NavRouteOptions, Option } from 'libs/admin/shared/src';
import { ConfigService } from 'libs/admin/shared/src/lib/services/config.service';
import { Subscription } from 'rxjs';
import routes from '../../constant/routes';
import { OffersServices } from '../../services/offers.service';
import { OfferData, OfferFormData, OffersOnEntity } from '../../types/offers';
import { OfferResponse, SearchResult } from '../../types/response';

@Component({
  selector: 'hospitality-bot-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.scss'],
})
export class CreateOfferComponent implements OnInit {
  hotelId: string;
  offerId: string;
  packageCode: string = '# will be auto generated';

  useForm: FormGroup;

  routes: NavRouteOptions = [
    { label: 'Library', link: './' },
    { label: 'Offers', link: '/pages/library/offers' },
    { label: 'Create Offer', link: './' },
  ];

  loading = false;
  searchItems: LibrarySearchItem[];
  subscription$ = new Subscription();

  /* Dropdown options */
  libraryItems: Option[] = [];
  discount: Option[];
  currency = 'INR';

  /* min max date */
  startMinDate = new Date();
  endMinDate = new Date();

  selectedServicePrice: Record<string, number> = {};

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private globalService: GlobalFilterService,
    private offerService: OffersServices,
    private snackbarService: SnackBarService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.offerId = this.route.snapshot.paramMap.get('id');
    this.searchItems = [
      LibrarySearchItem.SERVICE,
      LibrarySearchItem.PACKAGE,
      LibrarySearchItem.ROOM_TYPE,
    ];
  }

  ngOnInit(): void {
    this.hotelId = this.globalService.hotelId;
    this.initUseForm();
    this.initOptionsConfig();
  }

  initUseForm() {
    this.useForm = this.fb.group({
      active: [true],
      name: ['', [Validators.required]],
      libraryItems: [[], [Validators.required]],
      imageUrl: ['', [Validators.required]],
      description: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      rate: [''],
      discountType: ['', [Validators.required]],
      discountValue: ['', [Validators.required, Validators.min(1)]],
      discountedPrice: [''],
    });

    this.initFormSubscription();

    if (this.offerId) this.getOfferById();
  }

  /**
   * @function initFormSubscription To listen to changes in form
   */
  initFormSubscription() {
    const {
      rate,
      discountType,
      discountValue,
      startDate,
      endDate,
    } = this.useForm.controls;

    this.registerServicesSelectedChange();

    const setDiscountValueAndErrors = () => {
      const price = +rate.value;
      const discount = +(discountValue.value ?? 0);
      const type = discountType.value;

      if (price && type)
        this.useForm.patchValue({
          discountedPrice:
            type === 'NUMBER'
              ? `${price - discount}`
              : `${
                  Math.round(
                    (price - (price * discount) / 100 + Number.EPSILON) * 100
                  ) / 100
                }`,
        });

      if (type === 'NUMBER' && discount > price) {
        return 'isNumError';
      }

      if (type === 'PERCENTAGE' && discount > 100) {
        return 'isPercentError';
      }
    };

    /**
     * @function discountSubscription To handle changes in discount value
     */
    const discountSubscription = () => {
      if (discountValue.value > 0) discountValue.setErrors(null);
      const error = setDiscountValueAndErrors();
      if (error === 'isNumError') {
        discountValue.setErrors({ isDiscountMore: true });
      }
      if (error === 'isPercentError') {
        discountValue.setErrors({ moreThan100: true });
      }
    };

    /* Discount Subscription */
    discountValue.valueChanges.subscribe(discountSubscription);
    discountType.valueChanges.subscribe(discountSubscription);

    /* Date Subscription */
    startDate.valueChanges.subscribe((res) => {
      this.endMinDate = new Date(res);
      if (endDate.value && startDate.value > endDate.value) {
        endDate.setValue(startDate.value);
      }
    });
  }

  /**
   * @function registerServicesSelectedChange To handle rate value [Base price will be based on the service selected]
   */
  registerServicesSelectedChange() {
    this.useForm.get('libraryItems').valueChanges.subscribe((res) => {
      const totalPrice = res?.reduce((prev, curr) => {
        if (!this.selectedServicePrice[curr.value]) {
          this.selectedServicePrice = {
            ...this.selectedServicePrice,
            [curr.value]: this.libraryItems.find(
              (item) => item.value === curr.value
            )?.price,
          };
        }
        return prev + this.selectedServicePrice[curr.value];
      }, 0);
      this.useForm.get('rate').setValue(totalPrice);
    });
  }

  searchOptions(text: string) {
    if (text) {
      this.loading = true;
      this.offerService
        .searchLibraryItem(this.hotelId, {
          params: `?key=${text}&type=${this.searchItems.join(',')}`,
        })
        .subscribe((res) => {
          this.loading = false;

          // refactor (remove active == false)
          this.libraryItems = res
            ? this.searchItems.reduce((prev, curr) => {
                let currentList = res[curr] as SearchResult[];

                let descriptiveType: string = curr;

                /** If services than only show paid only */
                if (curr === LibrarySearchItem.SERVICE && currentList?.length) {
                  currentList = currentList?.filter(
                    (item) => item.type === ServiceTypeOptionValue.PAID
                  );
                }

                let data =
                  currentList?.map((item) => {
                    let price =
                      item.rate ?? item.discountedPrice ?? item.originalPrice;
                    return {
                      label: `${item.name} ${
                        price ? `[${item.currency} ${price}]` : ''
                      }`,
                      value: item.id,
                      type: descriptiveType,
                      price: price,
                    };
                  }) ?? [];

                return [...prev, ...data];
              }, [])
            : [];
        }, this.handleError);
    }
  }

  initOptionsConfig() {
    this.subscription$.add(
      this.configService.$config.subscribe((res) => {
        this.discount = res?.roomDiscountConfig?.map(({ value }) => ({
          label: DiscountType[value],
          value,
        }));
      })
    );
  }

  handleSubmit() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }

    const {
      libraryItems,
      ...restFormData
    } = this.useForm.getRawValue() as OfferFormData;

    const libraryIds: OffersOnEntity = libraryItems.reduce(
      (prev, curr) => {
        const { value, type } = curr;
        switch (type) {
          case LibrarySearchItem.SERVICE:
            prev.serviceIds.push(value);
          case LibrarySearchItem.PACKAGE:
            prev.packageIds.push(value);
          case LibrarySearchItem.ROOM_TYPE:
            prev.roomTypeIds.push(value);
        }
        return prev;
      },
      {
        serviceIds: [],
        packageIds: [],
        roomTypeIds: [],
      }
    );

    if (!!this.offerId) {
      this.subscription$.add(
        this.offerService
          .updateLibraryItem<OfferData, OfferResponse>(
            this.hotelId,
            this.offerId,
            {
              ...restFormData,
              ...libraryIds,
              type: 'OFFER',
              source: 1,
            },
            { params: '?type=OFFER' }
          )
          .subscribe(this.handleSuccess, this.handleError, this.handleFinal)
      );
    } else {
      this.subscription$.add(
        this.offerService
          .createLibraryItem<OfferData, OfferResponse>(this.hotelId, {
            ...restFormData,
            ...libraryIds,
            type: 'OFFER',
            source: 1,
          })
          .subscribe(this.handleSuccess, this.handleError, this.handleFinal)
      );
    }
  }

  getOfferById() {
    this.subscription$.add(
      this.offerService
        .getLibraryItemById<OfferResponse>(this.hotelId, this.offerId, {
          params: '?type=OFFER',
        })
        .subscribe(
          (res) => {
            this.routes[2].label = 'Edit Offer';
            let { packageCode, subPackages, ...restData } = res;

            const data: OfferFormData = {
              ...restData,
              libraryItems: subPackages?.map((item) => {
                let price =
                  item.rate ?? item.discountedPrice ?? item.originalPrice;
                return {
                  label: `${item.name} ${
                    price ? `[${item.currency} ${price}]` : ''
                  }`,
                  value: item.id,
                  price: item.rate,
                  type: item.type,
                };
              }),
            };
            this.useForm.patchValue(data);
            this.packageCode = packageCode;
          },
          this.handleError,
          this.handleFinal
        )
    );
  }

  /**
   * @function handleSuccess to handle network success
   */
  handleSuccess = () => {
    this.loading = false;
    this.snackbarService.openSnackBarAsText(
      `Offer is ${!this.offerId ? 'created' : 'edited'} successfully`,
      '',
      { panelClass: 'success' }
    );
    this.router.navigate([`pages/library/${routes.offers}`]);
  };

  /**
   * @function handleError to show the error
   * @param param network error
   */
  handleError = ({ error }): void => {
    this.loading = false;
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

  /**
   * @function handleFinal
   */
  handleFinal = () => {
    this.loading = false;
  };

  /**
   * Unsubscribe when component is getting removed
   */
  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
