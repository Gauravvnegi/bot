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
import { outletRoutes } from '../../constants/routes';

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
    // this.loading = true;
    this.values = [
      {
        code: '12',
        itemName: 'Coffee',
        type: 'Cold',
        hsnCode: '#12ds',
        category: 'Drinks',
        kitchenDept: 'Dept 1',
        delivery: '04:00 PM',
        preparationTime: '10 mins',
        unit: 2,
      },
    ];
  }

  addMenuItems() {
    this.router.navigate([outletRoutes.addMenuItem1.route], {
      relativeTo: this.route,
    });
  }

  handleImport() {}
}
