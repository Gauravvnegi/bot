import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CountryCode,
  NavRouteOptions,
  Option,
  Regex,
  UserService,
} from '@hospitality-bot/admin/shared';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { ModalService, SnackBarService } from 'libs/shared/material/src';
import { UserConfig } from '../../../../../shared/src/lib/models/userConfig.model';
import { managePermissionRoutes, navRoute } from '../../constants/routes';
import { ManagePermissionService } from '../../services/manage-permission.service';
import { PageState, Permission, PermissionMod } from '../../types';
import { UserPermissionDatatableComponent } from '../user-permission-datatable/user-permission-datatable.component';

@Component({
  selector: 'hospitality-bot-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  loggedInUserId: string;

  departments: Option[];
  products: Option[];
  brandNames: Option[];
  branchNames: Option[];

  tabListItems: { label: string; value: string }[];
  tabIdx = 1;

  countries = new CountryCode().getByLabelAndValue();

  isUpdatingPermissions = false;
  userForm: FormGroup;

  isEdited = false;
  isLoading = true;

  teamMember: { initial: string; color: string }[] = [];
  totalTeamMember: number = 0;

  manageProduct: string;

  userToModDetails: UserConfig;
  adminToModDetails: UserConfig;

  @Output() optionChange = new EventEmitter();

  adminPermissions: Permission[];
  userPermissions: Permission[];

  pageTitle: string;
  navRoutes: NavRouteOptions = [];
  state: PageState;

  constructor(
    private _fb: FormBuilder,
    private _modal: ModalService,
    private _userService: UserService,
    private _hotelDetailService: HotelDetailService,
    private _managePermissionService: ManagePermissionService,
    private snackbarService: SnackBarService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initUserForm();
  }

  ngOnInit(): void {
    this.loggedInUserId = this._userService.getLoggedInUserId();
    this.brandNames = this._hotelDetailService.brands.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    this.initPageState();
    this.initAdminUserDetails();

    this.initTeamMember();
    this.registerListeners();
  }

  /**
   * @function initPageState To get the state of the page
   * whether it is in view | edit | add mode
   */
  initPageState() {
    const routeData = Object.entries(
      managePermissionRoutes
    ).find(([_, value]) => this.router.url.includes(value.route.split('/')[0]));
    this.state = routeData[0] as PageState;
    this.pageTitle = routeData[1].title;
    this.navRoutes = routeData[1].navRoutes;
  }

  /**
   * To initialize logged in user data
   */
  initAdminUserDetails() {
    this._managePermissionService
      .getUserDetailsById(this.loggedInUserId)
      .subscribe((data) => {
        this.adminToModDetails = new UserConfig().deserialize(data);
        this.products = this.adminToModDetails.products;
        this.departments = this.adminToModDetails.departments.map((item) => ({
          ...item,
          label: item.departmentLabel,
          value: item.department,
        }));

        const { permissionConfigs } = this._userService.userDetails;
        this.adminPermissions = permissionConfigs;
        this.initStateSubscription();
      });
  }

  /**
   * To get the initial of the team
   */
  initTeamMember() {
    this._managePermissionService
      .getManagedUsers({
        queryObj: '?limit=3',
        loggedInUserId: this.loggedInUserId,
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

  initFormValues() {
    const {
      departments,
      products,
      branchName,
      ...rest
    } = this.userToModDetails;

    this.userForm.patchValue({
      ...rest,
      phoneNumber: this.userToModDetails.phoneNumber.substring(
        this.userToModDetails?.phoneNumber.lastIndexOf(' ') + 1,
        this.userToModDetails?.phoneNumber.length
      ),
      products: products.map((item) => item.value),
      departments: departments.map((item) => item.department),
      // branchName: branchName.map((item) => item.value),
      branchName: branchName,
    });
  }

  initStateSubscription() {
    this.tabIdx = 0;

    switch (this.state) {
      case 'userProfile':
      case 'addNewUser':
        this.userToModDetails = this.adminToModDetails;
        this.initFormValues();
        this.initAfterFormLoaded();
        this.initUserPermissions();

        if (this.state === 'addNewUser') {
          this.userForm.patchValue({
            firstName: '',
            lastName: '',
            jobTitle: '',
            phoneNumber: '',
            email: '',
            id: '',
          });

          this.userForm.enable();
        } else {
          this.userForm.disable();
          this.userForm.get('firstName').enable();
          this.userForm.get('lastName').enable();
          this.userForm.get('cc').enable();
          this.userForm.get('phoneNumber').enable();
          this.isFormEdited();
        }

        break;

      case 'editUser':
        this._managePermissionService
          .getUserDetailsById(this.route.snapshot.paramMap.get('id'))
          .subscribe((data) => {
            this.userToModDetails = new UserConfig().deserialize(data);
            this.userPermissions = this.userToModDetails.permissionConfigs;
            this.initFormValues();
            this.initAfterFormLoaded();
            this.initUserPermissions();
            this.pageTitle = this.pageTitle.replace(
              '{0}',
              `${this.userToModDetails.firstName} ${this.userToModDetails.lastName}`
            );
          });
        break;
      default:
        break;
    }
  }

  isFormEdited() {
    this.userForm.valueChanges.subscribe(() => {
      this.isEdited = true;
    });
  }

  hasPageState(...args: PageState[]) {
    return args.includes(this.state);
  }

  initAfterFormLoaded() {
    this.onSelectedTabFilterChange({ index: 0 });
    this.isLoading = false;
  }

  initUserForm() {
    this.userForm = this._fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: [''],
      jobTitle: ['', Validators.required],
      brandName: ['', Validators.required],
      products: [[], Validators.required],
      departments: [[], Validators.required],
      branchName: [[], Validators.required],
      cc: [''],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(Regex.EMAIL_REGEX)]],
      profileUrl: [''],
      permissionConfigs: this._fb.array([]),
    });
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
      const currentBrand = this._hotelDetailService.brands.find(
        (brand) => brand['id'] === brandId
      );
      const branches = currentBrand?.entities;
      if (branches) {
        this.branchNames = branches.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        if (this.state !== 'userProfile')
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

    if (this.state === 'userProfile') {
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

    if (this.state === 'addNewUser') {
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

    if (this.state === 'editUser') {
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

    tableCompRef.componentInstance.onModalClose.subscribe((userId) => {
      tableCompRef.close();
      if (userId)
        this.router.navigate([navRoute.editUser.link.replace('{0}', userId)]);
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

    const data = this._managePermissionService.modifyPermissionDetailsForEdit(
      { ...formValue, permissionConfigs },
      this.departments.map(({ label, value, ...rest }) => ({ ...rest }))
    );

    const userProfileData = this._managePermissionService.modifyUserDetailsForEdit(
      formValue
    );

    const handleError = (error) => {
      this.isUpdatingPermissions = false;
    };

    const handleSuccess = (res) => {
      this.snackbarService.openSnackBarAsText(
        this.hasPageState('addNewUser')
          ? 'User Added Successfully'
          : 'User Edited Successfully',
        '',
        {
          panelClass: 'success',
        }
      );
      this.isUpdatingPermissions = false;
      this.router.navigate([navRoute.userProfile.link]);
    };

    this.isUpdatingPermissions = true;

    if (this.state === 'userProfile') {
      this._managePermissionService
        .editUserDetails({
          ...userProfileData,
          status: true,
          userId: this._userService.getLoggedInUserId(),
        })
        .subscribe(handleSuccess, handleError);
      this.isEdited = false;
    }

    if (this.state === 'addNewUser')
      this._managePermissionService
        .addNewUser(this._userService.getLoggedInUserId(), {
          ...data,
          status: true,
        })
        .subscribe(handleSuccess, handleError);

    if (this.state === 'editUser')
      this._managePermissionService
        .updateUserDetailsById({
          ...data,
          status: true,
          parentId: this._userService.getLoggedInUserId(),
        })
        .subscribe(handleSuccess, handleError);
  }

  addUser() {
    this.router.navigate([navRoute.addNewUser.link]);
  }

  handleManage(event) {
    if (this.state === 'userProfile') {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
