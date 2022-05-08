import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Campaign } from '../../data-model/campaign.model';
import { CampaignService } from '../../services/campaign.service';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'hospitality-bot-camapaign-email',
  templateUrl: './edit-camapaign.component.html',
  styleUrls: ['./edit-camapaign.component.scss'],
})
export class EditCampaignComponent implements OnInit {
  campaignId: string;
  campaignFG: FormGroup;
  templateData = '';
  hotelId: string;
  templateList = [];
  globalQueries = [];
  fromEmailList = [];
  isSending = false;
  visible: boolean = true;
  private $subscription = new Subscription();
  enableDropdown = false;
  template = '';
  ckeConfig = {
    allowedContent: true,
    extraAllowedContent: '*(*);*{*}',
  };
  campaign: Campaign;
  createContentType = '';
  @ViewChild('stepper') stepper: MatStepper;
  constructor(
    private _fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private activatedRoute: ActivatedRoute,
    private _campaignService: CampaignService,
    private _emailService: EmailService
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initFG(): void {
    this.campaignFG = this._fb.group({
      templateId: [''],
      from: ['', [Validators.required]],
      to: this._fb.array([], Validators.required),
      message: ['', [Validators.required]],
      subject: ['', [Validators.required, Validators.maxLength(200)]],
      previewText: ['', Validators.maxLength(200)],
      topicId: [''],
      templateName: [''],
      status: [true],
      isDraft: [true],
      campaignType: [''],
      testEmails: this._fb.array([]),
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
          this.campaignId = params['id'];
          this.getCampaignDetails(this.campaignId);
        } else this.listenForAutoSave();
      })
    );
  }

  getCampaignDetails(id) {
    this.$subscription.add(
      this._campaignService
        .getCampaignById(this.hotelId, id)
        .subscribe((response) => {
          this.campaign = new Campaign().deserialize(response);
          this.campaignFG.patchValue(this.campaign);
          this._campaignService
            .getReceiversFromData(this.campaign.receivers, this.hotelId)
            .forEach((receiver) =>
              (this.campaignFG.get('to') as FormArray).push(
                new FormControl(receiver)
              )
            );
          this.listenForAutoSave();
        })
    );
  }

  listenForAutoSave() {
    this.$subscription.add(
      this.campaignFG.valueChanges
        .pipe(switchMap((formValue) => this.autoSave(formValue)))
        .subscribe(
          (response) => {
            this.campaignId = response.id;
            this.campaignFG.patchValue(response);
          },
          ({ error }) => {}
        )
    );
  }

  autoSave(data?) {
    if (data)
      return this._campaignService.save(
        this.hotelId,
        this._emailService.createRequestData(this.campaign, data),
        this.campaignId
      );
    else {
      this.$subscription.add(
        this._campaignService
          .save(
            this.hotelId,
            this._emailService.createRequestData(this.campaign, data),
            this.campaignId
          )
          .subscribe(
            (response) => {
              console.log('Saved');
            },
            ({ error }) => {}
          )
      );
    }
  }

  setTemplate(event) {
    this.campaignFG.patchValue({
      message: event.htmlTemplate,
      topicId: event.topicId,
    });
    this.stepper.selectedIndex = 0;
  }

  changeStep(event) {
    this.stepper[event.step]();
    if (event.templateType) this.createContentType = event.templateType;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
