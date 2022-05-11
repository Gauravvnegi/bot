import { Location } from '@angular/common';
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
import { empty, interval, of, Subscription } from 'rxjs';
import { catchError, debounceTime, switchMap } from 'rxjs/operators';
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
  private $autoSaveSubscription = new Subscription();
  private $formChangeDetection = new Subscription();
  constructor(
    private location: Location,
    private _fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private activatedRoute: ActivatedRoute,
    private _campaignService: CampaignService,
    private _emailService: EmailService,
    private _snackbarService: SnackBarService,
    private _router: Router
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
        } else this.listenForFormChanges();
      })
    );
  }

  listenForFormChanges() {
    this.$formChangeDetection = this.campaignFG.valueChanges
      .pipe(
        debounceTime(20000),
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
            console.log('Saved');
            this.setDataAfterUpdate(response);
          } else {
            this.location.replaceState(
              `/pages/marketing/campaign/edit/${response.id}`
            );
            this.setDataAfterSave(response);
          }
          this.$formChangeDetection.unsubscribe();
          this.listenForAutoSave();
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      );
  }

  getCampaignDetails(id) {
    this.$subscription.add(
      this._campaignService
        .getCampaignById(this.hotelId, id)
        .subscribe((response) => {
          this.campaign = new Campaign().deserialize(response);
          if (this.campaign.cc && this.campaign.cc.length)
            this.campaignFG.addControl('cc', this._fb.array([]));
          if (this.campaign.bcc && this.campaign.bcc.length)
            this.campaignFG.addControl('bcc', this._fb.array([]));
          this.setFormData();
          this.listenForAutoSave();
        })
    );
  }

  addElementToData() {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.addFormArray('to', 'toReceivers'),
        this.addEmailControls(),
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

  addEmailControls() {
    return new Promise((resolve, reject) => {
      this.campaign.testEmails.forEach((item) =>
        (this.campaignFG.get('testEmails') as FormArray).push(
          new FormControl(item)
        )
      );
      if (this.campaignFG.get('cc'))
        this.campaign.cc.forEach((item) =>
          (this.campaignFG.get('cc') as FormArray).push(new FormControl(item))
        );
      if (this.campaignFG.get('bcc'))
        this.campaign.cc.forEach((item) =>
          (this.campaignFG.get('bcc') as FormArray).push(new FormControl(item))
        );
      resolve(this.campaign);
    });
  }

  listenForAutoSave() {
    this.$autoSaveSubscription.add(
      interval(20000).subscribe((x) => {
        this.autoSave(this.campaignFG.getRawValue()).subscribe(
          (response) => {
            if (this.campaignId) {
              console.log('Saved');
              this.setDataAfterUpdate(response);
            } else {
              this.location.replaceState(
                `/pages/marketing/campaign/edit/${response.id}`
              );
              this.setDataAfterSave(response);
            }
          },
          ({ error }) => {
            this._snackbarService
              .openSnackBarWithTranslate({
                translateKey: '',
                priorityMessage: error.message,
              })
              .subscribe();
          }
        );
      })
    );
  }

  autoSave(data?) {
    return this._campaignService.save(
      this.hotelId,
      this._emailService.createRequestData(data),
      this.campaignId
    );
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
      this.campaignId = response.value.id;
      this.campaign = new Campaign().deserialize(response.value);
    }
  }

  setDataAfterSave(response) {
    if (response) {
      this.campaignId = response.id;
      this.campaign = new Campaign().deserialize(response);
    }
  }

  saveAndCloseForm(event) {
    if (
      this.campaignId ||
      this._emailService.checkForEmptyForm(this.campaignFG.getRawValue())
    )
      this.$subscription.add(
        this.autoSave(this.campaignFG.getRawValue()).subscribe(
          (response) => this._router.navigate(['/pages/marketing/campaign']),
          ({ error }) => {
            this._snackbarService.openSnackBarAsText(error.message);
            this._router.navigate(['/pages/marketing/campaign']);
          }
        )
      );
    else this._router.navigate(['/pages/marketing/campaign']);
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
    this.$autoSaveSubscription.unsubscribe();
    this.$formChangeDetection.unsubscribe();
  }
}
