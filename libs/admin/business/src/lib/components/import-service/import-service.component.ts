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
import { HotelFormDataServcie } from '../../services/hotel-form.service';

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
  hotelId: string;
  $subscription = new Subscription();
  useForm: FormGroup;
  searchForm: FormGroup;
  loading: boolean;
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
    private hotelFormDataServcie: HotelFormDataServcie
  ) {
    this.router.events.subscribe(
      ({ snapshot }: { snapshot: ActivatedRouteSnapshot }) => {
        const hotelId = snapshot?.params['hotelId'];
        const brandId = snapshot?.params['brandId'];
        if (hotelId) this.hotelId = hotelId;
        if (brandId) this.brandId = brandId;
      }
    );
  }

  ngOnInit(): void {
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
          this.compServices = new Services().deserialize(res.service).services;
          this.filteredServices = this.compServices;

          // if (this.businessService.tempServiceIds.length) {
          //   this.filteredServices = this.compServices.filter(
          //     (service) =>
          //       !this.businessService.tempServiceIds.includes(service.id)
          //   );
          // } else {
          //   this.filteredServices = this.compServices;
          // }
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
      this.hotelId ? 'editImportServices' : 'importServices'
    ];
    this.pageTitle = title;
    this.navRoutes = navRoutes;
    this.navRoutes[2].link.replace('brandId', this.brandId);
    this.navRoutes[2].isDisabled = false;
    if (this.hotelId) {
      this.navRoutes[3].link = `/pages/settings/business-info/brand/${this.brandId}/hotel/${this.hotelId}`;
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
    // if (!this.hotelId) {
    const { serviceIds } = this.useForm.getRawValue();

    this.hotelFormDataServcie.hotelInfoFormData.serviceIds.push(...serviceIds);

    const servicesToAdd = this.compServices.filter((service) =>
      serviceIds.includes(service.id)
    );
    this.hotelFormDataServcie.hotelInfoFormData.services.push(...servicesToAdd);

    this.hotelFormDataServcie.setActiveServiceIds(serviceIds);

    if (this.hotelId)
      this.businessService
        .updateHotel(this.hotelId, { serviceIds: serviceIds })
        .subscribe((_res) => {});

    this.handleSuccess();
    this.location.back();
    // } else {
    //   this.$subscription.add(
    //     this.businessService.updateHotel(this.hotelId, data).subscribe(
    //       (res) => {
    //         this.businessService.hotelFormState = false;
    //         this.location.back();
    //       },
    //       this.handelError,
    //       this.handleSuccess
    //     )
    //   );
    // }
  }
  resetForm() {}

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
