import { Option } from 'libs/admin/shared/src/lib/types/form.type';
import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { seatedChips, seatedTabGroup } from '../../constants/guest-list.const';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GuestCard } from '../guest-card/guest-card.component';
import { ChipType, TabsType } from '../../types/guest.type';
import { AddGuestListComponent } from '../add-guest-list/add-guest-list.component';
import {
  AdminUtilityService,
  QueryConfig,
  manageMaskZIndex,
} from '@hospitality-bot/admin/shared';
import { Subscription, of } from 'rxjs';
import { OutletTableService } from '../../services/outlet-table.service';
import {
  GuestReservation,
  GuestReservationList,
} from '../../models/guest-reservation.model';
import { debounce } from 'lodash';
import { debounceTime, switchMap } from 'rxjs/operators';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';

@Component({
  selector: 'hospitality-bot-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.scss'],
})
export class GuestListComponent implements OnInit {
  readonly chipEnum = ChipType;
  readonly tabEnum = TabsType;
  readonly seatedChips: Option<ChipType>[] = seatedChips;
  readonly seatedTabGroup: Option<TabsType>[] = seatedTabGroup;
  paginationDisabled: boolean = false;
  seatedGuestList: GuestReservation[] = [];
  waitListGuestList: GuestReservation[] = [];

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

  constructor(
    private fb: FormBuilder,
    private componentFactoryResolver: ComponentFactoryResolver,
    private outletService: OutletTableService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initGuestReservation();
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

  initGuestReservation(): void {
    this.loading = true;

    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: 'OUTLET',
          outletType: 'RESTAURANT',
          fromDate: new Date().getTime(),
          pagination: false,
        },
      ]),
    };

    this.$subscription.add(
      this.outletService.getGuestReservationList(config).subscribe(
        (response) => {
          const data = new GuestReservationList().deserialize(response);
          this.backupData = data.records;

          this.initGuestList(data?.records);
          this.paginationDisabled = this.limit > data?.total;
        },
        this.handelError,
        this.handelFinal
      )
    );
  }

  initGuestList(data) {
    data?.forEach((record) => {
      if (record.isSeated) {
        this.seatedGuestList.push(record);
      } else {
        this.waitListGuestList.push(record);
      }
    });
    this.guestList = this.seatedGuestList;
  }

  setChip(event: Option) {
    this.useForm.patchValue(
      { search: '', chip: ChipType[event.value] },
      { emitEvent: false }
    );

    if (event.value === 'waitlist') {
      this.guestList = this.waitListGuestList;
    } else {
      this.guestList = this.seatedGuestList;
    }
  }

  tabChange(event: { index: number }) {
    this.loading = true;
    const activeTab = TabsType[Object.keys(TabsType)[event.index]] as TabsType;
    this.useForm.patchValue(
      { search: '', tab: activeTab },
      { emitEvent: false }
    );

    if (activeTab === TabsType.all) {
      this.initGuestReservation();
      return;
    }

    this.guestList = this.backupData.filter(
      (data) => data.type === (activeTab as TabsType)
    );
    this.initGuestList(this.guestList);

    this.loading = false;
  }
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

  onEditGuestReservation(data: GuestReservation) {
    this.openAddGuest(data?.id);
  }

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

    const closeSubscription = instance.onClose.subscribe((res: any) => {
      this.initGuestReservation();
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

  onMarkSeated(event, guest: GuestReservation) {
    event.stopPropagation();

    this.$subscription.add(
      this.outletService
        .markSeated(guest.id, {
          params: `?type=OUTLET&outletType=RESTAURANT&entityId=${this.entityId}`,
        })
        .subscribe(
          (res) => {
            this.snackbarService.openSnackBarAsText(
              'Reservation is marked seated successfully',
              '',
              { panelClass: 'success' }
            );
          },
          this.handelError,
          this.handelFinal
        )
    );
  }

  onTableChange(event, guest: GuestReservation) {
    event.stopPropagation();
    this.openAddGuest(guest.id);
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

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
