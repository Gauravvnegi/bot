import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, ViewChild, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'hospitality-bot-multiple-dropdown',
  templateUrl: './multiple-dropdown.component.html',
  styleUrls: ['./multiple-dropdown.component.scss']
})
export class MultipleDropdownComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  itemCtrl = new FormControl();
  filtereditems: Observable<string[]>;
  items: string[] = [];
  @Input() allItems: string[];
  @Output() updateData = new EventEmitter();

  @ViewChild('itemInput') itemInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor() {
  }
  
  ngOnInit() {
    this.filtereditems = this.itemCtrl.valueChanges.pipe(
        startWith(null),
        map((item: string | null) => item ? this._filter(item) : this.allItems.slice()));
  }

  add(event: MatChipInputEvent): void {
    // Add item only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our item
      if ((value || '').trim()) {
        this.items.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.itemCtrl.setValue(null);
    }
  }

  remove(item: string): void {
    const index = this.items.indexOf(item);

    if (index >= 0) {
      this.items.splice(index, 1);
      this.updateData.emit(this.items.toString());
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.items.push(event.option.viewValue);
    this.updateData.emit(this.items.toString());
    this.itemInput.nativeElement.value = '';
    this.itemCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allItems.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
  }
}
