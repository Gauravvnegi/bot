import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavRouteOptions } from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { Service, Services } from '../../models/hotel.models';
import { BusinessService } from '../../services/business.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { businessRoute } from '../../constant/routes';
import { HotelFormDataService } from '../../services/hotel-form.service';

@Component({
  selector: 'hospitality-bot-import-service',
  templateUrl: './import-service.component.html',
  styleUrls: [
    './import-service.component.scss',
    '../services/services.component.scss',
  ],
})
export class ImportServiceComponent implements OnInit {
  noRecordAction = [];
  brandId: string;
  entityId: string;
  $subscription = new Subscription();
  useForm: FormGroup;
  searchForm: FormGroup;
  loading: boolean = false;
  pageTitle = 'Import Services';
  navRoutes: NavRouteOptions = [];
  compServices: Service[] = [];
  filteredServices: any[] = [];

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    private businessService: BusinessService,
    private router: Router,
    private location: Location,
    private hotelFormDataService: HotelFormDataService
  ) {
    this.router.events.subscribe(
      ({ snapshot }: { snapshot: ActivatedRouteSnapshot }) => {
        const entityId = snapshot?.params['entityId'];
        const brandId = snapshot?.params['brandId'];
        if (entityId) this.entityId = entityId;
        if (brandId) this.brandId = brandId;
      }
    );
  }

  ngOnInit(): void {
    if (!this.hotelFormDataService.hotelFormState) {
      this.location.back();
      return;
    }
    this.initForm();
    this.getServices();
    this.registerSearch();
  }

  initForm() {
    this.useForm = this.fb.group({
      serviceIds: [[]],
    });

    this.searchForm = this.fb.group({
      searchText: [''],
    });

    this.manageRoutes();
  }

  /**
   * @function getServices to get amenities (paid and services)
   * @param serviceType
   */
  getServices() {
    this.loading = true;
    this.$subscription.add(
      this.businessService.getServices().subscribe(
        (res) => {
          const allServices = this.hotelFormDataService.hotelInfoFormData
            .allServices;

          this.compServices = new Services()
            .deserialize(res.service)
            .services.filter((service) => !allServices.includes(service.id));

          this.filteredServices = this.compServices;
        },
        (error) => {
          this.snackbarService.openSnackBarAsText(error.error.message);
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      )
    );
  }

  manageRoutes() {
    const { navRoutes, title } = businessRoute[
      this.entityId ? 'editImportServices' : 'importServices'
    ];
    this.pageTitle = title;
    this.navRoutes = navRoutes;
    this.navRoutes[2].link.replace('brandId', this.brandId);
    this.navRoutes[2].isDisabled = false;
    if (this.entityId) {
      this.navRoutes[3].link = `/pages/settings/business-info/brand/${this.brandId}/hotel/${this.entityId}`;
      this.navRoutes[3].isDisabled = false;
    } else {
      this.navRoutes[3].link = `/pages/settings/business-info/brand/${this.brandId}/hotel`;
      this.navRoutes[3].isDisabled = false;
    }
  }

  /**
   * @function searchServices
   */
  registerSearch() {
    this.searchForm.get('searchText').valueChanges.subscribe((res) => {
      if (res) {
        this.filteredServices = this.compServices.filter((service) =>
          service.name.toLowerCase().includes(res.toLowerCase())
        );
      } else {
        this.filteredServices = this.compServices;
      }
    });
  }

  saveForm() {
    let { serviceIds } = this.useForm.getRawValue();

    let servicesToAdd = this.compServices.filter((service) => {
      return serviceIds.includes(service.id);
    });

    servicesToAdd = [
      ...this.hotelFormDataService.hotelInfoFormData.services,
      ...servicesToAdd,
    ];

    serviceIds = [
      ...this.hotelFormDataService.hotelInfoFormData.serviceIds,
      ...serviceIds,
    ];

    this.hotelFormDataService.initHotelInfoFormData(
      { serviceIds: serviceIds, services: servicesToAdd },
      true
    );

    if (this.entityId)
      this.businessService
        .updateHotel(this.entityId, { serviceIds: serviceIds })
        .subscribe((_res) => {});

    this.location.back();
  }

  resetForm() {
    this.useForm.reset();
  }

  /**
   * @function handleSuccess To show success message
   * @returns void
   */
  handleSuccess = () => {
    this.snackbarService.openSnackBarAsText(
      `Service Imported Successfully`,
      '',
      { panelClass: 'success' }
    );
  };

  /**
   * @function handelFinal To handel loading
   * @param param0  network error
   */
  handelError = ({ error }): void => {
    this.loading = false;
  };
}
