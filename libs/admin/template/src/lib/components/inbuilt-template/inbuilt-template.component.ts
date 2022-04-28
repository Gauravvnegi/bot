import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import { Topics } from '../../data-models/templateConfig.model';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { TemplateService } from '../../services/template.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-inbuilt-template',
  templateUrl: './inbuilt-template.component.html',
  styleUrls: ['./inbuilt-template.component.scss'],
})
export class InbuiltTemplateComponent implements OnInit {
  hotelId: any;
  private $subscription = new Subscription();
  topicList = [];
  templateForm: FormGroup;

  globalQueries = [];

  constructor(
    private _location: Location,
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private templateService: TemplateService,
    private _snackbarService: SnackBarService,
    private _fb: FormBuilder
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initFG(): void {
    this.templateForm = this._fb.group({
      name: ['', [Validators.required]],
      topicName: ['', [Validators.required]],
    });
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.getHotelId(this.globalQueries);
      })
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) this.hotelId = element.hotelId;
    });
  }

  goBack() {
    this._location.back();
  }
}
