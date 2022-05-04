import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  SnackBarService,
  ModalService,
} from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { EmailList } from '../../data-model/email.model';
import { CampaignService } from '../../services/campaign.service';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'hospitality-bot-view-campaign',
  templateUrl: './view-campaign.component.html',
  styleUrls: ['./view-campaign.component.scss'],
})
export class ViewCampaignComponent implements OnInit {
  private $subscription = new Subscription();
  globalQueries = [];
  fromEmailList = [];
  campaignId: string;
  campaignFG: FormGroup;
  hotelId: string;
  ckeConfig = {
    allowedContent: true,
    extraAllowedContent: '*(*);*{*}',
  };
  constructor(
    private location: Location,
    private _fb: FormBuilder,
    private _snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private _emailService: EmailService,
    private _campaignService: CampaignService,
    private activatedRoute: ActivatedRoute
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initFG(): void {
    this.campaignFG = this._fb.group({
      fromId: ['', [Validators.required]],
      emailIds: this._fb.array([], Validators.required),
      // cc: this._fb.array([]),
      message: ['', [Validators.required]],
      subject: ['', [Validators.required, Validators.maxLength(200)]],
      previewText: ['', Validators.maxLength(200)],
      topicId: [''],
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
        this.getFromEmails();
        this.getTemplateId();
      })
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) this.hotelId = element.hotelId;
    });
  }

  getFromEmails() {
    this.$subscription.add(
      this._emailService.getFromEmail(this.hotelId).subscribe(
        (response) =>
          (this.fromEmailList = new EmailList().deserialize(response)),
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  getTemplateId(): void {
    this.$subscription.add(
      this.activatedRoute.params.subscribe((params) => {
        if (params['id']) {
          this.campaignId = params['id'];
          this.getCampaignDetails(this.campaignId);
        }
      })
    );
  }

  getCampaignDetails(id) {
    this.$subscription.add(
      this._campaignService
        .getCampaignById(this.hotelId, id)
        .subscribe((response) => {
          console.log(response);
        })
    );
  }
}
