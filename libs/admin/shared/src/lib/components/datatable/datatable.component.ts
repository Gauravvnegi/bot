import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TableService } from '../../services/table.service';
import { BaseDatatableComponent } from './base-datatable.component';

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
  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService
  ) {
    super(fb, tabFilterService);
  }
}
