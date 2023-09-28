import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OutletBaseComponent } from '../outlet-base.components';
import { OutletService } from '../../services/outlet.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Location } from '@angular/common';
import { OutletFormService } from '../../services/outlet-form.service';

@Component({
  selector: 'hospitality-bot-import-service',
  templateUrl: './import-service.component.html',
  styleUrls: ['./import-service.component.scss'],
})
export class ImportServiceComponent extends OutletBaseComponent
  implements OnInit {
  loading = false;
  constructor(
    router: Router,
    route: ActivatedRoute,
    private outletService: OutletService,
    private outletFormService: OutletFormService,
    private location: Location,
    private snackbarService: SnackBarService
  ) {
    super(router, route);
  }

  ngOnInit(): void {
    this.initRoutes('importService');
  }

  saveForm(serviceData) {
    this.outletFormService.initOutletFormData({ packageCode: serviceData.packageCode }, true);
    //pass active service ids + selected service ids in import service so that selected services can be marked as active
    this.outletService
      .updateOutlet(this.outletId, serviceData.serviceId)
      .subscribe(this.handleSuccess, this.handelError);
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
    //to handle redirection in case of hotel and outlet
    if (this.entityId) {
      this.router.navigate(
        [
          `/pages/settings/business-info/brand/${this.brandId}/hotel/${this.entityId}/outlet/${this.outletId}`,
        ],
        {
          relativeTo: this.route,
        }
      );
      return;
    }
    this.router.navigate(
      [
        `/pages/settings/business-info/brand/${this.brandId}/outlet/${this.outletId}`,
      ],
      {
        relativeTo: this.route,
      }
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
