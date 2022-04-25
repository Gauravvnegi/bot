import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { Topics } from '../../data-models/templateConfig.model';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'hospitality-bot-inbuilt-template',
  templateUrl: './inbuilt-template.component.html',
  styleUrls: ['./inbuilt-template.component.scss'],
})
export class InbuiltTemplateComponent implements OnInit {
  private $subscription = new Subscription();
  listFG: FormGroup;
  globalQueries = [];
  hotelId: string;
  topicList = [];
  constructor(
    private _fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private _snackbarService: SnackBarService,
    private templateService: TemplateService
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    // this.listenForGlobalFilters();
  }
  initFG(): void {
    this.listFG = this._fb.group({
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
        // this.getTopicList(this.hotelId);
      })
    );
  }

  // getTopicList(hotelId) {
  //   const config = {
  //     queryObj: this.adminUtilityService.makeQueryParams([
  //       { entityState: 'ACTIVE', limit: 50 },
  //     ]),
  //   };
  //   this.$subscription.add(
  //     this.templateService.getTopicList(hotelId, config).subscribe(
  //       (response) =>
  //         (this.topicList = new Topics().deserialize(response).records),
  //       ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
  //     )
  //   );
  // }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
