import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  Compiler,
} from '@angular/core';
import { manageGuestRoutes } from '../../constant/routes';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import {
  ModuleNames,
  NavRouteOptions,
  Option,
  Regex,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { GuestTableService } from '../../services/guest-table.service';
import { GuestFactory } from '../../data-models/guest.model';
import { FormService } from 'libs/admin/shared/src/lib/services/form.service';
import { GuestFormType } from 'libs/admin/agent/src/lib/types/form.types';
import { AddCompanyComponent } from 'libs/admin/company/src/lib/components/add-company/add-company.component';
import { GuestType } from '../../types/guest.type';

@Component({
  selector: 'hospitality-bot-add-guest',
  templateUrl: './add-guest.component.html',
  styleUrls: ['./add-guest.component.scss'],
})
export class AddGuestComponent implements OnInit {
  entityId: string;
  agentId: string;
  guestId: string;

  pageTitle: string;
  navRoutes: NavRouteOptions;
  genders: Option[] = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
    { label: 'Other', value: 'OTHER' },
  ];
  packageCode: string = '# will be auto generated';

  guestForm: FormGroup;

  routes = manageGuestRoutes;
  loading = false;
  subscription$ = new Subscription();
  routeSubscription$ = new Subscription();
  /* companies options variable */
  companyOffset = 0;
  loadingCompany = false;
  noMoreCompany = false;
  companyLimit = 10;
  companies: Option[] = [];
  ageRestriction = new Date();

  //Sidebar configuration
  isSideBar = false;
  sidebarVisible = false;
  @Output() onClose = new EventEmitter<GuestType | boolean>(false);
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;
  selectedMember: Option;

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private guestService: GuestTableService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private formService: FormService,
    private routesConfigService: RoutesConfigService,
    private resolver: ComponentFactoryResolver,
    private compiler: Compiler
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalService.entityId;
    this.initGuestForm();
    this.activatedRoute.params.subscribe((params) => {
      this.guestId = params['id'];
      const { navRoutes, title } = manageGuestRoutes[
        this.guestId ? 'editGuest' : 'addGuest'
      ];
      this.navRoutes = navRoutes;
      this.pageTitle = title;
      this.initEditView();
    });
    this.listenChanges();
    this.formService.restoreForm(this.guestForm, 'guest');
    this.initNavRoutes();
  }

  initGuestForm() {
    this.guestForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(60)]],
      lastName: ['', [Validators.required, Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.pattern(Regex.EMAIL_REGEX)]],
      cc: ['+91', [Validators.required]],
      phoneNo: [null, [Validators.required]],
      company: [''],
      gender: [''],
      dateOfBirth: [''],
      age: [{ value: '', disabled: true }],
      address: [''],
    });
  }

  initEditView() {
    this.guestId &&
      ((this.loading = true),
      this.subscription$.add(
        this.guestService.getGuestById(this.guestId).subscribe((res) => {
          this.selectedMember = res?.companyId && {
            label: `${res?.company?.firstName || ''} ${
              res?.company.lastName || ''
            }`,
            value: res?.companyId,
          };
          GuestFactory.patchEditView(this.guestForm, res);
          this.loading = false;
        }, this.handleFinal)
      ));

    this.formService.companyId.subscribe((res) => {
      if (res.length) this.guestForm.get('company').patchValue(res);
    });
  }

  listenChanges() {
    this.subscription$.add(
      this.guestForm.controls['dateOfBirth'].valueChanges.subscribe(
        (changedDOB) => {
          let timeDiff = Math.abs(Date.now() - changedDOB);
          this.guestForm.patchValue({
            age: Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25),
          });
        }
      )
    );
  }

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes, ...this.navRoutes];
    });
  }

  createNewCompany() {
    if (this.isSideBar) {
      this.openCompanyFromSide();
    } else {
      this.saveForm();
      this.routesConfigService.navigate({
        subModuleName: ModuleNames.COMPANY,
        additionalPath: 'add-company',
      });
    }
  }

  openCompanyFromSide() {
    const lazyModulePromise = import(
      '../../../../../company/src/lib/admin-company.module'
    )
      .then((module) => {
        return this.compiler.compileModuleAsync(module.AdminCompanyModule);
      })
      .catch((error) => {
        console.error('Error loading the lazy module:', error);
      });

    lazyModulePromise.then((moduleFactory) => {
      this.sidebarVisible = true;
      const factory = this.resolver.resolveComponentFactory(
        AddCompanyComponent
      );
      this.sidebarSlide.clear();
      const componentRef = this.sidebarSlide.createComponent(factory);
      componentRef.instance.isSideBar = true;
      componentRef.instance.onClose.subscribe((res) => {
        if (typeof res !== 'boolean') {
          this.selectedMember = {
            label: res?.companyName,
            value: res?.id,
          };
        }
        this.sidebarVisible = false;
        componentRef.destroy();
      });
    });
  }

  saveForm() {
    this.formService.companyRedirectRoute = '/pages/members/agent';
    this.activatedRoute.snapshot.url.forEach((segment) => {
      this.formService.companyRedirectRoute += `/${segment.path}`;
    });
    this.formService.setForm(
      this.guestForm.getRawValue() as GuestFormType,
      'guest'
    );
  }

  handleSubmit() {
    if (this.guestForm.invalid) {
      this.guestForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }
    this.loading = true;
    const formData = GuestFactory.mapFormData(this.guestForm.getRawValue());
    const queryParams = { params: `?type=GUEST&entityId=${this.entityId}` };
    const request = this.guestId
      ? this.guestService.updateGuest(formData, this.guestId)
      : this.guestService.addGuest(formData, queryParams);

    this.subscription$.add(
      request.subscribe(
        (res) => {
          this.snackbarService.openSnackBarAsText(
            `Guest is ${!this.guestId ? 'created' : 'edited'} successfully`,
            '',
            { panelClass: 'success' }
          );
          this.loading = false;

          if (this.isSideBar) {
            this.onClose.emit(res);
          } else {
            this.location.back();
          }
        },
        (error) => {
          this.loading = false;
        },
        this.handleFinal
      )
    );
  }

  companyChange(event) {
    if (event.id) {
      this.selectedMember = {
        label: event?.firstName,
        value: event?.id,
      };
    }
  }

  resetForm() {
    this.guestForm.reset();
  }
  /**
   * @function handleFinal
   */
  handleFinal = () => {
    this.loading = false;
  };

  closeSidebar() {
    this.onClose.emit(true);
  }

  /**
   * Unsubscribe when component is getting removed
   */
  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
