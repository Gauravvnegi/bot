import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { IList, List, Topics } from '../../data-models/listing.model';
import { ListingService } from '../../services/listing.service';
import { TranslateService } from '@ngx-translate/core';
import {
  AdminUtilityService,
  ModuleNames,
  NavRouteOptions,
  Option,
} from 'libs/admin/shared/src';
import { listingRoutes } from '../../constants/routes';
import { ContactDatatableComponent } from '../datatable/contact-datatable/contact-datatable.component';

@Component({
  selector: 'hospitality-bot-edit-listing',
  templateUrl: './edit-listing.component.html',
  styleUrls: ['./edit-listing.component.scss'],
})
export class EditListingComponent implements OnInit, OnDestroy {
  listFG: FormGroup;
  listData: IList;
  entityId: string;
  listId: string;
  isSaving = false;
  loading = false;
  globalQueries = [];
  topicList: Option[] = [];

  pageTitle = 'Create Listing';
  navRoutes: NavRouteOptions = [];
  private $subscription = new Subscription();
  @ViewChild(ContactDatatableComponent) listenReset: ContactDatatableComponent;

  constructor(
    private _fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private _listingService: ListingService,
    private snackbarService: SnackBarService,
    private activatedRoute: ActivatedRoute,
    protected _translateService: TranslateService,
    private adminUtilityService: AdminUtilityService,
    private routesConfigService: RoutesConfigService
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initFG(): void {
    this.listFG = this._fb.group({
      id: [''],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      marketingContacts: [[]],
      active: [true],
    });
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.entityId = this.globalFilterService.entityId;
        this.getListingId();
      })
    );
  }

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes, ...this.navRoutes];
    });
  }

  /**
   * @function getListingId To get listing Id from routes query param.
   */
  getListingId(): void {
    this.$subscription.add(
      this.activatedRoute.params.subscribe((params) => {
        if (params['id']) {
          this.listId = params['id'];
          this.getListDetails(this.listId);
        }
        const { navRoutes, title } = listingRoutes[
          this.listId ? 'editListing' : 'createListing'
        ];
        this.pageTitle = title;
        this.navRoutes = navRoutes;
        this.initNavRoutes();
      })
    );
  }

  /**
   * @function getListDetails To get the listing details.
   * @param id The id for which edit action will be done.
   */
  getListDetails(id) {
    this.loading = true;
    this.$subscription.add(
      this._listingService.getListById(this.entityId, id).subscribe(
        (response) => {
          this.loading = false;
          this.listData = new List().deserialize(response, 0);
          this.listFG.patchValue(this.listData);
        },
        ({ error }) => {
          this.loading = false;
        }
      )
    );
  }

  resetForm() {
    this.listFG.reset();
    this.listenReset.values = [];
    this.listenReset.dataSource = [];
  }

  handleSubmit() {
    this.listFG.markAllAsTouched();
    if (this.listId) this.updateList();
    else this.createList();
  }

  /**
   * @function createList To create a new listing record.
   */
  createList() {
    if (
      this.listFG.invalid ||
      this.listFG.get('marketingContacts')?.value?.length === 0
    ) {
      this.snackbarService
        .openSnackBarWithTranslate(
          {
            translateKey: `message.validation.INVALID_FORM`,
            priorityMessage: 'Please check data and try again !',
          },
          ''
        )
        .subscribe();
      return;
    }
    const data = this.listFG.getRawValue();
    data.marketingContacts = data.marketingContacts.map((contact) => {
      const {
        firstName,
        lastName,
        salutation,
        companyName,
        mobile,
        email,
      } = contact;
      return {
        firstName,
        lastName,
        salutation,
        companyName,
        mobile,
        email,
      };
    });
    this.isSaving = true;
    this._listingService.createList(this.entityId, data).subscribe(
      (response) => {
        this.snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: 'message.success.listing_created',
              priorityMessage: `${response.name} is Created.`,
            },
            '',
            {
              panelClass: 'success',
            }
          )
          .subscribe();
        this.routesConfigService.goBack();
      },
      ({ error }) => {
        this.isSaving = false;
      },
      () => (this.isSaving = false)
    );
  }

  /**
   * @function updateList To update listing record.
   */
  updateList() {
    if (
      this.listFG.invalid ||
      this.listFG.get('marketingContacts')?.value?.length === 0
    ) {
      this.snackbarService
        .openSnackBarWithTranslate(
          {
            translateKey: `message.validation.INVALID_FORM`,
            priorityMessage: 'Please check data and try again !',
          },
          ''
        )
        .subscribe();
      return;
    }
    const data = this.listFG.getRawValue();
    data.marketingContacts = data.marketingContacts.map((contact) => {
      const {
        firstName,
        lastName,
        salutation,
        companyName,
        mobile,
        email,
      } = contact;
      return {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        salutation,
        companyName,
        mobile,
        email,
      };
    });
    this.isSaving = true;
    this._listingService.updateList(this.entityId, this.listId, data).subscribe(
      (response) => {
        this.snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: 'message.success.listing_updated',
              priorityMessage: `${response.name} Updated Successfully.`,
            },
            '',
            { panelClass: 'success' }
          )
          .subscribe();
        this.routesConfigService.goBack();
      },
      ({ error }) => {
        this.isSaving = false;
      },
      () => (this.isSaving = false)
    );
  }

  /**
   * @function updateContactList To update contact list.
   * @param event The event for which updation will be done.
   */
  updateContactList(event) {
    this.listFG.markAllAsTouched();
    if (event?.add && !this.listId)
      this.listFG.patchValue({ marketingContacts: event.data });
    else this.getListDetails(this.listId);
  }
  createTopic() {
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.TOPIC,
      additionalPath: 'create-topic',
      queryParams: {
        entityId: this.entityId,
      },
    });
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
