import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  QueryConfig,
  manageMaskZIndex,
  openModal,
} from '@hospitality-bot/admin/shared';
import { DateFilterOption } from 'libs/admin/shared/src/lib/components/date-group-filter/date-group-filter.component';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { Option } from 'libs/admin/shared/src/lib/types/form.type';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { chipsFilter, seatedTabGroup } from '../../constants/guest-list.const';
import {
  GuestReservation,
  GuestReservationList,
} from '../../models/guest-reservation.model';
import { OutletTableService } from '../../services/outlet-table.service';
import { ChipType, TabsType } from '../../types/guest.type';
import { AddGuestListComponent } from '../add-guest-list/add-guest-list.component';

@Component({
  selector: 'hospitality-bot-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.scss'],
})
export class GuestListComponent implements OnInit {
  readonly chipEnum = ChipType;
  readonly tabEnum = TabsType;
  readonly chipsFilter: Option<ChipType>[] = chipsFilter;
  readonly seatedTabGroup: Option<TabsType>[] = seatedTabGroup;
  paginationDisabled: boolean = false;
  seatedGuestList: GuestReservation[] = [];
  waitListGuestList: GuestReservation[] = [];
  selectedDateFilterIndex: number = 0;
  tabFilterSelectedIndex: number = 0;

  dateFilterOption: DateFilterOption;

  entityId: string;

  limit: number = 20;
  offset: number = 0;

  private $subscription = new Subscription();

  useForm: FormGroup;
  @Output() onClose = new EventEmitter<boolean>();

  sidebarVisible = false;
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;
  loading = false;

  backupData: GuestReservation[];
  guestList: GuestReservation[] = [];

  activeIndex: number = 0;

  constructor(
    private fb: FormBuilder,
    private componentFactoryResolver: ComponentFactoryResolver,
    private outletService: OutletTableService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.searchGuest();
  }

  initForm() {
    this.entityId = this.globalFilterService.entityId;
    this.useForm = this.fb.group({
      search: [],
      chip: [ChipType.seated],
      tab: [TabsType.all],
    });
  }

  /**
   * on DateFilterChanges
   */
  onDateFilterChange(config: { data: DateFilterOption; index: number }) {
    this.dateFilterOption = config.data;
    this.selectedDateFilterIndex = config.index;
    this.initGuestReservation();
  }

  /**
   * get the guest reservation
   */
  initGuestReservation(): void {
    this.loading = true;

    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: 'OUTLET',
          outletType: 'RESTAURANT',
          pagination: false,
          fromDate: this.dateFilterOption.from,
          toDate: this.dateFilterOption.to,
          entityState: this.useForm.get('chip').value,
          guestType: this.getTabConfig(this.useForm.get('tab').value),
        },
      ]),
    };

    this.$subscription.add(
      this.outletService.getGuestReservationList(config).subscribe(
        (response) => {
          const data = new GuestReservationList().deserialize(response);
          this.guestList = data.records;
          this.backupData = data.records;
          // this.paginationDisabled = this.limit > data?.total;
        },
        this.handelError,
        this.handelFinal
      )
    );
  }

  getTabConfig(tabConfig: TabsType) {
    switch (tabConfig) {
      case TabsType.all:
        return 'NON_RESIDENT_GUEST,GUEST';
      case TabsType.resident:
        return 'GUEST';
      case TabsType['non-resident']:
        return 'NON_RESIDENT_GUEST';
    }
  }

  /**
   * on chips change
   *
   * set chips in form and change th
   */
  setChip(event: Option) {
    this.useForm.patchValue(
      { search: '', chip: event.value },
      { emitEvent: false }
    );

    this.activeIndex = this.chipsFilter.findIndex(
      (chips) => chips.value === event.value
    );

    this.initGuestReservation();
  }

  /**
   * @function tabChange
   * @param event
   * @returns
   */
  tabChange(event: { index: number }) {
    this.tabFilterSelectedIndex = event.index;
    const activeTab = TabsType[Object.keys(TabsType)[event.index]] as TabsType;
    this.useForm.patchValue(
      { search: '', tab: activeTab },
      { emitEvent: false }
    );

    this.initGuestReservation();
  }

  /**
   * @function searchGuest
   * @description search for a guest
   */
  searchGuest() {
    this.loading = true;
    this.useForm
      .get('search')
      .valueChanges.pipe(
        debounceTime(1000),
        switchMap((searchTerm) => {
          searchTerm = searchTerm?.toLowerCase();

          const filteredValues = this.backupData.filter(
            (guest) =>
              guest?.name?.toLowerCase()?.includes(searchTerm) ||
              guest?.tableNo?.toLowerCase()?.includes(searchTerm) ||
              guest?.orderNo?.toLowerCase()?.includes(searchTerm)
          );
          return of(filteredValues);
        })
      )
      .subscribe(
        (results) => (this.guestList = results),
        this.handelError,
        this.handelFinal
      );
  }

  /**
   * @function onEditGuestReservation
   * @param data
   */
  onEditGuestReservation(data: GuestReservation) {
    this.openAddGuest(data?.id);
  }

  /**
   * @function openAddGuest
   * @param id
   * @description to open add guest side bar
   */
  openAddGuest(id?: string) {
    this.sidebarSlide.clear();
    this.sidebarVisible = true;
    manageMaskZIndex();
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      AddGuestListComponent
    );
    const componentRef = this.sidebarSlide.createComponent(factory);
    const instance: AddGuestListComponent = componentRef.instance;
    instance.guestReservationId = id && id;

    const closeSubscription = instance.onClose.subscribe((res: boolean) => {
      if (res) {
        this.resetFilterAndTab();
      }
      componentRef.destroy();
      closeSubscription.unsubscribe();
      this.sidebarVisible = false;
    });
  }

  get isSeated() {
    return this.useForm.get('chip').value == this.chipEnum.seated;
  }

  loadMore() {
    if (!this.paginationDisabled) {
      // this.limit = this.limit + 20;
      // this.initGuestReservation();
    }
  }

  onPrintInvoice(event) {
    event.stopPropagation();
  }

  handelQuickCTA(event, reservation: GuestReservation, type: HandelQuickCTA) {
    event.stopPropagation();
    switch (type) {
      case 'SEATED':
        this.updateReservation(reservation.id, {
          currentJourney: 'SEATED',
        });
        break;
      case 'DELETE':
        this.openDeletePopup(reservation.id);
    }
  }

  updateReservation(
    reservationId: string,
    data,
    endPoints = 'updateBookingStatus'
  ) {
    this.$subscription.add(
      this.outletService[endPoints](
        reservationId,
        {
          params: `?type=OUTLET&outletType=RESTAURANT&entityId=${this.entityId}`,
        },
        data
      ).subscribe(
        (res) => {
          this.snackbarService.openSnackBarAsText(
            'Reservation is updated successfully',
            '',
            { panelClass: 'success' }
          );
          this.resetFilterAndTab();
        },
        this.handelError,
        this.handelFinal
      )
    );
  }

  resetFilterAndTab() {
    this.useForm.patchValue({
      search: '',
      chip: ChipType.seated,
      tab: TabsType.all,
    });

    this.tabFilterSelectedIndex = 0; //reset tab filter selection
    this.activeIndex = 0; //need to refactor bot chips component
    this.selectedDateFilterIndex === 0
      ? this.initGuestReservation()
      : (this.selectedDateFilterIndex = 0); //reset date filter
  }

  onTableChange(event, guest: GuestReservation) {
    event.stopPropagation();
    this.openAddGuest(guest.id);
  }

  openDeletePopup(reservationId: string): void {
    let modalRef: DynamicDialogRef;

    const data = {
      content: {
        heading: `Mark Reservation As Cancelled`,
        descriptions: [
          `You are about to mark this reservation as Cancelled`,
          `Are you Sure?`,
        ],
        isRemarks: true,
      },
      actions: [
        {
          label: 'Cancel',
          onClick: () => {
            modalRef.close();
          },
          variant: 'outlined',
        },
        {
          label: 'Yes',
          type: 'SUCCESS',
          onClick: (modelData) => {
            this.updateReservation(
              reservationId,
              {
                status: 'CANCELED',
                remarks: modelData.remarks,
              },
              'cancelReservation'
            );
            modalRef.close();
          },
          variant: 'contained',
        },
      ],
    };

    modalRef = openModal({
      config: {
        width: '35vw',
        styleClass: 'confirm-dialog',
        data: data,
      },
      component: ModalComponent,
      dialogService: this.dialogService,
    });
  }

  close() {
    this.onClose.emit(true);
  }

  trackGuest(index: number, guest: GuestReservation) {
    return guest.id;
  }

  handelError = ({ error }) => {
    this.loading = false;
  };

  handelFinal = () => {
    this.loading = false;
  };

  get isFilterHidden() {
    return this.useForm?.get('search')?.value?.length > 0;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}

export type HandelQuickCTA = 'SEATED' | 'DELETE';
