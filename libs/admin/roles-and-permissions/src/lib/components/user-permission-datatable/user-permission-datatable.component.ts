import { Component, OnInit } from '@angular/core';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'hospitality-bot-user-permission-datatable',
  templateUrl: './user-permission-datatable.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './user-permission-datatable.component.scss',
  ],
})
export class UserPermissionDatatableComponent extends BaseDatatableComponent
  implements OnInit {
  tableName = 'Roles & Permissions';
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  isTabFilters = false;

  cols = [
    { field: 'primaryRoom.roomNumber', header: 'Name/Mobile & Email' },
    { field: 'booking.bookingNumber', header: 'Hotel Name & Branch/Job title' },
    { field: 'guests.primaryGuest.firstName', header: 'Permissions' },
    { field: 'arrivalAndDepartureDate', header: 'Manages By' },
    { field: 'package', header: 'Active' },
  ];

  constructor(
    public fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    super(fb);
  }

  ngOnInit(): void {}

  addUser() {
    this._router.navigate(['add-user'], { relativeTo: this._route });
  }
}
