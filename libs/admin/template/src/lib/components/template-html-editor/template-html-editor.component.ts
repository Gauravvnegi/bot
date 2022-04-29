import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { Template } from '../../data-models/templateConfig.model';
import { TemplateService } from '../../services/template.service';
import { Location } from '@angular/common';

@Component({
  selector: 'hospitality-bot-template-html-editor',
  templateUrl: './template-html-editor.component.html',
  styleUrls: ['./template-html-editor.component.scss'],
})
export class TemplateHtmlEditorComponent implements OnInit {
  id: string;
  templateForm: FormGroup;
  private $subscription = new Subscription();
  hotelId: string;
  globalQueries = [];
  topicList = [];
  isSaving = false;
  template: Template;

  templateId: string;
  constructor(
    private _fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private templateService: TemplateService,
    private location: Location,
    private _router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initFG(): void {
    this.templateForm = this._fb.group({
      name: ['', [Validators.required]],
      htmlTemplate: [''],
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
        this.getTemplateId();
      })
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) this.hotelId = element.hotelId;
    });
  }

  getTemplateId(): void {
    this.$subscription.add(
      this.activatedRoute.params.subscribe((params) => {
        if (params['id']) {
          this.templateId = params['id'];
          this.getTemplateDetails(this.templateId);
        } else if (this.id) {
          this.templateId = this.id;
          this.getTemplateDetails(this.templateId);
        }
      })
    );
  }

  /**
   * @function getTemplateDetails to get the topic details.
   * @param topicId The topic id for which edit action will be done.
   */
  getTemplateDetails(topicId: string): void {
    this.$subscription.add(
      this.templateService
        .getTemplateDetails(this.hotelId, topicId)
        .subscribe((response) => {
          this.template = new Template().deserialize(response);
          this.templateForm.patchValue(this.template);
        })
    );
  }
  createTemplate() {
    this.isSaving = true;
    const data = this.templateService.mapTemplateData(
      this.templateForm.getRawValue(),
      this.hotelId,
      this.template.id
    );
    this.$subscription.add(
      this.templateService
        .updateTemplate(this.hotelId, this.template.id, data)
        .subscribe(
          (response) => {
            this._snackbarService.openSnackBarAsText(
              'Template created Successfully',
              '',
              { panelClass: 'success' }
            );
            // this._router.navigate(['/pages/library/template']);
            this.isSaving = false;
          },
          ({ error }) => {
            this._snackbarService.openSnackBarAsText(error.message);
            this.isSaving = false;
          }
        )
    );
  }
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
