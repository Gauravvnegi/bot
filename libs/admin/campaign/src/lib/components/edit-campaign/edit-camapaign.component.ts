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
import { TranslateService } from '@ngx-translate/core';
import { empty, interval, of, Subscription } from 'rxjs';
import { catchError, debounceTime, switchMap } from 'rxjs/operators';
import { Campaign } from '../../data-model/campaign.model';
import { CampaignService } from '../../services/campaign.service';
import { EmailService } from '../../services/email.service';
import { TranslateService } from '@ngx-translate/core';

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
    private _router: Router,
    protected _translateService: TranslateService
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

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
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

  /**
   * @function getHotelId To set the hotel id after extracting from filter array.
   * @param globalQueries The filter list with date and hotel filters.
   */
  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) this.hotelId = element.hotelId;
    });
  }

  /**
   * @function getTemplateId to get template Id from routes query param.
   */
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

  /**
   * @function listenForFormChanges To listen for global changes across form data.
   */
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

  /**
   * @function getCampaignDetails o get campaign detail.
   * @param id campaign id for which the action will be taken.
   */
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

  /**
   * @function addElementToData function to add element to data.
   * @returns resolves promise.
   */
  addElementToData() {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.addFormArray('to', 'toReceivers'),
        this.addEmailControls(),
      ]).then((res) => resolve(res[1]));
    });
  }

  /**
   * @function setFormData function to set form data.
   */
  setFormData() {
    this.addElementToData().then((res) => {
      this.campaignFG.patchValue(res);
      this.datamapped = true;
    });
  }

  /**
   * @function addFormArray function to add form data to an array.
   * @param control campaignFG.
   * @param dataField field where the form data is stored.
   * @returns resolved promise.
   */
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

  /**
   * @function addEmailControls function to get form control for emails.
   * @returns resolved promise.
   */
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

  /**
   * @function listenForAutoSave function to listen for auto save form data.
   */
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
                translateKey:'messages.error.fail',
                priorityMessage: error.message,
              })
              .subscribe();
          }
        );
      })
    );
  }

  /**
   * @function autoSave function to auto save the data.
   * @param data data to be saved.
   * @returns save.
   */
  autoSave(data?) {
    return this._campaignService.save(
      this.hotelId,
      this._emailService.createRequestData(data),
      this.campaignId
    );
  }

  /**
   * @function setTemplate function to set template.
   * @param event event object to patch values.
   */
  setTemplate(event) {
    this.campaignFG.patchValue({
      message: event.htmlTemplate,
      topicId: event.topicId,
      templateId: event.id,
    });
    this.stepper.selectedIndex = 0;
  }

  /**
   * @function changeStep function to change form steps.
   * @param event event object to change form step.
   * @returns
   */
  changeStep(event) {
    if (event.status) {
      this.campaign.templateName = event.data.name;
      this.campaign.topicName = event.data.topicName;
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

  /**
   * @function handleCreateContentChange function to handle created content change.
   * @param event event object for the stepper.
   */
  handleCreateContentChange(event) {
    this.stepper[event.step]();
    if (event.templateType) this.createContentType = event.templateType;
  }

  /**
   * @function setDataAfterUpdate function to set form data after update.
   * @param response updated form.
   */
  setDataAfterUpdate(response) {
    if (response?.value) {
      this.campaignId = response.value.id;
      this.campaign = new Campaign().deserialize(response.value);
    }
  }

  /**
   * @function setDataAfterSave function to set form data after saving.
   * @param response saved data.
   */
  setDataAfterSave(response) {
    if (response) {
      this.campaignId = response.id;
      this.campaign = new Campaign().deserialize(response);
    }
  }

  /**
   * @function saveAndCloseForm function for saving and closing the form.
   */
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

  /**
   * @function ngOnDestroy unsubscribe subscriiption
   */
  ngOnDestroy() {
    this.$subscription.unsubscribe();
    this.$autoSaveSubscription.unsubscribe();
    this.$formChangeDetection.unsubscribe();
  }
}
