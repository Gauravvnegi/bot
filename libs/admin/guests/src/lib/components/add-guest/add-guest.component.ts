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
import { max } from 'lodash';

@Component({
  selector: 'hospitality-bot-add-guest',
  templateUrl: './add-guest.component.html',
  styleUrls: ['./add-guest.component.scss'],
})
export class AddGuestComponent implements OnInit {
  hotelId: string;
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
    this.hotelId = this.globalService.hotelId;
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
      companyName: ['', [Validators.required]],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      age: ['', Validators.required],
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
          debugger;
          const birthDate = new Date(changedDOB);
          const today = new Date();
          const diff = today.getTime() - birthDate.getTime();
          this.guestForm.patchValue({
            age: Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)),
          });
        }
      )
    );
  }

  // initDefaultForm() {
  //   this.formService.agentForm &&
  //     this.formService.restoreForm(this.guestForm, 'guest');
  //   this.formService.reset();
  // }

  createCompany() {
    this.router.navigateByUrl('pages/members/company/add-company');
  }

  handleSubmit() {
    // if (this.guestForm.invalid) {
    //   this.guestForm.markAllAsTouched();
    //   this.snackbarService.openSnackBarAsText(
    //     'Invalid form: Please fix errors'
    //   );
    //   return;
    // }
    // if (!!this.agentId) {
    //   this.subscription$.add(
    //     this.manageReservationService
    //       .updateAgent(
    //         this.hotelId,
    //         {
    //           ...this.guestForm.getRawValue(),
    //           type: 'AGENT',
    //           source: 1,
    //         },
    //         {
    //           params: '?type=AGENT',
    //         }
    //       )
    //       .subscribe(this.handleSuccess, this.handleFinal)
    //   );
    // } else {
    //   this.subscription$.add(
    //     this.agentService
    //       .addAgent(
    //         this.hotelId,
    //         {
    //           ...this.guestForm.getRawValue(),
    //           type: 'AGENT',
    //           source: 1,
    //         },
    //         {
    //           params: '?type=AGENT',
    //         }
    //       )
    //       .subscribe(this.handleSuccess, this.handleFinal)
    //   );
    // }
    this.location.back();
  }

  saveForm() {
    // this.formService.companyRedirectRoute = '/pages/efrontdesk/manage-reservation/add-reservation';
    // this.route.snapshot.url.forEach((segment) => {
    //   this.formService.companyRedirectRoute += `/${segment.path}`;
    // });
    // this.formService.setForm(
    //   this.guestForm.getRawValue() as GuestType,
    //   'agent'
    // );
  }

  /**
   * @function loadMoreCompany load more company options
   */
  loadMoreCompany() {
    this.companyOffset = this.companyOffset + 10;
    // this.getCompany();
  }

  // /**
  //  * @function getCategories to get company options
  //  */
  // getCompany(): void {
  //   this.loadingCompany = true;
  //   this.subscription$.add(
  //     this.agentService
  //       .getAgentList(this.hotelId, {
  //         params: `?type=ROOM_TYPE&offset=${this.companyOffset}&limit=${this.companyLimit}`,
  //       })
  //       .subscribe(
  //         (res) => {
  //           const data = new CompanyList().deserialize(res);
  //           // .records.map((item) => ({
  //           //   label: item.name,
  //           //   value: item.id,
  //           //   price: item.price,
  //           //   currency: item.currency,
  //           // }));
  //           // this.roomTypes = [...this.roomTypes, ...data];
  //           // this.noMoreCompany = data.length < this.companyLimit;
  //         },
  //         (error) => {},
  //         () => {
  //           this.loadingCompany = false;
  //         }
  //       )
  //   );
  // }

  /**
   * @function searchCompany To search categories
   * @param text search text
   */
  searchCompany(text: string) {
    // if (text) {
    //   this.loadingCompany = true;
    //   this.libraryService
    //     .searchLibraryItem(this.hotelId, {
    //       params: `?key=${text}&type=${LibrarySearchItem.ROOM_TYPE}`,
    //     })
    //     .subscribe(
    //       (res) => {
    //         const data = res && res[LibrarySearchItem.ROOM_TYPE];
    //         this.roomTypes =
    //           data
    //             ?.filter((item) => item.status)
    //             .map((item) => {
    //               const roomType = new RoomType().deserialize(item);
    //               return {
    //                 label: roomType.name,
    //                 value: roomType.id,
    //                 price: roomType.price,
    //                 currency: roomType.currency,
    //               };
    //             }) ?? [];
    //       },
    //       (error) => {},
    //       () => {
    //         this.loadingCompany = false;
    //       }
    //     );
    // } else {
    //   this.companyOffset = 0;
    //   this.roomTypes = [];
    //   this.getRoomTypes();
    // }
  }

  /**
   * @function handleSuccess to handle network success
   */
  handleSuccess = () => {
    this.loading = false;
    this.snackbarService.openSnackBarAsText('Guest added successfully', '', {
      panelClass: 'success',
    });
  };

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
