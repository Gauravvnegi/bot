import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { UserService } from '@hospitality-bot/admin/shared';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { CountryCode } from '../../../../../../shared/models/country-code.model';
import { Regex } from '../../../../../../shared/constants/regex';
import { ManagePermissionService } from '../../services/manage-permission.service';
import { SnackBarService } from 'libs/shared/material/src';
import { ActivatedRoute, Router } from '@angular/router';
import { UserConfig } from '../../../../../shared/src/lib/models/userConfig.model';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'hospitality-bot-edit-user-permission',
  templateUrl: './edit-user-permission.component.html',
  styleUrls: [
    '../add-user-permission/add-user-permission.component.scss',
    './edit-user-permission.component.scss',
  ],
})
export class EditUserPermissionComponent implements OnInit {
  brandNames: [];
  branchNames: [];
  countries = new CountryCode().getByLabelAndValue();
  userPermissions;
  isUpdatingPermissions = false;
  userForm: FormGroup;
  managedBy: {
    firstName: string;
    lastName: string;
    jobTitle: string;
  };

  value;

  userToModDetails;
  private _onOpenedChange = new Subject();
  onOpenedChange = this._onOpenedChange.asObservable();
  isOptionsOpenedChanged = true;
  @Output()
  optionChange = new EventEmitter();

  constructor(
    private router: Router,
    private _fb: FormBuilder,
    private _userService: UserService,
    private _hotelDetailService: HotelDetailService,
    private _managePermissionService: ManagePermissionService,
    private _snackbarService: SnackBarService,
    private _route: ActivatedRoute,
    private _location: Location
  ) {
    this.initUserForm();
  }

  initUserForm() {
    this.userForm = this._fb.group({
      id: ['', Validators.required],
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

  ngOnInit(): void {
    this._managePermissionService
      .getUserDetailsById(this._route.snapshot.paramMap.get('id'))
      .subscribe((data) => {
        this.userToModDetails = new UserConfig().deserialize(data);
        this.initLOV();
        this.initUserPermissions();
        this.userForm.patchValue(this.userToModDetails);
      });
    this.initManager();
    this.registerListeners();
  }

  initManager() {
    const { firstName, lastName, jobTitle } = this._userService.userDetails;
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
    const { permissionConfigs } = this._userService.userDetails;
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

    let data = this._managePermissionService.modifyPermissionDetailsForEdit(
      this.value
    );

    this.isUpdatingPermissions = true;
    this._managePermissionService
      .updateUserDetailsById({
        data,
        parentUserId: this._userService.getLoggedInUserid(),
      })
      .subscribe(
        (res) => {
          this._snackbarService.openSnackBarAsText(
            'User Permission edited sucessfull.',
            '',
            { panelClass: 'success' }
          );
          this.isUpdatingPermissions = false;
        },
        (error) => {
          this._snackbarService.openSnackBarAsText(error.error.message);
          this.isUpdatingPermissions = false;
        }
      );
  }

  get permissionConfigsFA() {
    return this.userForm.get('permissionConfigs') as FormArray;
  }
  
  openRolesPermission(event) {
    event.stopPropagation();
    this.router.navigate(['/pages/roles-permissions']);
  }

  goback() {
    this._location.back();
  }
}
