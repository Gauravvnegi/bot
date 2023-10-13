import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { NavRouteOptions } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { RoomService } from '../../services/room.service';
import { error } from 'console';
import { roomRoutesConfig } from '../../constant/routes';

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
  navRoutes: NavRouteOptions = [];

  roomTypeId: string;

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    private roomService: RoomService,
    private router: Router,
    private location: Location,
    private globalService: GlobalFilterService,
    private routesConfigService: RoutesConfigService
  ) {
    this.router.events.subscribe(
      ({ snapshot }: { snapshot: ActivatedRouteSnapshot }) => {
        const roomTypeId = snapshot?.params['roomTypeId'];
        if (roomTypeId) {
          this.roomTypeId = roomTypeId;
        }
      }
    );
  }

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
    this.initNavRoutes();
  }

  initNavRoutes() {
    let path = '';
    this.routesConfigService.activeRouteConfigSubscription.subscribe(
      (activeRouteConfig) => {
        path = activeRouteConfig.submodule.fullPath;
      }
    );
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes];
      const roomRoutes =
        roomRoutesConfig[
          this.roomTypeId ? 'editRoomTypeImportServices' : 'importServices'
        ];
      this.pageTitle = roomRoutes.title;
      const modifiedRoomType = roomRoutes.navRoutes.map((navRoute) => {
        if (navRoute.link.includes(':roomTypeId')) {
          navRoute.link = navRoute.link.replace(':roomTypeId', this.roomTypeId);
        }
        navRoute.link = path + '/' + navRoute.link;

        return navRoute;
      });
      this.navRoutes = [...this.navRoutes, ...modifiedRoomType];
    });
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
