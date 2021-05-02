import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { UserDetailService } from 'libs/admin/shared/src/lib/services/user-detail.service';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { CountryCode } from '../../../../../../shared/models/country-code.model';
import { Regex } from '../../../../../../shared/constants/regex';
import { ManagePermissionService } from '../../services/manage-permission.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
@Component({
  selector: 'hospitality-bot-add-user-permission',
  templateUrl: './add-user-permission.component.html',
  styleUrls: ['./add-user-permission.component.scss'],
})
export class AddUserPermissionComponent implements OnInit {
  brandNames: [];
  branchNames: [];
  countries = new CountryCode().getByLabelAndValue();
  userPermissions;
  isSavingPermissions = false;
  userForm: FormGroup;
  managedBy: {
    firstName: string;
    lastName: string;
    jobTitle: string;
  };
  private _onOpenedChange = new Subject();
  onOpenedChange = this._onOpenedChange.asObservable();
  isOptionsOpenedChanged = true;
  @Output()
  optionChange = new EventEmitter();

  value;
  constructor(
    private _fb: FormBuilder,
    private _userDetailService: UserDetailService,
    private _hotelDetailService: HotelDetailService,
    private _managePermissionService: ManagePermissionService,
    private _snackbarService: SnackBarService,
    private _location: Location
  ) {
    this.initUserForm();
  }

  openedChange(event) {
    this._onOpenedChange.next(event);
  }

  trackByFn(index, item) {
    return index;
  }

  change(event) {
    const selectData = {
      // index: this.index,
      selectEvent: event,
      formControlName: 'cc',
      formGroup: this.userForm,
    };
    this.optionChange.emit(selectData);
  }

  initUserForm() {
    this.userForm = this._fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      jobTitle: ['', Validators.required],
      brandName: ['', Validators.required],
      branchName: ['', Validators.required],
      cc: [''],
      phoneNumber: [''],
      email: ['', [Validators.required, Validators.pattern(Regex.EMAIL_REGEX)]],
      profileUrl: [''],
      permissionConfigs: this._fb.array([]),
    });
  }

  ngOnInit(): void {
    this.initLOV();
    this.initUserPermissions();
    this.initManager();
    this.registerListeners();
  }

  initManager() {
    const {
      firstName,
      lastName,
      jobTitle,
    } = this._userDetailService.userDetails;
    this.managedBy = {
      firstName,
      lastName,
      jobTitle,
    };
  }

  registerListeners() {
    this.userForm.get('branchName').disable();
    this.listenForBrandChanges();
  }

  listenForBrandChanges() {
    this.userForm.get('brandName').valueChanges.subscribe((brandId) => {
      const { branches } = this.brandNames.find(
        (brand) => brand['id'] == brandId
      );
      this.branchNames = branches;
      this.userForm.get('branchName').enable();
    });
  }

  initLOV() {
    this.setBrandLOV();
  }

  setBrandLOV() {
    this.brandNames = this._hotelDetailService.hotelDetails.brands;
  }

  initUserPermissions() {
    const { permissionConfigs } = this._userDetailService.userDetails;
    this.userPermissions = permissionConfigs;

    permissionConfigs.forEach((config, index) => {
      this.permissionConfigsFA.push(
        this._fb.group({
          entity: [config.entity],
          label: [config.label],
          permissions: this._fb.group({
            manage: [
              {
                value: config.permissions.manage <= 0 ? 0 : 1,
                disabled: config.permissions.manage == -1 ? true : false,
              },
            ],
            view: [
              {
                value: config.permissions.view <= 0 ? 0 : 1,
                disabled: config.permissions.view == -1 ? true : false,
              },
            ],
            // action: [
            //   {
            //     value: config.permissions.action <= 0 ? 0 : 1,
            //     disabled: config.permissions.action == -1 ? true : false,
            //   },
            // ],
          }),
        })
      );
    });
  }

  savePermission() {
    if (!this.userForm.valid) {
      this._snackbarService.openSnackBarAsText('Invalid Form');
      return;
    }

    let formValue = this.userForm.getRawValue();

    formValue.permissionConfigs.forEach((config, configIndex) => {
      const permissionFA = this.permissionConfigsFA
        .at(configIndex)
        .get('permissions') as FormGroup;

      Object.keys(permissionFA.controls).forEach((controlKey, controlIndex) => {
        const control = permissionFA.get(controlKey) as FormControl;

        if (control.disabled) {
          config.permissions[controlKey] = -1;
        } else {
          control.value === false && (config.permissions[controlKey] = 0);

          control.value === true && (config.permissions[controlKey] = 1);
        }
      });
    });

    this.value = { ...formValue };

    let data = this._managePermissionService.modifyPermissionDetails(
      this.value
    );

    this.isSavingPermissions = true;
    this._managePermissionService
      .addUser({
        data,
        parentUserId: this._userDetailService.getLoggedInUserid(),
      })
      .subscribe(
        (res) => {
          this._snackbarService.openSnackBarAsText(
            'User Added sucessfull.',
            '',
            { panelClass: 'success' }
          );
          this.isSavingPermissions = false;
        },
        (error) => {
          this._snackbarService.openSnackBarAsText(error.error.message);
          this.isSavingPermissions = false;
        }
      );
  }

  get permissionConfigsFA() {
    return this.userForm.get('permissionConfigs') as FormArray;
  }

  goback() {
    this._location.back();
  }
}
