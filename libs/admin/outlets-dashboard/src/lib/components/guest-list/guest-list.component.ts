import { Option } from 'libs/admin/shared/src/lib/types/form.type';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  seatedCards,
  seatedChips,
  seatedTabGroup,
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
  readonly seatedChips: Option<ChipType>[] = seatedChips;
  readonly guestList: GuestCard[] = seatedCards;
  readonly seatedTabGroup: Option<TabsType>[] = seatedTabGroup;

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

  close() {
    this.onClose.emit(true);
  }
}
