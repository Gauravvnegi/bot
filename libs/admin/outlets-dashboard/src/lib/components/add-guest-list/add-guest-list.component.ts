import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { tableList } from '../../constants/guest-list.const';
import { Option } from '@hospitality-bot/admin/shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-add-guest-list',
  templateUrl: './add-guest-list.component.html',
  styleUrls: ['./add-guest-list.component.scss'],
})
export class AddGuestListComponent implements OnInit {
  readonly tableOptions: Option[] = tableList;
  @Output() onClose = new EventEmitter<boolean>();

  useForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.useForm = this.fb.group({
      tables: [[], Validators.required],
      personCount: [],
      guest: ['', Validators.required],
      segment: ['', Validators.required],
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      remark: ['', Validators.required],
    });
  }

  close() {
    this.onClose.emit(true);
  }
}
