import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { defaultTableTypes } from '../../constants/tableTypes';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-table-switch',
  templateUrl: './table-switch.component.html',
  styleUrls: ['./table-switch.component.scss']
})
export class TableSwitchComponent implements OnInit {
  @Input() tableGroup: 'campaign' | 'reservation' | 'outlet';

  selectedTableTypes: TableType[] = [];
  tableFG: FormGroup;

  @Output() onChange = new EventEmitter();

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit(): void {
    this.selectedTableTypes = defaultTableTypes[this.tableGroup];
    this.initControl();
  }

  initControl() {
    this.tableFG = this.controlContainer.control as FormGroup;
    this.tableFG.addControl('tableType', new FormControl(''));
    this.setTableType(this.selectedTableTypes[0].value);
  }

  setTableType(value: string) {
    this.tableFG.patchValue({ tableType: value });
    this.onChange.emit(value);
  }
}

type TableTypeGroup = 'reservation' | 'campaign' | 'outlet';

// Define type for the table type object
type TableType = {
  name: string;
  value: string;
  url: string;
  whiteUrl: string;
  backgroundColor: string;
};

// Define type for the defaultTableTypes constant
export type DefaultTableTypes = {
  [Key in TableTypeGroup]: TableType[];
};
