import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { NavRouteOptions } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { RoomService } from '../../services/room.service';
import { error } from 'console';

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
  compServices: any[] = [];
  filteredServices: any[] = [];
  allServices;
  navRoutes: NavRouteOptions = [
    { label: 'efrontdesk', link: './' },
    { label: 'Rooms', link: '/pages/efrontdesk/room' },
    { label: 'Add Room Type', link: '/pages/efrontdesk/room/add-room-type' },
    { label: 'Import Services', link: './' },
  ];

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    private roomService: RoomService,
    private router: Router,
    private location: Location,
    private globalService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    if (!this.roomService.selectedService) {
      this.location.back();
      return;
    }
    this.allServices = this.roomService.roomTypeFormData.complimentaryAmenities;
    this.entityId = this.globalService.entityId;
    this.initForm();
  }

  initForm() {
    this.useForm = this.fb.group({
      serviceIds: [[]],
    });

    this.searchForm = this.fb.group({
      searchText: [''],
    });

    // this.roomService.roomTypeFormData.active;

    this.manageRoutes();
  }

  manageRoutes() {}

  saveForm(data: { serviceIds: string[]; packageCode: string }) {
    this.roomService
      .updateHotel(this.entityId, { serviceIds: data.serviceIds })
      .subscribe(this.handleSuccess, this.handelError);
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
