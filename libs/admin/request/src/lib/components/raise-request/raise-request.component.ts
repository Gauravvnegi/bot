import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { DateService } from '@hospitality-bot/shared/utils';
import { Subscription } from 'rxjs';
import { request } from '../../constants/request';
import { debounceTime, filter, map, startWith } from 'rxjs/operators';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'hospitality-bot-raise-request',
  templateUrl: './raise-request.component.html',
  styleUrls: ['./raise-request.component.scss'],
})
export class RaiseRequestComponent implements OnInit, OnDestroy {
  @Output() onRaiseRequestClose = new EventEmitter();
  requestFG: FormGroup;
  searchFG: FormGroup;
  entityId: string;
  reservation = {};
  $subscription = new Subscription();
  cmsServices = [];
  priorityList = request.priority;
  filteredCMSServiceOptions;
  isRaisingRequest = false;
  requestConfig = request;
  constructor(
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private _requestService: RequestService,
    private adminUtilityService: AdminUtilityService,
    private _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
    this.listenForRoomNumberChanges();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.entityId = this.globalFilterService.entityId;
        this.initItemList();
      })
    );
  }

  listenForItemNameChange() {
    this.filteredCMSServiceOptions = this.requestFG
      .get('itemName')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.cmsServices.filter((option) =>
      option.itemName.toLowerCase().includes(filterValue)
    );
  }

  /**
   * @function initFG To initialize FormGroup.
   */
  initFG(): void {
    this.requestFG = this.fb.group({
      roomNo: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      itemName: ['', Validators.required],
      itemCode: ['', Validators.required],
      priority: ['', Validators.required],
      jobDuration: [''],
      remarks: ['', [Validators.maxLength(200)]],
      quantity: [1],
    });
    this.searchFG = this.fb.group({
      search: [''],
    });
  }

  /**
   * @function initItemList To init Item List.
   */
  initItemList(): void {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        { entityType: request.cmsServices },
      ]),
    };
    this.$subscription.add(
      this._requestService
        .getCMSServices(this.entityId, config)
        .subscribe((response) => {
          this.cmsServices = response.cms_services.sort((a, b) =>
            a.itemName.trim().localeCompare(b.itemName.trim())
          );
          this.listenForItemNameChange();
        })
    );
  }

  /**
   * @function handleItemNameChange To handle item name value change.
   * @param event The MatSelectionChange event.
   */
  handleItemNameChange(event): void {
    const service = this.cmsServices.filter(
      (d) => d.itemName === event.option.value
    )[0];
    this.requestFG.get('itemCode').setValue(service.itemCode);
    this.requestFG.get('jobDuration').setValue(parseInt(service.duration));
  }

  /**
   * @function raiseRequest To raise request.
   */
  raiseRequest(): void {
    if (this.requestFG.invalid) {
      this._translateService.get('error.fillAllDetails').subscribe((message) =>
        this.snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: 'messages.error.some_thing_wrong',
              priorityMessage: message,
            },
            ''
          )
          .subscribe()
      );
      this.requestFG.markAllAsTouched();
      return;
    }

    const data = {
      ...this.requestFG.getRawValue(),
      systemDateTime: DateService.currentDate('DD-MMM-YYYY HH:mm:ss'),
      sender: request.kiosk,
      propertyID: '1',
    };
    this.isRaisingRequest = true;
    this.$subscription.add(
      this._requestService.createRequest(this.entityId, data).subscribe(
        (response) => {
          this._translateService
            .get('success.requestCreated')
            .subscribe((message) =>
              this.snackbarService
                .openSnackBarWithTranslate(
                  {
                    translateKey: 'success.requestCreated',
                    priorityMessage: message,
                  },
                  '',
                  {
                    panelClass: 'success',
                  }
                )
                .subscribe()
            );
          this.isRaisingRequest = false;
          this.close({ status: false, data: this.reservation, load: true });
        },
        ({ error }) => {
          this.isRaisingRequest = false;
        }
      )
    );
  }

  /**
   * @function close To close the raise request modal.
   * @param closeData The status and reservation data.
   */
  close(closeData: { status: boolean; data?; load: boolean }): void {
    console.log(closeData);
    this.onRaiseRequestClose.emit(closeData);
  }

  /**
   * @function listenForRoomNumberChanges To listen for room number field value change.
   */
  listenForRoomNumberChanges(): void {
    const formChanges$ = this.searchFG.valueChanges.pipe(
      filter(() => !!(this.searchFG.get('search') as FormControl).value)
    );

    formChanges$.pipe(debounceTime(1000)).subscribe((response) => {
      this.requestFG.patchValue({
        roomNo: response.search,
      });
      if (response?.search.length >= 3)
        this.$subscription.add(
          this._requestService
            .searchBooking(
              this.adminUtilityService.makeQueryParams([
                {
                  roomNo: response?.search,
                },
              ])
            )
            .subscribe((res) => {
              if (res) {
                this.reservation = res;
                this.requestFG.patchValue({
                  firstName: res.guestDetails.primaryGuest.firstName,
                  lastName: res.guestDetails.primaryGuest.lastName,
                });
                this.requestFG.get('firstName').disable();
                this.requestFG.get('lastName').disable();
              } else {
                this.reservation = {};
                this.requestFG.get('firstName').enable();
                this.requestFG.get('lastName').enable();
              }
            })
        );
      else this.reservation = {};
    });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
