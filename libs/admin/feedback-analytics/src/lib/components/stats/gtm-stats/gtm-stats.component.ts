import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { DateService } from '@hospitality-bot/shared/utils';
import { TranslateService } from '@ngx-translate/core';
import { StatisticsService } from '../../../services/feedback-statistics.service';
import { BifurcationStatsComponent } from '../bifurcation-stats/bifurcation-stats.component';

@Component({
  selector: 'hospitality-bot-gtm-stats',
  templateUrl: './gtm-stats.component.html',
  styleUrls: ['./gtm-stats.component.scss'],
})
export class GtmStatsComponent extends BifurcationStatsComponent
  implements OnInit {
  constructor(
    protected _adminUtilityService: AdminUtilityService,
    protected _statisticService: StatisticsService,
    protected globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    protected dateService: DateService,
    protected _translateService: TranslateService,
    protected _modalService: ModalService,
    fb: FormBuilder
  ) {
    super(
      _adminUtilityService,
      _statisticService,
      globalFilterService,
      snackbarService,
      dateService,
      _translateService,
      _modalService,
      fb
    );
  }
}
