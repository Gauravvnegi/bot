import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { manageGuestRoutes } from '../../constant/routes';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavRouteOptions, Option, Regex } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { GuestTableService } from '../../services/guest-table.service';
import { GuestFactory } from '../../data-models/guest.model';
import { FormService } from 'libs/admin/shared/src/lib/services/form.service';
import { GuestFormType } from 'libs/admin/agent/src/lib/types/form.types';
import { GuestType, GuestTypes } from '../../types/guest.type';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { RoutesConfigService } from 'apps/admin/src/app/core/theme/src/lib/services/routes-config.service';

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
  isSidebar = false;
  sidebarVisible = false;
  @Output() onCloseSidebar = new EventEmitter<GuestType | boolean>(false);
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;
  selectedMember: Option;
  guestType: GuestTypes = 'NON_RESIDENT_GUEST';

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private guestService: GuestTableService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private formService: FormService,
    private routesConfigService: RoutesConfigService
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
      address: ['', [Validators.required]],
      type: [this.guestType],
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
        'Please check data and try again !'
      );
      return;
    }
    this.loading = true;
    const formData = GuestFactory.mapFormData(this.guestForm.getRawValue());
    const queryParams = {
      params: `?type=${this.guestType}&entityId=${this.entityId}`,
    };
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

          if (this.isSidebar) {
            this.onCloseSidebar.emit(res);
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
    this.onCloseSidebar.emit(true);
  }

  /**
   * Unsubscribe when component is getting removed
   */
  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
