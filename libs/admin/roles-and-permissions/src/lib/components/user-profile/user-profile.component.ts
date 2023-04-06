import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AdminUtilityService,
  CountryCode,
  NavRouteOptions,
  Regex,
  UserService,
} from '@hospitality-bot/admin/shared';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { ModalService, SnackBarService } from 'libs/shared/material/src';
import { BehaviorSubject } from 'rxjs';
import { UserConfig } from '../../../../../shared/src/lib/models/userConfig.model';
import { ManagePermissionService } from '../../services/manage-permission.service';
import { PageState, Permission, PermissionMod } from '../../types';
import { UserPermissionDatatableComponent } from '../user-permission-datatable/user-permission-datatable.component';

@Component({
  selector: 'hospitality-bot-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  pageState = new BehaviorSubject<PageState>('view');
  pageState$ = this.pageState.asObservable();

  brandNames: [];
  branchNames: [];

  departments: any[];
  products: any[];

  tabListItems: { label: string; value: string }[];
  tabIdx = 1;

  countries = new CountryCode().getByLabelAndValue();

  isUpdatingPermissions = false;
  userForm: FormGroup;
  managedBy: {
    firstName: string;
    lastName: string;
    jobTitle: string;
  };
  adminData;
  value;

  teamMember: { initial: string; color: string }[] = [];
  totalTeamMember: number = 0;

  manageProduct: string;

  userToModDetails;
  adminToModDetails;
  panelOpenState = true;
  @Output() optionChange = new EventEmitter();

  adminPermissions: Permission[];
  userPermissions: Permission[];

  pageTitle: string;
  navRoutes: NavRouteOptions = [];

  constructor(
    private _fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private _modal: ModalService,
    private _userService: UserService,
    private _hotelDetailService: HotelDetailService,
    private _managePermissionService: ManagePermissionService,
    private snackbarService: SnackBarService,
    private _route: ActivatedRoute,
    private _location: Location
  ) {
    this.initUserForm();
  }

  ngOnInit(): void {
    this.initAdminPermission();
    this._managePermissionService
      .getUserDetailsById(this._route.snapshot.paramMap.get('id'))
      .subscribe((data) => {
        this.adminData = data;
        this.adminToModDetails = new UserConfig().deserialize(this.adminData);

        this.products = this.adminToModDetails.products;
        this.departments = this.adminToModDetails.departments.map((item) => ({
          ...item,
          label: item.departmentLabel,
          value: item.department,
        }));
        this.initStateSubscription();
      });

    this.brandNames = this._hotelDetailService.hotelDetails.brands;

    this.initManager();
    this.initTeamMember();
    this.registerListeners();
  }

  initTeamMember() {
    this._managePermissionService
      .getManagedUsers({
        queryObj: '?limit=3',
        loggedInUserId: this._route.snapshot.paramMap.get('id'),
      })
      .subscribe((res) => {
        const color = ['#99e6e6', '#4db380', '#e6331a'];
        this.teamMember = res?.records?.map((item, idx) => ({
          initial: item.firstName?.charAt(0) + item.lastName?.charAt(0),
          color: color[idx],
        }));
        this.totalTeamMember = res?.total;
      });
  }

  initStateSubscription() {
    this.pageState$.subscribe((res) => {
      this.tabIdx = 0;

      switch (res) {
        case 'view':
          this.userToModDetails = this.adminToModDetails;
          const { departments, products, ...rest } = this.userToModDetails;
          this.userForm.patchValue({
            ...rest,
            phoneNumber: this.userToModDetails.phoneNumber.substring(
              this.userToModDetails?.phoneNumber.lastIndexOf(' ') + 1,
              this.userToModDetails?.phoneNumber.length
            ),
            products: products.map((item) => item.value),
            departments: departments.map((item) => item.department),
          });
          this.pageTitle = 'User Profile';
          this.navRoutes = [
            {
              label:
                this.userForm.get('firstName')?.value +
                ' ' +
                (this.userForm.get('lastName')?.value ?? ''),
              link: './',
            },
          ];
          this.userForm.disable();
          this.initAfterFormLoaded();
          break;

        case 'add':
          this.userForm.patchValue({
            firstName: '',
            lastName: '',
            jobTitle: '',
            phoneNumber: '',
            email: '',
            id: '',
          });
          this.userForm.enable();
          this.navRoutes = [
            {
              label: 'User Profile',
              link: './',
            },
            { label: 'Add User', link: './' },
          ];
          this.pageTitle = 'Add New User';
          break;

        case 'edit':
          this.userForm.patchValue({
            ...this.userToModDetails,
            products: this.userToModDetails.products.map((item) => item.value),
            departments: this.userToModDetails.departments.map(
              (item) => item.department
            ),
          });
          this.userForm.enable();
          this.initAfterFormLoaded();
          this.navRoutes = [
            {
              label: 'User Profile',
              link: './',
            },
            {
              label:
                'Edit ' +
                this.userForm.get('firstName')?.value +
                ' ' +
                (this.userForm.get('lastName')?.value ?? ''),
              link: './',
            },
          ];
          this.pageTitle = 'Edit User';
          break;
        default:
          break;
      }

      this.initUserPermissions();
    });
  }

  hasPageState(...args: PageState[]) {
    return args.includes(this.pageState.value);
  }

  /**
   * Setting the permission config of the admin
   */
  initAdminPermission() {
    const { permissionConfigs } = this._userService.userDetails;
    this.adminPermissions = permissionConfigs;
  }

  initAfterFormLoaded() {
    this.onSelectedTabFilterChange({ index: 0 });
  }

  initUserForm() {
    this.userForm = this._fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: [''],
      jobTitle: ['', Validators.required],
      brandName: ['', Validators.required],
      products: ['', Validators.required],
      departments: [[], Validators.required],
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

  uploadProfileImage(event): void {
    const formData = new FormData();
    formData.append('files', event.file);
    const hotelId = this.userForm.get('branchName').value;
    this._userService.uploadProfileImage(hotelId, formData).subscribe(
      (response) => {
        this.userForm.get('profileUrl').patchValue([response.fileDownloadUri]);
        this.snackbarService.openSnackBarAsText('Profile uploaded', '', {
          panelClass: 'success',
        });
      },
      ({ error }) => {
        this.snackbarService.openSnackBarAsText(error.message);
      }
    );
  }

  deleteFile() {
    this.userForm.patchValue({
      profileUrl: [''],
    });
  }

  trackByFn(index, item) {
    return index;
  }

  change(event) {
    const selectData = {
      selectEvent: event,
      formControlName: 'cc',
      formGroup: this.userForm,
    };
    this.optionChange.emit(selectData);
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
    this.listenForBrandChanges();
    this.listenForProductChange();
  }

  onSelectedTabFilterChange(event) {
    this.manageProduct = this.userForm.get('products')?.value[event.index];
    this.tabIdx = event.index;
  }

  get permissionConfigsFA() {
    return this.userForm.get('permissionConfigs') as FormArray;
  }

  listenForBrandChanges() {
    this.userForm.get('branchName').disable();
    this.userForm.get('brandName').valueChanges.subscribe((brandId) => {
      const currentBrand: any = this.brandNames.find(
        (brand) => brand['id'] === brandId
      );
      const branches = currentBrand?.branches;
      if (branches) {
        this.branchNames = branches;
        if (this.pageState.value !== 'view')
          this.userForm.get('branchName').enable();
      }
    });
  }

  listenForProductChange() {
    this.userForm.get('products').valueChanges.subscribe((products) => {
      const departmentValue = this.userForm.get('departments').value;

      this.tabListItems = this.products.filter((item) =>
        products.includes(item.value)
      );

      this.departments = this.adminToModDetails.departments.filter(
        (item: any) => products.includes(item.productType)
      );
      this.departments = this.departments.map((item) => ({
        ...item,
        label: item.departmentLabel,
        value: item.department,
      }));
      const currentDepartments = this.departments
        .filter((item: any) => departmentValue?.includes(item.department))
        .map((item) => item.department);

      this.userForm.patchValue({ departments: currentDepartments });
    });
  }

  constructPermission(config: Permission) {
    const view = config.permissions.view;
    const manage = config.permissions.manage;
    const disabledPermissions = [
      {
        view: view === -1,
        manage: manage === -1,
      },
    ];

    if (this.pageState.value === 'view') {
      return this._fb.group({
        manage: [
          {
            value: manage <= 0 ? 0 : 1,
            disabled: manage === -1,
          },
        ],
        view: [
          {
            value: view <= 0 ? 0 : 1,
            disabled: view === -1,
          },
        ],
        disabledPermissions,
      });
    }

    if (this.pageState.value === 'add') {
      return this._fb.group({
        manage: [
          {
            value: manage <= 0 ? 0 : 1,
            disabled: manage === -1 || manage === 0,
          },
        ],
        view: [
          {
            value: view <= 0 ? 0 : 1,
            disabled: view === -1 || view === 0,
          },
        ],
        disabledPermissions,
      });
    }

    if (this.pageState.value === 'edit') {
      const userConfig = this.userPermissions.find(
        (item) => item.entity === config.entity
      );
      const userView = userConfig ? userConfig.permissions.view : 0;
      const userManage = userConfig ? userConfig.permissions.manage : 0;

      return this._fb.group({
        manage: [
          {
            value: userManage <= 0 || manage <= 0 ? 0 : 1,
            disabled: manage === -1 || manage === 0,
          },
        ],
        view: [
          {
            value: userView <= 0 || view <= 0 ? 0 : 1,
            disabled: view === -1 || view === 0,
          },
        ],
        disabledPermissions,
      });
    }
  }

  initUserPermissions() {
    const formArray = this.userForm.get('permissionConfigs') as FormArray;

    formArray.clear();

    this.adminPermissions.forEach((config, index) => {
      formArray.push(
        this._fb.group({
          entity: [config.entity],
          label: [config.label],
          permissions: this.constructPermission(config),
          productType: [config.productType],
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

    tableCompRef.componentInstance.tabFilterIdx =
      this.totalTeamMember === 0 ? 0 : 1;

    tableCompRef.componentInstance.onModalClose.subscribe((userData) => {
      tableCompRef.close();

      const {
        userId,
        jobTitle,
        permissionConfigs,

        ...rest
      } = userData;

      this.userToModDetails = new UserConfig().deserialize({
        ...rest,
        id: userId,
        title: jobTitle,
        permissions: permissionConfigs,
      });
      this.userPermissions = permissionConfigs;

      this.pageState.next('edit');
    });
  }

  savePermission() {
    if (!this.userForm.valid) {
      this.snackbarService.openSnackBarAsText('Invalid Form');
      this.userForm.markAllAsTouched();
      return;
    }
    const formValue = this.userForm.getRawValue();
    const permissionConfigs: Permission[] = [];

    formValue.permissionConfigs.forEach((config: PermissionMod) => {
      const { permissions, ...rest } = config;
      const permission: Permission = {
        ...rest,
        permissions: {
          view: permissions.disabledPermissions.view
            ? -1
            : permissions.view
            ? 1
            : 0,
          manage: permissions.disabledPermissions.manage
            ? -1
            : permissions.manage
            ? 1
            : 0,
        },
      };

      permissionConfigs.push(permission);
    });

    this.value = { ...formValue, permissionConfigs };

    const data = this._managePermissionService.modifyPermissionDetailsForEdit(
      this.value,
      this.departments.map(({ label, value, ...rest }) => ({ ...rest }))
    );
    const handleError = (error) => {
      this.snackbarService
        .openSnackBarWithTranslate(
          {
            translateKey: `messages.error.${error?.type}`,
            priorityMessage: error?.message,
          },
          ''
        )
        .subscribe();
      this.isUpdatingPermissions = false;
    };

    const handleSuccess = (res) => {
      this.snackbarService.openSnackBarAsText(
        this.hasPageState('add')
          ? 'User Added Successfully'
          : 'User Edited Successfully',
        '',
        {
          panelClass: 'success',
        }
      );
      this.isUpdatingPermissions = false;
      this.pageState.next('view');
    };

    this.isUpdatingPermissions = true;

    if (this.pageState.value === 'add')
      this._managePermissionService
        .addNewUser(this._userService.getLoggedInUserId(), {
          ...data,
          status: true,
        })
        .subscribe(handleSuccess, handleError);

    if (this.pageState.value === 'edit')
      this._managePermissionService
        .updateUserDetailsById({
          ...data,
          status: true,
          parentId: this._userService.getLoggedInUserId(),
        })
        .subscribe(handleSuccess, handleError);
  }

  addUser() {
    this.pageState.next('add');
  }

  handleManage(event) {
    if (this.pageState.value === 'view') {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  goBack() {
    if (this.pageState.value !== 'view') {
      this.pageState.next('view');
    } else {
      this._location.back();
    }
  }
}
