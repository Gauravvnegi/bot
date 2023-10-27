import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OutletBaseComponent } from '../outlet-base.components';
import { OutletService } from '../../services/outlet.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Location } from '@angular/common';
import { OutletFormService } from '../../services/outlet-form.service';
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';
import { ModuleNames } from '@hospitality-bot/admin/shared';

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
    private snackbarService: SnackBarService,
    protected routesConfigService: RoutesConfigService
  ) {
    super(router, route, routesConfigService);
  }

  ngOnInit(): void {
    if (!this.outletFormService.outletFormState) this.location.back();
    this.initRoutes('importService');
  }

  saveForm(data: { serviceIds: string[]; packageCode: string[] }) {
    this.outletFormService.initOutletFormData(
      { packageCode: data.packageCode },
      true
    );
    //pass active service ids + selected service ids in import service so that selected services can be marked as active
    this.outletService
      .updateOutlet(this.outletId, { serviceIds: data.serviceIds })
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
      this.routesConfigService.navigate({
        subModuleName: ModuleNames.BUSINESS_INFO,
        additionalPath: `/brand/${this.brandId}/hotel/${this.entityId}/outlet/${this.outletId}`,
      });
      return;
    }
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.BUSINESS_INFO,
      additionalPath: `/brand/${this.brandId}/outlet/${this.outletId}`,
    });
  };

  /**
   * @function handelFinal To handel loading
   * @param param0  network error
   */
  handelError = ({ error }): void => {
    this.loading = false;
  };
}
