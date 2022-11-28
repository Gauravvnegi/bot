import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import {
  AdminUtilityService,
  UserService,
} from '@hospitality-bot/admin/shared';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { CountryCode } from '@hospitality-bot/admin/shared';
import { ManagePermissionService } from '../../services/manage-permission.service';
import { ModalService, SnackBarService } from 'libs/shared/material/src';
import { ActivatedRoute, Router } from '@angular/router';
import { UserConfig } from '../../../../../shared/src/lib/models/userConfig.model';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { Regex } from '@hospitality-bot/admin/shared';
import { MatDialogConfig } from '@angular/material/dialog';
import { UserPermissionDatatableComponent } from '../user-permission-datatable/user-permission-datatable.component';

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

  teamMember = ['An', 'BS', 'SD', 'RG', 'SF'];
  tabFilterIdx = 0;
  value;

  userToModDetails;
  private _onOpenedChange = new Subject();
  onOpenedChange = this._onOpenedChange.asObservable();
  isOptionsOpenedChanged = true;
  @Output()
  optionChange = new EventEmitter();

  constructor(
    private _fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private _modal: ModalService,
    private _userService: UserService,
    private _hotelDetailService: HotelDetailService,
    private _managePermissionService: ManagePermissionService,
    private _snackbarService: SnackBarService,
    private _route: ActivatedRoute,
    private _location: Location,
    private _router: Router
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
      products: ['', Validators.required],
      departments: ['', Validators.required],
      branchName: ['', Validators.required],
      cc: [''],
      phoneNumber: [''],
      email: ['', [Validators.required, Validators.pattern(Regex.EMAIL_REGEX)]],
      profileUrl: [''],
      permissionConfigs: this._fb.array([]),
    });
  }

  /**
   * @function userProfileURL getter for image url.
   */
  get userProfileUrl(): string {
    return this.userForm?.get('profileUrl').value || '';
  }

  uploadProfile(event): void {
    const formData = new FormData();
    formData.append('files', event.file);
    this._userService.uploadProfile(formData).subscribe(
      (response) => {
        this.userForm.get('profileUrl').patchValue([response.fileDownloadUri]);
        this._snackbarService.openSnackBarAsText('Profile uploaded', '', {
          panelClass: 'success',
        });
      },
      ({ error }) => {
        this._snackbarService.openSnackBarAsText(error.message);
      }
    );
  }

  deleteFile() {
    this.userForm.patchValue({
      profileUrl: [''],
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
        this.userForm.patchValue(this.userToModDetails);
        this.loadData();
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

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    this.loadData();
  }

  loadData() {
    let queries = [
      {
        productType: this.userForm.get('products').value[this.tabFilterIdx]
          .value,
      },
    ];
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams(queries),
    };
    this._managePermissionService
      .getUserPermission(this._route.snapshot.paramMap.get('id'), config)
      .subscribe((data) => {
        this._userService.initUserDetails(data);
        this.initUserPermissions();
      });
  }

  listenForBrandChanges() {
    this.userForm.get('brandName').valueChanges.subscribe((brandId) => {
      const { branches } = this.brandNames.find(
        (brand) => brand['id'] === brandId
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
                disabled: config.permissions.manage === -1 ? true : false,
              },
            ],
            view: [
              {
                value: config.permissions.view <= 0 ? 0 : 1,
                disabled: config.permissions.view === -1 ? true : false,
              },
            ],
            // action: [
            //   {
            //     value: config.permissions.action <= 0 ? 0 : 1,
            //     disabled: config.permissions.action === -1 ? true : false,
            //   },
            // ],
          }),
        })
      );
    });
  }

  /**
   * @function openTableModal To open modal pop-up for user persmission.
   */
  openTableModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const tableCompRef = this._modal.openDialog(
      UserPermissionDatatableComponent,
      dialogConfig
    );

    tableCompRef.componentInstance.onModalClose.subscribe((res) => {
      tableCompRef.close();
    });
  }

  savePermission() {
    if (!this.userForm.valid) {
      this._snackbarService.openSnackBarAsText('Invalid Form');
      return;
    }
    const formValue = this.userForm.getRawValue();

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

    const data = this._managePermissionService.modifyPermissionDetailsForEdit(
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

  addUser() {
    this._router.navigate(['/pages/roles-permissions/add-user']);
  }

  get permissionConfigsFA() {
    return this.userForm.get('permissionConfigs') as FormArray;
  }

  goback() {
    this._location.back();
  }
}
