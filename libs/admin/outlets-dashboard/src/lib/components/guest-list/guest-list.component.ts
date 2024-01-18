import { Option } from 'libs/admin/shared/src/lib/types/form.type';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SeatedCard } from '../seated-card/seated-card.component';
import {
  seatedCards,
  seatedChips,
  seatedTabGroup,
} from '../../constants/guest-list.const';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.scss'],
})
export class GuestListComponent implements OnInit {
  readonly seatedChips: Option[] = seatedChips;
  readonly guestList: SeatedCard[] = seatedCards;
  readonly seatedTabGroup: Option[] = seatedTabGroup;

  useForm: FormGroup;
  @Output() onClose = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.useForm = this.fb.group({
      search: [],
    });
  }

  close() {
    this.onClose.emit(true);
  }
}
