import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { TemplateService } from '../../services/template.service';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Topics } from '../../data-models/templateConfig.model';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'hospitality-bot-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.scss'],
})
export class CreateTemplateComponent implements OnInit, OnDestroy {
  templateForm: FormGroup;
  private $subscription = new Subscription();
  hotelId: string;
  globalQueries = [];
  topicList = [];
  isSaving = false;
  isLinear = false;

  @ViewChild('stepper') stepper: MatStepper;
  constructor(
    private _fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private adminUtilityService: AdminUtilityService,
    private templateService: TemplateService,
    private location: Location,
    private _router: Router,
    private route: ActivatedRoute
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
      description: [''],
      active: [true],
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
        this.getTopicList(this.hotelId);
      })
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) this.hotelId = element.hotelId;
    });
  }

  getTopicList(hotelId) {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        { entityState: 'ACTIVE', limit: 50 },
      ]),
    };
    this.$subscription.add(
      this.templateService.getTopicList(hotelId, config).subscribe(
        (response) =>
          (this.topicList = new Topics().deserialize(response).records),
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  move(index: number) {
    this.stepper.selectedIndex = index;
  }

  saveTemplate() {}
  goBack() {
    this.location.back();
  }

  openInBuiltTemplate() {
    this._router.navigate(['../template-design'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
