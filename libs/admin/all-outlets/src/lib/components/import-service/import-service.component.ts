import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OutletBaseComponent } from '../outlet-base.components';
import { OutletService } from '../../services/outlet.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Location } from '@angular/common';

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
    private OutletService: OutletService,
    private location: Location,
    private snackbarService: SnackBarService
  ) {
    super(router, route);
  }

  ngOnInit(): void {
    this.initComponent('importService');
  }

  saveForm(serviceData) {
    serviceData.serviceIds = [
      ...serviceData.serviceIds,
      //outlet service ids
    ];

    this.OutletService.updateOutlet(this.outletId, serviceData).subscribe(
      this.handleSuccess,
      this.handelError
    );
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
    this.location.back();
  };

  /**
   * @function handelFinal To handel loading
   * @param param0  network error
   */
  handelError = ({ error }): void => {
    this.loading = false;
  };
}
