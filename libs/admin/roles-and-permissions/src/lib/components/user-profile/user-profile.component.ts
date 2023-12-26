import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CountryCode,
  ModuleNames,
  NavRouteOptions,
  Option,
  PermissionModuleNames,
  Regex,
  UserService,
} from '@hospitality-bot/admin/shared';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { ModalService, SnackBarService } from 'libs/shared/material/src';
import { UserConfig } from '../../../../../shared/src/lib/models/userConfig.model';
import { managePermissionRoutes, navRoute } from '../../constants/routes';
import { ManagePermissionService } from '../../services/manage-permission.service';
import { PageState, Permission, PermissionMod, UserForm } from '../../types';
import { UserPermissionDatatableComponent } from '../user-permission-datatable/user-permission-datatable.component';
import { UserPermissionTable } from '../../models/user-permission-table.model';
import {
  RoutesConfigService,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';

@Component({
  selector: 'hospitality-bot-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [ModalService],
})
export class UserProfileComponent implements OnInit {
  loggedInUserId: string;

  products: Option[];
  brandNames: Option[];
  branchNames: Option[];
  userList: Option[];

  tabListItems: { label: string; value: string }[];
  tabIdx = 1;

  countries = new CountryCode().getByLabelAndValue();

  isUpdatingPermissions = false;
  userForm: FormGroup;

  isEdited = false;
  isLoading = true;
  dataLoading = false;
  userDataLoading = false;

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

  entityId: string;

  updateMessage: Record<PageState, string> = {
    addNewUser: 'User Added Successfully',
    editUser: 'User Profile Updated Successfully',
    userProfile: 'Profile Updated Successfully',
    viewUser: '',
  };

  constructor(
    private _fb: FormBuilder,
    private _modal: ModalService,
    private _userService: UserService,
    private _hotelDetailService: HotelDetailService,
    private _managePermissionService: ManagePermissionService,
    private snackbarService: SnackBarService,
    private router: Router,
    private route: ActivatedRoute,
    private routesConfigService: RoutesConfigService,
    private subscriptionPlanService: SubscriptionPlanService
  ) {
    this.initUserForm();
  }

  ngOnInit(): void {
    this.entityId = this._userService.getentityId();
    this.getUserList();
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
    this.dataLoading = true;

    this._managePermissionService
      .getUserDetailsById(this.loggedInUserId)
      .subscribe(
        (data) => {
          this.adminToModDetails = new UserConfig().deserialize(data);
          this.products = this.adminToModDetails.products;

          const { permissionConfigs } = this._userService.userDetails;
          this.adminPermissions = permissionConfigs;
          this.initStateSubscription();
          this.dataLoading = false;
        },
        (err) => {
          this.dataLoading = false;
        }
      );
  }

  /**
   * To get the initial of the team
   */
  initTeamMember() {
    this._managePermissionService
      .getAllUsers(this.entityId, {
        params: '?limit=3&type=REPORTING',
      })
      .subscribe((res) => {
        const color = ['#99e6e6', '#4db380', '#e6331a'];
        this.teamMember = res?.records?.map((item, idx) => ({
          initial: item.firstName?.charAt(0) + item.lastName?.charAt(0),
          color: color[idx],
        }));
        this.totalTeamMember = res?.entityTypeCounts['REPORTING'];
      });
  }

  permissionIncludesProduct(productListStr: string) {
    return productListStr.includes(this.manageProduct);
  }

  initFormValues() {
    const { products, branchName, ...rest } = this.userToModDetails;

    this.userForm.patchValue({
      ...rest,
      phoneNumber: this.userToModDetails.phoneNumber.substring(
        this.userToModDetails?.phoneNumber.lastIndexOf(' ') + 1,
        this.userToModDetails?.phoneNumber.length
      ),
      products: products.map((item) => item.value),

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
            profileUrl: '',
          } as Partial<UserForm>);

          this.userForm.enable();
        } else {
          this.userForm.disable();
          this.userForm.get('profileUrl').enable();
          this.userForm.get('firstName').enable();
          this.userForm.get('lastName').enable();
          this.userForm.get('cc').enable();
          this.userForm.get('phoneNumber').enable();
          this.isFormEdited();
        }

        break;

      case 'viewUser':
      case 'editUser':
        this.userDataLoading = true;

        this._managePermissionService
          .getUserDetailsById(this.route.snapshot.paramMap.get('id'))
          .subscribe(
            (data) => {
              this.userToModDetails = new UserConfig().deserialize(data);
              this.userPermissions = this.userToModDetails.permissionConfigs;
              this.initFormValues();
              this.initAfterFormLoaded();
              this.initUserPermissions();
              this.pageTitle = this.pageTitle.replace(
                'User',
                `${this.userToModDetails.firstName} ${this.userToModDetails.lastName}`
              );
            },
            () => {},
            () => {
              // disabling field if only view user
              if (this.state === 'viewUser') {
                this.userForm.disable();
              }
              this.userDataLoading = false;
            }
          );

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

  doesNotHasPageSate(...args: PageState[]) {
    return !args.includes(this.state);
  }

  get hasManagePermission() {
    return this.subscriptionPlanService.hasManageUserPermission(
      PermissionModuleNames.USERS
    );
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
      // departments: [[], Validators.required],
      departments: [[]],
      branchName: [[], Validators.required],
      cc: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(Regex.EMAIL_REGEX)]],
      profileUrl: [''],
      permissionConfigs: this._fb.array([]),
      reportingTo: [''],
    });
  }

  registerListeners() {
    this.listenForBrandChanges();
    this.listenForProductChange();
  }

  onSelectedTabFilterChange(event) {
    this.manageProduct = this.tabListItems?.[event.index].value;
    this.tabIdx = event.index;
  }

  get permissionConfigsFA() {
    return this.userForm.get('permissionConfigs') as FormArray;
  }

  listenForBrandChanges() {
    const { branchName, brandName } = this.userFormControl;
    branchName.disable();
    brandName.valueChanges.subscribe((brandId) => {
      const currentBrand = this._hotelDetailService.brands.find(
        (brand) => brand['id'] === brandId
      );
      const branches = currentBrand?.entities;
      if (branches) {
        this.branchNames = branches.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        if (this.state !== 'userProfile') branchName.enable();
      }
    });
  }

  listenForProductChange() {
    const { products, departments } = this.userFormControl;

    products.valueChanges.subscribe((products) => {
      // const departmentValue = departments.value;

      this.tabListItems = this.products.filter((item) =>
        products.includes(item.value)
      );

      const selectedProductIdx = this.tabListItems.findIndex(
        (item) => item.value === this.manageProduct
      );

      if (selectedProductIdx === -1) {
        this.manageProduct = this.tabListItems[0].value;
        this.tabIdx = 0;
      } else {
        this.tabIdx = selectedProductIdx;
      }

      // this.departments = this.adminToModDetails.departments.filter(
      //   (item: any) => products.includes(item.productType)
      // );

      // this.departments = this.departments.map((item) => ({
      //   ...item,
      //   label: item.departmentLabel,
      //   value: item.department,
      // }));
      // const currentDepartments = this.departments
      //   .filter((item: any) => departmentValue?.includes(item.department))
      //   .map((item) => item.department);

      // this.userForm.patchValue({ departments: currentDepartments });
    });
  }

  getUserList() {
    this._managePermissionService
      .getAllUsers(this.entityId, {
        params: '?status=true&mention=true',
      })
      .subscribe((data) => {
        // const manageUsersValues = new UserPermissionTable().deserialize(data)
        //   .records;
        this.userList = data.users.map((item) => ({
          label: `${item.firstName} ${item.lastName}`,
          value: item.id,
        }));
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

    if (this.state === 'editUser' || this.state === 'viewUser') {
      const userConfig = this.userPermissions.find(
        (item) => item.module === config.module
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
          module: [config.module],
          label: [config.label],
          permissions: this.constructPermission(config),
          productType: [config.productType],
        })
      );
    });
    this.syncManageWithView();
  }

  syncManageWithView() {
    this.permissionConfigsFA.controls.forEach((control) => {
      const permissionControl = control.get('permissions');
      const managePermissionControl = permissionControl.get('manage');
      const viewPermissionControl = permissionControl.get('view');

      managePermissionControl.valueChanges.subscribe((res) => {
        const viewPermissionValue = viewPermissionControl.value;
        if (res && (!viewPermissionValue || viewPermissionValue !== 1)) {
          viewPermissionControl.patchValue(true);
        }
      });

      viewPermissionControl.valueChanges.subscribe((res) => {
        if (!res) {
          managePermissionControl.patchValue(false);
        }
      });
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

    tableCompRef.componentInstance.onModalClose.subscribe(
      (res: { userId?: string; isView?: boolean }) => {
        tableCompRef.close();
        if (res?.userId) {
          this.routesConfigService.navigate({
            additionalPath: managePermissionRoutes[
              res?.isView || !this.hasManagePermission ? 'viewUser' : 'editUser'
            ].route.replace(':id', res.userId),
          });
          // this.router.navigate([
          //   navRoute[res?.isView ? 'viewUser' : 'editUser'].link.replace(
          //     ':userId',
          //     res.userId
          //   ),
          // ]);
        }
      }
    );
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

    const data = this._managePermissionService.modifyPermissionDetailsForEdit({
      ...formValue,
      permissionConfigs,
    });

    const userProfileData = this._managePermissionService.modifyUserDetailsForEdit(
      formValue
    );

    const handleError = (error) => {
      this.isUpdatingPermissions = false;
    };

    const handleSuccess = (res) => {
      this.snackbarService.openSnackBarAsText(
        this.updateMessage[this.state],
        '',
        { panelClass: 'success' }
      );
      this.isUpdatingPermissions = false;

      // if (this.state === 'editUser')
      // this.router.navigate([navRoute.userProfile.link]);
      this.routesConfigService.navigate({
        subModuleName: ModuleNames.ROLES_AND_PERMISSION,
      });
    };

    this.isUpdatingPermissions = true;

    if (this.state === 'userProfile') {
      this._managePermissionService
        .editUserDetails({
          ...userProfileData,
          status: true,
          id: this._userService.getLoggedInUserId(),
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
    this.routesConfigService.navigate({
      additionalPath: managePermissionRoutes.addNewUser.route,
    });
  }

  handleManage(event) {
    if (this.state === 'userProfile') {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  get userFormControl() {
    return this.userForm.controls as Record<keyof UserForm, AbstractControl>;
  }
}
