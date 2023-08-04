import { Component, OnInit } from '@angular/core';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  BaseDatatableComponent,
  EntityConfig,
  EntitySubType,
  EntityType,
  HotelDetailService,
  TableService,
} from '@hospitality-bot/admin/shared';
import { FormBuilder } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { FormService } from '../../services/form.service';
import { filter, skipWhile, take, takeUntil } from 'rxjs/operators';

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
  selectedEntity: EntityType;
  selectedOutlet: EntitySubType;
  globalFeedbackFilterType = '';
  outlets: EntityConfig[];
  outletIds: string[];

  loading = false;
  navRoutes = [
    {
      label: 'Manage Reservation',
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
  }

  listenForGlobalFilters(): void {
    const destroy$ = new Subject<void>();
    let isFirstDateRangeChange = true;

    this.$subscription.add(
      this.globalFilterService.globalFilter$
        .pipe(
          takeUntil(destroy$),
          filter((data) => {
            if ('dateRange' in data && isFirstDateRangeChange) {
              isFirstDateRangeChange = false;
              return true; // Allow the first change in dateRange
            }
            return !('dateRange' in data); // Ignore changes in dateRange for subsequent emissions
          })
        )
        .subscribe((data) => {
          this.entityId = this.globalFilterService.entityId;
          this.globalFeedbackFilterType =
            data['filter'].value.feedback.feedbackType;
          if (
            this.globalFeedbackFilterType === Feedback.TRANSACTIONAL ||
            this.globalFeedbackFilterType === Feedback.BOTH
          ) {
            this.tabFilterIdx = 0;
            this.getOutletsSelected(
              [...data['feedback'].queryValue],
              data['filter'].value
            );
            this.formService.type =
              this.globalFeedbackFilterType === Feedback.TRANSACTIONAL
                ? this.globalFeedbackFilterType
                : '';
            this.formService.$feedbackType.next(this.formService.type);
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
      if (element.hasOwnProperty('outlets')) this.outletIds = element.outlets;
    });
    this.getOutlets(
      globalQueryValue.property.entityName,
      globalQueryValue.property.brandName
    );
  }

  getOutlets(branchId: string, brandId: string) {
    const brand = this._hotelDetailService.brands.find(
      (brand) => brand.id === brandId
    );
    const branch = brand.entities.find((branch) => branch.id === branchId);
    this.outlets = branch.entities;
    this.formService.outletIds =
      this.globalFeedbackFilterType === Feedback.BOTH
        ? (this.formService.outletIds = [branch.id])
        : this.outlets
            .map((outlet) => {
              if (outlet.id && this.outletIds[outlet.id]) return outlet.id;
            })
            .filter((id) => id !== undefined);
    this.setTabFilterItems(branch);
  }

  setStayTabFilters(globalQueryValue) {
    const brand = this._hotelDetailService.brands.find(
      (brand) => brand.id === globalQueryValue.property.brandName
    );
    const branch = brand.entities.find(
      (branch) => branch.id === globalQueryValue.property.entityName
    );
    this.setTabFilterItems(branch);
  }

  setTabFilterItems(branch: EntityConfig) {
    this.tabFilterItems = [];
    this.tabFilterItems.push(this.getTabItem(branch));
    const prev = this.formService.selectedEntity.value;
    this.formService.selectedEntity.next(
      this.getFormServiceEntity(this.tabFilterItems[0])
    );

    // if (this.globalFeedbackFilterType === Feedback.BOTH) {
    //   this.tabFilterItems.push(this.getTabItem(branch));
    // }
    if (this.outlets)
      this.outlets.forEach((outlet) => {
        if (this.outletIds[outlet.id]) {
          this.tabFilterItems.push(this.getTabItem(outlet));
        }
      });
  }

  getTabItem(item: EntityConfig) {
    return {
      label: item.name,
      content: '',
      value: item.id,
      disabled: false,
      chips: [],
      type: item.type,
    };
  }

  getFormServiceEntity(item) {
    return {
      id: item.value,
      label: item.label,
      type: item.type ? EntityType.OUTLET : EntityType.HOTEL,
      subType: item.type ? item.type : EntitySubType.ROOM_TYPE,
    };
  }

  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.tabFilterIdx = event.index;
    this.selectedOutlet =
      this.tabFilterItems[event.index].type ?? EntitySubType.ROOM_TYPE;
    this.formService.selectedEntity.next(
      this.getFormServiceEntity(this.tabFilterItems[event.index])
    );
  }
}

export enum Feedback {
  STAY = 'STAYFEEDBACK',
  TRANSACTIONAL = 'TRANSACTIONALFEEDBACK',
  BOTH = 'ALL',
}
