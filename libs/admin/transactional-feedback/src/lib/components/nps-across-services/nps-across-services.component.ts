import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { StatisticsService } from '../../services/statistics.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { NPSAcrossServices } from '../../data-models/statistics.model';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import * as FileSaver from 'file-saver';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { NpsAcrossServicesComponent as BaseNpsAcrossServicesComponent } from 'libs/admin/stay-feedback/src/lib/components/nps-across-services/nps-across-services.component';

@Component({
  selector: 'hospitality-bot-nps-across-services',
  templateUrl: './nps-across-services.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './nps-across-services.component.scss',
  ],
})
export class NpsAcrossServicesComponent extends BaseNpsAcrossServicesComponent
  implements OnInit {
  constructor(
    fb: FormBuilder,
    _adminUtilityService: AdminUtilityService,
    _statisticService: StatisticsService,
    _globalFilterService: GlobalFilterService,
    _snackbarService: SnackBarService,
    dateService: DateService
  ) {
    super(
      fb,
      _adminUtilityService,
      _statisticService,
      _globalFilterService,
      _snackbarService,
      dateService
    );
  }
}
