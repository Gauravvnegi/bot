import { Component, Input, OnInit } from '@angular/core';
import { FormComponent } from 'libs/admin/shared/src/lib/components/form-component/form.components';
import { ControlContainer, FormGroup, Validators } from '@angular/forms';
import {
  updateItems,
  weeks,
} from 'libs/admin/channel-manager/src/lib/constants/bulkupdate-response';
import { RoomTypeOption } from 'libs/admin/room/src/lib/types/room';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import {
  RestrictionAndValuesOption,
  restrictionsRecord,
} from 'libs/admin/channel-manager/src/lib/constants/data';
@Component({
  selector: 'hospitality-bot-bulk-update-form',
  templateUrl: './bulk-update-form.component.html',
  styleUrls: ['./bulk-update-form.component.scss'],
})
export class BulkUpdateFormComponent extends FormComponent {
  readonly restrictionsRecord = restrictionsRecord;
  @Input() allRestrictions = [];
  @Input() isRoomsEmpty = false;
  updateItems = updateItems;

  restrictions: RestrictionAndValuesOption[];

  weeks = weeks;

  entityId: string;
  parentForm: FormGroup;
  startMinDate = new Date();
  endMinDate = new Date();
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

  @Input() endDateValue = new Date();

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
    this.entityId = this.globalFilterService.entityId;
    this.listenChanges();
    this.initOptionsConfig();
  }

  listenChanges() {
    this.parentForm
      .get(this.controls.fromDate)
      .valueChanges.subscribe((value) => {
        if (value > this.parentForm.controls[this.controls.toDate].value) {
          this.endMinDate = new Date(value);
          this.endDateValue = new Date(value);
        } else {
          this.endMinDate = new Date();
        }
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
    this.restrictions = this.allRestrictions.map((item) => {
      const { label, type } = this.restrictionsRecord[item];
      return { label, type, value: item };
    });
  }
}
