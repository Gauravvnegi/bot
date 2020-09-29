import { Component, OnInit } from '@angular/core';
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
@Component({
  selector: 'hospitality-bot-manage-permission',
  templateUrl: './manage-permission.component.html',
  styleUrls: ['./manage-permission.component.scss'],
})
export class ManagePermissionComponent implements OnInit {
  brandNames: [];
  branchNames: [];
  countries = new CountryCode().getByLabelAndValue();

  userPermissions;
  userForm: FormGroup;

  value;
  constructor(
    private _fb: FormBuilder,
    private _userDetailService: UserDetailService,
    private _hotelDetailService: HotelDetailService
  ) {
    this.initUserForm();
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
      email: ['', Validators.required],
      profileUrl: [''],
      permissionConfigs: this._fb.array([]),
    });
  }

  ngOnInit(): void {
    this.initLOV();
    this.initUserPermissions();
    this.registerListeners();
  }

  registerListeners() {
    this.userForm.get('branchName').disable();
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
    this.setBranchLOV();
  }

  setBrandLOV() {
    this.brandNames = this._hotelDetailService.hotelDetails.brands;
  }

  setBranchLOV() {}

  initUserPermissions() {
    const { permissionConfigs } = this._userDetailService.userPermissions;
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
            action: [
              {
                value: config.permissions.action <= 0 ? 0 : 1,
                disabled: config.permissions.action == -1 ? true : false,
              },
            ],
          }),
        })
      );
    });
  }

  savePermission() {
    let values = this.userForm.getRawValue();

    values.permissionConfigs.forEach((config, configIndex) => {
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

    this.value = { ...values };
  }

  get permissionConfigsFA() {
    return this.userForm.get('permissionConfigs') as FormArray;
  }
}

//auth -- x-authorization
//x-acess--token   x-access-token
//refresh-token x-refresh-authorization
//x-acess-refresh  x-access-refresh-token
