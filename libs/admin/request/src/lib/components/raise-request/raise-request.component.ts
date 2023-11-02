import {
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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { ModalService, SnackBarService } from 'libs/shared/material/src';
import { DateService } from '@hospitality-bot/shared/utils';
import { Subscription } from 'rxjs';
import { request } from '../../constants/request';
import { debounceTime, filter, map, startWith } from 'rxjs/operators';
import { RequestService } from '../../services/request.service';
import { Option } from '@hospitality-bot/admin/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddItemComponent } from '../add-item/add-item.component';
import { DepartmentList } from '../../data-models/request.model';
import { convertToTitleCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { ManagePermissionService } from 'libs/admin/roles-and-permissions/src/lib/services/manage-permission.service';

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
  items = [];
  priorityList = request.priority;
  isRaisingRequest = false;
  requestConfig = request;
  users = [];
  userList: Option[] = [];
  requestData: any;
  departmentList: Option[] = [];
  sidebarVisible = false;
  @Input() isSideBar = false;
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;
  constructor(
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private _requestService: RequestService,
    private adminUtilityService: AdminUtilityService,
    private _translateService: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private _modalService: ModalService,
    private _managePermissionService: ManagePermissionService,
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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      itemName: [''],
      itemCode: ['', Validators.required],
      itemId: [''],
      priority: ['', Validators.required],
      jobDuration: [''],
      remarks: ['', [Validators.maxLength(200)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      assigneeId: [''],
      cc: ['+91'],
      phoneNumber: ['' , [Validators.required, Validators.pattern('^[0-9]*$')]],
    });

    this.requestFG.get('itemCode').valueChanges.subscribe((value) => {
      const service = this.items.find((d) => d.value === value);
      this.requestFG.get('itemName').setValue(service.label);
      this.requestFG.get('itemId').setValue(service.itemId);
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
          this.requestData = response;
          this.items = response.cms_services
            .sort((a, b) => a.itemName.trim().localeCompare(b.itemName.trim()))
            .map((item) => ({
              label: item.itemName,
              value: item.itemCode,
              itemId: item.id,
              duration: item.duration,
            }));
        })
    );
  }

  listenForAddItemChanges() {
    this._requestService.refreshItemList.subscribe((res) => {
      if (res) this.initItemList();
    });
  }

  listenForItemChanges(): void {
    this.requestFG.get('itemCode').valueChanges.subscribe((value) => {
      const itemId = this.items.find((d) => d.value === value).itemId;
      this.requestFG.get('assigneeId').setValue('', { emitEvent: false });
      this.getItemDetails(itemId);
    });
  }

  getItemDetails(itemId) {
    this.$subscription.add(
      this._requestService
        .getItemDetails(this.entityId, itemId)
        .subscribe((response) => {
          const data = new DepartmentList().deserialize(
            response?.requestItemUsers
          );
          this.departmentList = data.departmentWithUsers;
        })
    );
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

    const { phoneNumber, cc, ...rest } = this.requestFG.getRawValue();
   let countryCode = cc.replace('+', '');
    const data = {
      phone: `${countryCode}${phoneNumber}`,
      ...rest,
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
    this.onRaiseRequestClose.emit(closeData);
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

  create() {
    //to open add new item pop up
    if (this.isSideBar) {
      this.sidebarVisible = true;
      const factory = this.resolver.resolveComponentFactory(AddItemComponent);
      this.sidebarSlide.clear();
      const componentRef = this.sidebarSlide.createComponent(factory);
      componentRef.instance.isSidebar = true;
      this.$subscription.add(
        componentRef.instance.onClose.subscribe((res) => {
          this.sidebarVisible = false;
        })
      );
    } else {
      // In-future pop-up will be remove from everywhere
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.width = '500px';
      dialogConfig.height = '90vh';
      const addItemCompRef = this._modalService.openDialog(
        AddItemComponent,
        dialogConfig
      );
      this.$subscription.add(
        addItemCompRef.componentInstance.onClose.subscribe(() => {
          addItemCompRef.close();
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
