import { Component, OnInit } from '@angular/core';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { manageReservationRoutes } from '../../constants/routes';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { CompanyList } from 'libs/admin/agent/src/lib/models/agent.model';
import { FormService } from 'libs/admin/members/src/lib/services/form.service';
import CustomValidators from 'libs/admin/shared/src/lib/utils/validators';
import { Subscription } from 'rxjs';
import { GuestType } from '../../types/forms.types';

@Component({
  selector: 'hospitality-bot-add-guest',
  templateUrl: './add-guest.component.html',
  styleUrls: ['./add-guest.component.scss'],
})
export class AddGuestComponent implements OnInit {
  hotelId: string;
  agentId: string;
  pageTitle: string;
  navRoutes: NavRouteOptions;
  packageCode: string = '# will be auto generated';

  guestForm: FormGroup;

  routes = manageReservationRoutes;
  loading = false;
  subscription$ = new Subscription();

  /* roomTypes options variable */
  companyOffset = 0;
  loadingCompany = false;
  noMoreCompany = false;
  companyLimit = 10;

  roomTypes = [];

  commissionTypes: Option[] = [{ label: '%OFF', value: 'PERCENTAGE' }];
  constructor(
    private fb: FormBuilder,
    private manageReservationService: ManageReservationService,
    private globalService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.agentId = this.route.snapshot.paramMap.get('id');
    const { navRoutes, title } = manageReservationRoutes['addGuest'];
    this.navRoutes = navRoutes;
    this.pageTitle = title;
  }

  ngOnInit(): void {
    this.hotelId = this.globalService.hotelId;
    this.initGuestForm();
    // this.initDefaultForm();
  }

  initGuestForm() {
    this.guestForm = this.fb.group({
      active: [true],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cc: ['+91'],
      phoneNo: [null, [Validators.required]],
      companyName: ['', [Validators.required]],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      age: ['', Validators.required],
    });
  }

  // initDefaultForm() {
  //   this.formService.agentForm &&
  //     this.formService.restoreForm(this.guestForm, 'guest');
  //   this.formService.reset();
  // }

  createCompany() {}

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
  }

  reset() {
    this.guestForm.patchValue({
      firstName: '',
      email: '',
      phoneNo: '',
      companyName: '',
      address: '',
      gender: '',
      dateOfBirth: '',
      age: '',
    });
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
