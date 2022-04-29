import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Observable, Subscription } from 'rxjs';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { TemplateService } from '../../services/template.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Templates } from '../../data-models/templateConfig.model';

@Component({
  selector: 'hospitality-bot-inbuilt-template',
  templateUrl: './inbuilt-template.component.html',
  styleUrls: ['./inbuilt-template.component.scss'],
})
export class InbuiltTemplateComponent implements OnInit {
  hotelId: string;
  private $subscription = new Subscription();
  templateList = [];
  templateForm: FormGroup;
  templateData = '';
  template = '';

  globalQueries = [];
  loading: boolean;
  values: any;
  totalRecords: any;
  first: any;
  rowsPerPage: any;
  list = [];
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
      topicId: ['', [Validators.required]],
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
        this.getTemplateList(this.hotelId);
      })
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) this.hotelId = element.hotelId;
    });
  }
  getTemplateList(hotelId) {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        { entityState: 'ACTIVE', limit: 50 },
      ]),
    };
    this.$subscription.add(
      this.templateService.getTemplateList(hotelId, config).subscribe(
        (response) => {
          this.templateList = new Templates().deserialize(response).records;
          this.list = response;
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  loadInitialData(queries = [], loading = true): void {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (data) => {
          this.values = new Templates().deserialize(data).records;
          //set pagination
          this.totalRecords = data.total;
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  handleTemplateChange(event) {
    this.template = this.modifyTemplate(event.value);
    this.templateForm.get('htmlTemplate').patchValue(this.template);
  }

  modifyTemplate(template: string) {
    this.templateData = template;
    return template.substring(
      template.indexOf('<div'),
      template.lastIndexOf('</body>')
    );
  }

  fetchDataFrom(
    queries,
    defaultProps = { offset: this.first, limit: this.rowsPerPage }
  ): Observable<any> {
    queries.push(defaultProps);
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams(queries),
    };
    return this.templateService.getHotelTemplate(config, this.hotelId);
  }

  goBack() {
    this._location.back();
  }
}
