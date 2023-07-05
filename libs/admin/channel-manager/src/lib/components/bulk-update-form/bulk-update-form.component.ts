import { Component, Input, OnInit } from '@angular/core';
import { FormComponent } from 'libs/admin/shared/src/lib/components/form-component/form.components';
import { ControlContainer, FormGroup, Validators } from '@angular/forms';
import { updateItems, weeks } from '../constants/bulkupdate-response';
import { RoomTypeOption } from 'libs/admin/room/src/lib/types/room';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import {
  RestrictionAndValuesOption,
  restrictionsRecord,
  inventoryRestrictions,
} from '../../constants/data';
@Component({
  selector: 'hospitality-bot-bulk-update-form',
  templateUrl: './bulk-update-form.component.html',
  styleUrls: ['./bulk-update-form.component.scss'],
})
export class BulkUpdateFormComponent extends FormComponent {
  readonly restrictionsRecord = restrictionsRecord;

  updateItems = updateItems;

  restrictions: RestrictionAndValuesOption[];

  weeks = weeks;

  hotelId: string;
  parentForm: FormGroup;
  endMinDate = new Date();
  startMinDate = new Date();
  roomTypes: RoomTypeOption[] = [];

  $subscription = new Subscription();
  private _controls = {
    update: 'update',
    updateValue: 'updateValue',
    fromDate: 'fromDate',
    toDate: 'toDate',
    roomType: 'roomType',
    selectedDays: 'selectedDays',
  };

  @Input() set controls(value: { [key: string]: string }) {
    this._controls = { ...this._controls, ...value };
  }

  get controls() {
    return this._controls;
  }

  constructor(
    public controlContainer: ControlContainer,
    private globalFilterService: GlobalFilterService
  ) {
    super(controlContainer);
  }
  ngOnInit(): void {
    this.parentForm = this.controlContainer.control as FormGroup;
    this.hotelId = this.globalFilterService.hotelId;
    this.listenChanges();
    this.initOptionsConfig();
  }

  listenChanges() {
    this.parentForm
      .get(this.controls.fromDate)
      .valueChanges.subscribe((value) => {
        this.endMinDate = new Date(value);
      });

    this.parentForm
      .get(this.controls.update)
      .valueChanges.subscribe((changedValue) => {
        const target = this.parentForm.controls[this.controls.updateValue];
        target.reset();

        restrictionsRecord[changedValue].type === 'boolean'
          ? target.clearValidators()
          : target.setValidators([Validators.required]);

        target.updateValueAndValidity();
      });
  }

  /**
   * @function initOptionsConfig Initialize room types options
   */
  initOptionsConfig(): void {
    this.getRestrictions();
  }

  getRestrictions() {
    this.restrictions = inventoryRestrictions.map((item) => {
      const { label, type } = this.restrictionsRecord[item];
      return { label, type, value: item };
    });
  }
}
