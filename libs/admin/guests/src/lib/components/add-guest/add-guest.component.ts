import { Component, OnInit } from '@angular/core';
import { manageGuestRoutes } from '../../constant/route';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { NavRouteOptions, Option, Regex } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { GuestTableService } from '../../services/guest-table.service';
import { GuestFactory } from '../../data-models/guest.model';

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

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private guestService: GuestTableService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
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
  }

  initGuestForm() {
    this.guestForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(60)]],
      lastName: ['', [Validators.required, Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.pattern(Regex.EMAIL_REGEX)]],
      cc: ['+91'],
      phoneNo: [null, [Validators.required]],
      company: ['', [Validators.required]],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      age: [{ value: '', disabled: true }, Validators.required],
    });
  }
  initEditView() {
    this.guestId &&
      ((this.loading = true),
      this.subscription$.add(
        this.guestService.getGuestById(this.guestId).subscribe((res) => {
          GuestFactory.patchEditView(this.guestForm, res);
          this.loading = false;
        }, this.handleFinal)
      ));
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

  createNewCompany() {
    this.router.navigateByUrl('pages/members/company/add-company');
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
          this.location.back();
        },
        (error) => {
          this.loading = false;
        },
        this.handleFinal
      )
    );
  }

  /**
   * @function handleFinal
   */
  handleFinal = () => {
    this.loading = false;
  };

  /**
   * Unsubscribe when component is getting removed
   */
  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
