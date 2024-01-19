import { Option } from 'libs/admin/shared/src/lib/types/form.type';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  seatedCards,
  seatedChips,
  seatedTabGroup,
  watchListCards,
} from '../../constants/guest-list.const';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GuestCard } from '../guest-card/guest-card.component';
import { ChipType, TabsType } from '../../types/guest.type';

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
  seatedGuestList: GuestCard[] = seatedCards;
  watchListGuestList: GuestCard[] = watchListCards;

  useForm: FormGroup;
  @Output() onClose = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder) {}

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
    this.useForm.patchValue({ chip: ChipType[event.value] });
  }

  tabChange(event: { index: number }) {
    const activeTab = TabsType[Object.keys(TabsType)[event.index]] as TabsType;
    const activeChip = this.useForm.get('chip').value;
    this.useForm.patchValue({ tab: activeTab });

    /**
     * filtration------
     */
    let constCards =
      activeChip == this.chipEnum.seated ? seatedCards : watchListCards;

    if (
      activeTab == TabsType.resident ||
      activeTab == TabsType['none-resident']
    ) {
      this.watchListGuestList = constCards.filter(
        (item) => item.type === activeTab
      );
      this.seatedGuestList = constCards.filter(
        (item) => item.type === activeTab
      );
    } else {
      this.seatedGuestList = [...constCards];
      this.watchListGuestList = [...constCards];
    }
  }

  get isSeated() {
    return this.useForm.get('chip').value == this.chipEnum.seated;
  }

  close() {
    this.onClose.emit(true);
  }
}
