import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Option, UserService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ManagePermissionService } from 'libs/admin/roles-and-permissions/src/lib/services/manage-permission.service';
import { ServiceItemForm } from '../../types/request.type';
import { RequestService } from '../../services/request.service';
import { Router } from '@angular/router';
import { convertToNormalCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';

@Component({
  selector: 'hospitality-bot-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: [
    './add-item.component.scss',
    '../raise-request/raise-request.component.scss',
  ],
})
export class AddItemComponent implements OnInit {
  pageTitle = 'Add Item';
  navRoutes = [{ label: 'Add Service Item', link: './' }];

  loading: boolean = false;
  userList: Option[] = [];
  useForm: FormGroup;
  entityId: string;
  isSidebar = false;
  @Output() onClose = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private _userService: UserService,
    private _managePermissionService: ManagePermissionService,
    private snackbarService: SnackBarService,
    private requestService: RequestService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.entityId = this._userService.getentityId();

    this.initForm();
    this.getUserList();
  }

  initForm() {
    this.useForm = this.fb.group({
      itemName: ['', [Validators.required]],
      categoryDesc: ['', [Validators.required]],
      functionCode: [''],
      serviceCode: [''],
      itemDesc: [''],
      sla: ['', [Validators.required]],
      users: ['', [Validators.required]],
    });
  }

  getUserList() {
    this._managePermissionService
      .getAllUsers(this.entityId, {
        params: '?status=true&mention=true',
      })
      .subscribe((data) => {
        this.userList = data.users.map((item) => ({
          label: `${item.firstName} ${item.lastName}`,
          value: item.id,
          extras: item?.departments
            .map((item) => convertToNormalCase(item.department))
            .join(', '),
        }));
      });
  }

  close(): void {
    this.onClose.emit();
  }

  handleSubmit() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }

    const data = this.useForm.getRawValue() as ServiceItemForm;
    this.loading = true;
    this.requestService
      .addServiceItem(this.entityId, data)
      .subscribe(this.handleSuccess, this.handleError);
  }

  handleSuccess = () => {
    this.loading = false;
    this.snackbarService.openSnackBarAsText(
      `Service Created successfully`,
      '',
      { panelClass: 'success' }
    );
    this.requestService.refreshItemList.next(true);
    this.onClose.emit();
  };

  handleError = (error) => {
    this.loading = false;
  };

  resetForm() {
    this.useForm.reset();
  }
}
