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
import {
  seatedCards,
  seatedChips,
  seatedTabGroup,
  waitListCards,
} from '../../constants/guest-list.const';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GuestCard } from '../guest-card/guest-card.component';
import { ChipType, TabsType } from '../../types/guest.type';
import { AddGuestListComponent } from '../add-guest-list/add-guest-list.component';
import { manageMaskZIndex } from '@hospitality-bot/admin/shared';

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
  seatedGuestList: GuestCard[] = [...seatedCards];
  waitListGuestList: GuestCard[] = [...waitListCards];

  useForm: FormGroup;
  @Output() onClose = new EventEmitter<boolean>();

  sidebarVisible = false;
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.useForm = this.fb.group({
      search: [],
      chip: [ChipType.seated],
      tab: [TabsType.all],
    });
  }

  setChip(event: Option) {
    console.log(ChipType[event.value]);
    this.useForm.patchValue(
      { search: '', chip: ChipType[event.value] },
      { emitEvent: false }
    );
  }

  tabChange(event: { index: number }) {
    const activeTab = TabsType[Object.keys(TabsType)[event.index]] as TabsType;
    const activeChip = this.useForm.get('chip').value;
    this.useForm.patchValue(
      { search: '', tab: activeTab },
      { emitEvent: false }
    );

    /**
     * filtration------
     */
    let constCards =
      activeChip == this.chipEnum.seated ? seatedCards : waitListCards;

    if (
      activeTab == TabsType.resident ||
      activeTab == TabsType['non-resident']
    ) {
      this.waitListGuestList = constCards.filter(
        (item) => item.type === activeTab
      );
      this.seatedGuestList = constCards.filter(
        (item) => item.type === activeTab
      );
    } else {
      this.seatedGuestList = [...constCards];
      this.waitListGuestList = [...constCards];
    }
  }

  get isSeated() {
    return this.useForm.get('chip').value == this.chipEnum.seated;
  }

  openAddGuest() {
    this.sidebarSlide.clear();
    this.sidebarVisible = true;
    manageMaskZIndex();
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      AddGuestListComponent
    );
    const componentRef = this.sidebarSlide.createComponent(factory);
    const instance: AddGuestListComponent = componentRef.instance;

    const closeSubscription = instance.onClose.subscribe((res: any) => {
      componentRef.destroy();
      closeSubscription.unsubscribe();
      this.sidebarVisible = false;
    });
  }

  fullReservation() {}

  searchGuest(event: string) {
    const activeChip = this.useForm.get('chip').value;
    const activeTab = this.useForm.get('tab').value;

    let constCards =
      activeChip == this.chipEnum.seated ? seatedCards : waitListCards;

    if (event) {
      const isAll = activeTab == this.tabEnum.all;
      this.waitListGuestList = constCards.filter(
        (item) =>
          item.name.toLocaleLowerCase().includes(event.toLocaleLowerCase()) &&
          (isAll || item.type === activeTab)
      );
      this.seatedGuestList = constCards.filter(
        (item) =>
          item.name.toLocaleLowerCase().includes(event.toLocaleLowerCase()) &&
          (isAll || item.type === activeTab)
      );
      console.log(activeChip, activeTab, event);
    } else {
      this.tabChange({ index: Object.keys(TabsType).indexOf(activeTab) });
      this.setChip({ value: activeChip } as any);
    }
    this.loading = false;
  }

  get guestList() {
    return this.isSeated ? this.seatedGuestList : this.waitListGuestList;
  }

  close() {
    this.onClose.emit(true);
  }
}
