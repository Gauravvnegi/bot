import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { Template } from '../../data-models/templateConfig.model';
import { TemplateService } from '../../services/template.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

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
  template:Template;
  constructor(
    private _fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private adminUtilityService: AdminUtilityService,
    private templateService: TemplateService,
    private location: Location,
    private _router: Router
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
      status: [true],
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

  createTemplate() {
    if (this.templateForm.invalid) {
      this._snackbarService.openSnackBarAsText('Invalid Form.');
      return;
    }
    this.isSaving = true;
    let data = this.templateService.mapTemplateData(
      this.templateForm.getRawValue(),
      this.hotelId
    );
    this.$subscription.add(
      this.templateService.createTemplate(this.hotelId, data).subscribe(
        (response) => {
          this.template = new Template().deserialize(response);
          this.templateForm.patchValue(this.template);
          this._snackbarService.openSnackBarAsText(
            'Template Created Successfully',
            '',
            { panelClass: 'success' }
          );
          this._router.navigate(['/pages/library/template']);
          this.isSaving = false;
        },
        ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
          this.isSaving = false;
        }
      )
    );
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
