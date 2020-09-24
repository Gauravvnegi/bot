import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { delay } from 'rxjs/operators';
import { pipe, of } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { Table } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { BaseDatatableComponent } from './base-datatable.component';
import { FormBuilder } from '@angular/forms';

interface Import {
  name: string;
  code: string;
}

@Component({
  selector: 'hospitality-bot-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
})
export class DatatableComponent extends BaseDatatableComponent
  implements OnInit {
  constructor(public fb: FormBuilder) {
    super(fb);
  }
}
