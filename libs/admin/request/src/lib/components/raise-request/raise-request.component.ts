import {
  Compiler,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Option, manageMaskZIndex } from '@hospitality-bot/admin/shared';
import { DateService } from '@hospitality-bot/shared/utils';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AddGuestComponent } from 'libs/admin/guests/src/lib/components';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { request } from '../../constants/request';
import { RequestService } from '../../services/request.service';
import { CreateServiceItemComponent } from 'libs/admin/service-item/src/lib/components/create-service-item/create-service-item.component';

@Component({
  selector: 'hospitality-bot-raise-request',
  templateUrl: './raise-request.component.html',
  styleUrls: ['./raise-request.component.scss'],
})
export class RaiseRequestComponent implements OnInit, OnDestroy {
  @Output() onCloseSidebar = new EventEmitter();
  requestFG: FormGroup;
  globalQueries = [];
  searchFG: FormGroup;
  entityId: string;
  reservation = {};
  $subscription = new Subscription();
  items = [];
  priorityList = request.priority;
  isRaisingRequest = false;
  requestConfig = request;
  users = [];
  userList: Option[] = [];
  requestData: any;
  departmentList: Option[] = [];
  assigneeList: Option[] = [];
  sidebarVisible = false;
  isAssigneeList: boolean = false;
  @Input() isSidebar: boolean = false;
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;
  selectedGuest;
  loadingServiceItem: boolean = false;

  constructor(
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private _requestService: RequestService,
    private adminUtilityService: AdminUtilityService,
    private compiler: Compiler,
    private resolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
    this.listenForRoomNumberChanges();
    this.listenForItemChanges();
    this.listenForAddItemChanges();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [...data['dateRange'].queryValue];

        this.entityId = this.globalFilterService.entityId;
        this.initItemList();
      })
    );
  }

  /**
   * @function initFG To initialize FormGroup.
   */
  initFG(): void {
    this.requestFG = this.fb.group({
      roomNo: ['', Validators.required],
      // firstName: ['', Validators.required],
      // lastName: ['', Validators.required],
      itemName: [''],
      itemCode: ['', Validators.required],
      itemId: [''],
      priority: ['', Validators.required],
      jobDuration: [''],
      remarks: ['', [Validators.maxLength(200)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      assigneeId: ['', [Validators.required]], //as per BE ()
      // cc: ['+91'],
      // phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      guestId: [''],
    });
  }
  /**
   * @function initItemList To init Item List.
   */
  initItemList(): void {
    this.loadingServiceItem = true;
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          status: true,
          limit: '0',
          offset: '0',
          categoryStatus: true,
        },
      ]),
    };
    this.$subscription.add(
      this._requestService.getCMSServices(this.entityId, config).subscribe(
        (response) => {
          this.requestData = response;
          this.items = response.records
            .sort((a, b) => a.itemName.trim().localeCompare(b.itemName.trim()))
            .map((item) => ({
              label: item.itemName,
              value: item.itemCode,
              itemId: item.id,
            }));
        },
        ({ error }) => {
          this.loadingServiceItem = false;
        },
        () => {
          this.loadingServiceItem = false;
        }
      )
    );
  }

  listenForAddItemChanges() {
    this._requestService.refreshItemList.subscribe((res) => {
      if (res) this.initItemList();
    });
  }

  listenForItemChanges(): void {
    this.requestFG.get('itemCode').valueChanges.subscribe((value) => {
      if (value) {
        let service = this.items.find((d) => d.value === value);
        this.requestFG.get('itemName').setValue(service?.label);
        this.requestFG.get('itemId').setValue(service?.itemId);
        this.requestFG.get('assigneeId').setValue('', { emitEvent: false });
        this.getItemDetails(service?.itemId);
      }
    });
  }
  getItemDetails(itemId) {
    this.$subscription.add(
      this._requestService
        .getItemDetails(this.entityId, itemId)
        .subscribe((response) => {
          this.isAssigneeList = !!response?.requestItemUsers?.length;
          if (!this.isAssigneeList)
            this.requestFG.get('assigneeId').clearValidators();
          else
            this.requestFG
              .get('assigneeId')
              .setValidators([Validators.required]);
          this.requestFG.get('assigneeId').updateValueAndValidity();
          this.assigneeList = response.requestItemUsers.map((user) => {
            return {
              label: `${user.firstName} ${user.lastName}`,
              value: user.userId,
            };
          });

          // const data = new DepartmentList().deserialize(
          //   response?.requestItemUsers
          // );
          // this.departmentList = data.departmentWithUsers;
        })
    );
  }

  /**
   * @function raiseRequest To raise request.
   */
  raiseRequest(): void {
    if (this.requestFG.invalid) {
      this.snackbarService.openSnackBarAsText(
        'Invalid Form: Please fix the errors'
      );
      this.requestFG.markAllAsTouched();
      return;
    }

    const { phoneNumber, cc, ...rest } = this.requestFG.getRawValue();
    // let countryCode = cc?.replace('+', '');
    const data = {
      // phone: `${countryCode}${phoneNumber}`,
      ...rest,
      systemDateTime: DateService.currentDate('DD-MMM-YYYY HH:mm:ss'),
      sender: request.kiosk,
      propertyID: '1',
    };

    this.isRaisingRequest = true;
    this.$subscription.add(
      this._requestService.createRequest(this.entityId, data).subscribe(
        (response) => {
          this.snackbarService.openSnackBarAsText(
            'Request Created Successfully',
            '',
            {
              panelClass: 'success',
            }
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
    this.onCloseSidebar.emit(closeData);
  }

  /**
   * @function listenForRoomNumberChanges To listen for room number field value change.
   */
  listenForRoomNumberChanges(): void {
    this.requestFG
      .get('roomNo')
      .valueChanges.pipe(debounceTime(1000))
      .subscribe((response) => {
        this.requestFG.patchValue(
          {
            roomNo: response,
          },
          {
            emitEvent: false,
          }
        );
        if (response?.length >= 3)
          this.$subscription.add(
            this._requestService
              .searchBooking(
                this.adminUtilityService.makeQueryParams([
                  {
                    roomNo: response,
                  },
                ])
              )
              .subscribe((res) => {
                if (res) {
                  const guestData = res?.guestDetails?.primaryGuest;
                  this.requestFG.get('guestId').setValue(guestData.id);

                  this.selectedGuest = {
                    label: `${guestData.firstName} ${guestData.lastName}`,
                    value: guestData.id,
                  };
                }
              })
          );
        else this.reservation = {};
      });
  }

  create() {
    const lazyModulePromise = import(
      'libs/admin/service-item/src/lib/admin-service-item.module'
    )
      .then((module) => {
        return this.compiler.compileModuleAsync(module.AdminServiceItemModule);
      })
      .catch((error) => {
        console.error('Error loading the lazy module:', error);
      });

    lazyModulePromise.then(() => {
      this.sidebarVisible = true;
      const factory = this.resolver.resolveComponentFactory(
        CreateServiceItemComponent
      );
      this.sidebarSlide.clear();
      const componentRef = this.sidebarSlide.createComponent(factory);
      componentRef.instance.isSidebar = true;

      this.$subscription.add(
        componentRef.instance.onCloseSidebar.subscribe((res) => {
          if (res) {
            this.initItemList();
            this.requestFG.patchValue(
              {
                itemCode: res.itemCode,
                itemId: res?.id,
                itemName: res?.itemName,
                assigneeId: '',
              },
              { emitEvent: false }
            );
            this.getItemDetails(res?.id);
          }
          this.sidebarVisible = false;
        })
      );

      manageMaskZIndex();
    });
  }

  getConfig(type = 'get') {
    if (type === 'search') return { type: 'GUEST' };
    const queries = {
      entityId: this.entityId,
      toDate: this.globalQueries[0].toDate,
      fromDate: this.globalQueries[1].fromDate,
      entityState: 'ALL',
      type: 'GUEST,NON_RESIDENT_GUEST',
    };
    return queries;
  }
  z;
  guestChange(event) {
    this.selectedGuest = {
      label: `${event.firstName} ${event.lastName}`,
      value: event.id,
    };
  }

  onAddGuest() {
    this.sidebarVisible = true;
    const factory = this.resolver.resolveComponentFactory(AddGuestComponent);
    this.sidebarSlide.clear();
    const componentRef = this.sidebarSlide.createComponent(factory);
    componentRef.instance.isSidebar = true;
    componentRef.instance.guestType = 'NON_RESIDENT_GUEST';
    this.$subscription.add(
      componentRef.instance.onCloseSidebar.subscribe((res) => {
        if (res) {
          this.selectedGuest = {
            label: `${res.firstName} ${res.lastName}`,
            value: res.id,
          };
        }
        this.sidebarVisible = false;
      })
    );
    manageMaskZIndex();
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
