import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { reject } from 'lodash';
import { empty, of, Subscription } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
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
  datamapped = true;
  @ViewChild('stepper') stepper: MatStepper;
  constructor(
    private _fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private activatedRoute: ActivatedRoute,
    private _campaignService: CampaignService,
    private _emailService: EmailService,
    private _router: Router,
    private _snackbarService: SnackBarService
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initFG(): void {
    this.campaignFG = this._fb.group({
      name: ['', [Validators.required]],
      templateId: [''],
      from: ['', [Validators.required]],
      to: this._fb.array([], Validators.required),
      message: ['', [Validators.required]],
      subject: ['', [Validators.required, Validators.maxLength(200)]],
      previewText: ['', Validators.maxLength(200)],
      topicId: [''],
      status: [true],
      isDraft: [true],
      campaignType: [''],
      testEmails: this._fb.array([]),
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
          this.datamapped = false;
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
          this.setFormData();
          this.listenForAutoSave();
        })
    );
  }

  addElementToData() {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.addFormArray('to', 'toReceivers'),
        this.addtestEmails(),
      ]).then((res) => resolve(res[1]));
    });
  }

  setFormData() {
    this.addElementToData().then((res) => {
      this.campaignFG.patchValue(res);
      this.datamapped = true;
    });
  }

  addFormArray(control, dataField) {
    return new Promise((resolve, reject) => {
      if (this.campaign[dataField]) {
        this.campaign[control] = [];
        if (!this.campaignFG.get(control))
          this.campaignFG.addControl(control, this._fb.array([]));
        this._campaignService
          .getReceiversFromData(this.campaign[dataField])
          .forEach((receiver) => {
            (this.campaignFG.get(control) as FormArray).push(
              new FormControl(receiver)
            );
          });
      }
      resolve(this.campaign);
    });
  }

  addtestEmails() {
    return new Promise((resolve, reject) => {
      this.campaign.testEmails.forEach((item) =>
        (this.campaignFG.get('testEmails') as FormArray).push(
          new FormControl(item)
        )
      );
      resolve(this.campaign);
    });
  }

  listenForAutoSave() {
    this.$subscription.add(
      this.campaignFG.valueChanges
        .pipe(
          switchMap((formValue) => {
            if (this.datamapped)
              return this.autoSave(formValue).pipe(
                catchError((err) => {
                  return empty();
                })
              );
            return of(null);
          })
        )
        .subscribe(
          (response) => {
            if (this.campaignId) {
              this.setDataAfterUpdate(response);
              console.log('Saved');
            } else
              this._router.navigate([
                `/pages/marketing/campaign/edit/${response.id}`,
              ]);
          },
          ({ error }) => {
            this._snackbarService.openSnackBarAsText(error.message);
          }
        )
    );
  }

  autoSave(data?) {
    if (data)
      return this._campaignService.save(
        this.hotelId,
        this._emailService.createRequestData(data),
        this.campaignId
      );
    else {
      this.$subscription.add(
        this._campaignService
          .save(
            this.hotelId,
            this._emailService.createRequestData(this.campaignFG.getRawValue()),
            this.campaignId
          )
          .subscribe(
            (response) => {
              console.log('Saved');
              this.setDataAfterUpdate(response);
            },
            ({ error }) => {
              this._snackbarService.openSnackBarAsText(error.message);
            }
          )
      );
    }
  }

  setTemplate(event) {
    this.campaignFG.patchValue({
      message: event.htmlTemplate,
      topicId: event.topicId,
      templateId: event.id,
    });
    this.stepper.selectedIndex = 0;
  }

  changeStep(event) {
    if (event.status) {
      this.campaignFG.patchValue({
        message: event.data.htmlTemplate,
        templateId: event.data.id,
        topicId: event.data.topicId,
      });
      this.stepper.selectedIndex = 0;
      return;
    }
    this.stepper.selectedIndex = 1;
  }

  handleCreateContentChange(event) {
    this.stepper[event.step]();
    if (event.templateType) this.createContentType = event.templateType;
  }

  setDataAfterUpdate(response) {
    if (response?.value) {
      this.campaign = new Campaign().deserialize(response?.value);
      this.setFormData();
    }
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
