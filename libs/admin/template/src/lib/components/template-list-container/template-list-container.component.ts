import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { TemplateService } from '../../services/template.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { FormGroup } from '@angular/forms';
import { Topics } from '../../data-models/templateConfig.model';

@Component({
  selector: 'hospitality-bot-template-list-container',
  templateUrl: './template-list-container.component.html',
  styleUrls: ['./template-list-container.component.scss'],
})
export class TemplateListContainerComponent implements OnInit {
  hotelId: string;
  private $subscription = new Subscription();
  @Input() templateForm: FormGroup;
  @Input() templateType = false;
  templateData = '';
  template = '';
  globalQueries = [];
  @Output() change = new EventEmitter();
  topicList = [];
  topicTemplate = 'All';

  constructor(
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private templateService: TemplateService,
    private _snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initFG(): void {}

  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      // set-global query everytime global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
      this.getHotelId(this.globalQueries);
      this.getTopicList(this.hotelId);
    });
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
  openTopicTemplates(name?: string) {
    console.log(name)
    if (name) {
      this.topicTemplate = name;
    } else {
      this.topicTemplate = 'All';
    }
  }
  goBack() {
    this.change.emit();
  }
}
