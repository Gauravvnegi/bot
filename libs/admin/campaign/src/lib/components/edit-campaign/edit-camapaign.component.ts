import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';

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
  createContentType = '';
  @ViewChild('stepper') stepper: MatStepper;
  constructor(
    private _fb: FormBuilder,
    private globalFilterService: GlobalFilterService
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initFG(): void {
    this.campaignFG = this._fb.group({
      from: ['', [Validators.required]],
      to: this._fb.array([], Validators.required),
      // cc: this._fb.array([]),
      message: ['', [Validators.required]],
      subject: ['', [Validators.required, Validators.maxLength(200)]],
      previewText: ['', Validators.maxLength(200)],
      topicId: [''],
      templateName: [' '],
      status: [true],
      isDraft: [true],
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
      })
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) this.hotelId = element.hotelId;
    });
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
