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
import { manageMaskZIndex } from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { OutletTableService } from '../../services/outlet-table.service';
import {
  GuestReservation,
  GuestReservationList,
} from '../../models/guest-reservation.model';

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

  seatedGuestList: GuestCard[] = [];
  waitListGuestList: GuestCard[] = [];

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
    private outletService: OutletTableService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initGuestReservation();
  }

  initForm() {
    this.useForm = this.fb.group({
      search: [],
      chip: [ChipType.seated],
      tab: [TabsType.all],
    });
  }

  initGuestReservation(): void {
    this.loading = true;
    this.$subscription.add(
      this.outletService.getGuestReservationList().subscribe(
        (response) => {
          const data = new GuestReservationList().deserialize(response);
          this.backupData = data.records;
          this.guestList = data.records;
        },
        this.handelError,
        this.handelFinal
      )
    );
  }

  setChip(event: Option) {
    this.useForm.patchValue(
      { search: '', chip: ChipType[event.value] },
      { emitEvent: false }
    );
    /**
     *
     * filter the guest list by chip type
     */
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

    this.loading = false;
  }

  searchGuest(event: string) {
    this.loading = false;
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

  onPrintInvoice(event) {
    event.stopPropagation();
  }

  onTableChange(event, guest: GuestReservation) {
    event.stopPropagation();
    this.openAddGuest(guest.id);
  }
  close() {
    this.onClose.emit(true);
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
