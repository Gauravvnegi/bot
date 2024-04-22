import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ComplaintBreakDown,
  ComplaintCategoryBreakDownStats,
} from '../../../models/complaint.analytics.model';
import { AnalyticsService } from '../../../services/analytics.service';
import {
  AdminUtilityService,
  Option,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { complaintEntityFilterOption } from '../../../constant/stats';

@Component({
  selector: 'complaint-breakdown',
  templateUrl: './complaint-breakdown.component.html',
  styleUrls: ['./complaint-breakdown.component.scss'],
})
export class ComplaintBreakdownComponent implements OnInit {
  label: string = 'Complaint Category Breakdown';
  complaintCategoryBreakDownStats: ComplaintCategoryBreakDownStats;
  $subscription = new Subscription();

  optionList: Option[] = complaintEntityFilterOption;

  globalQueries;

  useForm: FormGroup;

  constructor(
    private analyticsService: AnalyticsService,
    private globalFilterService: GlobalFilterService,
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService
  ) {}

  initForm() {
    this.useForm = this.fb.group({
      statsFilter: ['ALL'],
    });

    this.useForm.get('statsFilter').valueChanges.subscribe(() => {
      this.initGraphStats();
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query every time global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.initGraphStats();
      })
    );
  }

  initGraphStats(): void {
    this.$subscription.add(
      this.analyticsService
        .getComplaintBreakDown(this.getQueryConfig())
        .subscribe((res) => {
          this.complaintCategoryBreakDownStats = new ComplaintBreakDown().deserialize(
            res
          ).complaintCategoryBreakDownStats;
        })
    );
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        { entityType: this.useForm.get('statsFilter').value },
      ]),
    };
    return config;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
