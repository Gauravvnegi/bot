import { Component, OnInit } from '@angular/core';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  BaseDatatableComponent,
  EntityConfig,
  EntitySubType,
  HotelDetailService,
  TableService,
} from '@hospitality-bot/admin/shared';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'hospitality-bot-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent extends BaseDatatableComponent
  implements OnInit {
  entityId: string = '';
  tabFilterIdx = 0;
  tabFilterItems = [];
  selectedEntity: EntitySubType;
  globalFeedbackFilterType = '';
  outlets: EntityConfig[];
  outletIds: string[];

  loading = false;
  navRoutes = [
    {
      label: 'Manage Booking',
      link: '/admin',
    },
  ];
  $subscription = new Subscription();

  constructor(
    public fb: FormBuilder,
    private reservationService: ManageReservationService,
    private formService: FormService,
    private globalFilterService: GlobalFilterService,
    protected _hotelDetailService: HotelDetailService,
    public tabFilterService: TableService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.listenForGlobalFilters();
    // this.getTabFilterItems();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.entityId = this.globalFilterService.entityId;
        debugger;
        this.globalFeedbackFilterType =
          data['filter'].value.feedback.feedbackType;
        if (
          this.globalFeedbackFilterType === Feedback.TRANSACTIONAL ||
          this.globalFeedbackFilterType === Feedback.BOTH
        ) {
          this.tabFilterIdx = 0;
          console.log(data);
          this.getOutletsSelected(
            [...data['feedback'].queryValue],
            data['filter'].value
          );
          debugger;
          if (this.globalFeedbackFilterType === Feedback.TRANSACTIONAL) {
            this.formService.type = this.globalFeedbackFilterType;
            this.formService.$feedbackType.next(this.globalFeedbackFilterType);
          } else {
            this.formService.type = '';
            this.formService.$feedbackType.next('');
          }
        } else {
          this.formService.type = Feedback.TRANSACTIONAL;
          this.formService.$feedbackType.next(Feedback.STAY);
          this.setStayTabFilters(data['filter'].value);
        }
      })
    );
  }

  getOutletsSelected(globalQueries, globalQueryValue) {
    globalQueries.forEach((element) => {
      debugger;
      if (element.hasOwnProperty('outlets')) this.outletIds = element.outlets;
    });
    debugger;
    this.getOutlets(
      globalQueryValue.property.entityName,
      globalQueryValue.property.brandName
    );
  }

  getOutlets(branchId: string, brandId: string) {
    const branch = this._hotelDetailService.brands
      .find((brand) => brand.id === brandId)
      .entities.find((branch) => branch['id'] === branchId);
    this.outlets = branch.entities;
    debugger;
    this.formService.outletIds =
      this.globalFeedbackFilterType === Feedback.BOTH
        ? (this.formService.outletIds = [branch.id])
        : this.outlets
            .map((outlet) => {
              debugger;
              if (outlet.id && this.outletIds[outlet.id]) return outlet.id;
            })
            .filter((id) => id !== undefined);
    this.setTabFilterItems(branch);
  }

  setStayTabFilters(globalQueryValue) {
    debugger;
    const branch = this._hotelDetailService.brands
      .find((brand) => brand.id === globalQueryValue.property.brandName)
      .entities.find(
        (branch) => branch['id'] === globalQueryValue.property.entityName
      );
    this.setTabFilterItems(branch);
  }

  setTabFilterItems(branch: EntityConfig) {
    if (this.globalFeedbackFilterType === Feedback.STAY) {
      this.tabFilterItems = [this.getTabItem(branch, Feedback.STAY)];
      return;
    }
    this.tabFilterItems = [];
    this.tabFilterItems.push({
      label: branch.name,
      content: '',
      value: branch.id,
      disabled: false,
      chips: [],
      type: Feedback.TRANSACTIONAL,
    });
    if (this.globalFeedbackFilterType === Feedback.BOTH)
      this.tabFilterItems.push(this.getTabItem(branch, Feedback.STAY));
    this.outlets.forEach((outlet) => {
      if (this.outletIds[outlet.id]) {
        this.tabFilterItems.push(
          this.getTabItem(outlet, Feedback.TRANSACTIONAL)
        );
      }
    });
  }

  getTabItem(item: EntityConfig, type: Feedback) {
    return {
      label: item.name,
      content: '',
      value: item.id,
      disabled: false,
      chips: [],
      type: type,
    };
  }

  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.tabFilterIdx = event.index;
    this.selectedEntity = this.tabFilterItems[event.index].type;
    this.formService.selectedEntity.next(this.selectedEntity);
  }
}

export enum Feedback {
  STAY = 'STAYFEEDBACK',
  TRANSACTIONAL = 'TRANSACTIONALFEEDBACK',
  BOTH = 'ALL',
}
