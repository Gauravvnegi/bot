import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  TableService,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { OutletService } from '../../services/outlet.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { cols } from '../../constants/data-table';
import { ActivatedRoute, Router } from '@angular/router';
import { outletBusinessRoutes } from '../../constants/routes';
import { MenuItem } from '../../models/outlet.model';

@Component({
  selector: 'hospitality-bot-menu-data-table',
  templateUrl: './menu-data-table.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './menu-data-table.component.scss',
  ],
})
export class MenuDataTableComponent extends BaseDatatableComponent
  implements OnInit {
  tableName = 'Menu Items';
  cols = cols['MENU'];
  $subscription = new Subscription();
  navigationRoute = outletBusinessRoutes;

  constructor(
    public fb: FormBuilder,
    protected globalFilterService: GlobalFilterService,
    protected tabFilterService: TableService,
    protected outletService: OutletService,
    protected adminUtilityService: AdminUtilityService,
    protected snackbarService: SnackBarService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.initTableValue();
  }

  initTableValue(): void {
    this.loading = true;
    this.outletService.getMenuItems().subscribe(
      (res) => {
        const menuItem = new MenuItem().deserialize(res);
        this.values = res;
      },
      () => {
        this.values = [];
        this.loading = false;
      },
      this.handleFinal
    );
  }

  addMenuItems() {
    this.router.navigate([], {
      relativeTo: this.route,
    });
  }

  handleImport() {}

  /**
   * @function handleError to show the error
   * @param param0 network error
   */
  handleError = ({ error }): void => {
    this.loading = false;
  };

  handleFinal = () => {
    this.loading = false;
  };
}
