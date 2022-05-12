import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { camapign } from '../../constant/demo-data';
import { EmailService } from '../../services/email.service';
import { campaignConfig } from '../../constant/campaign';

@Component({
  selector: 'hospitality-bot-personalization',
  templateUrl: './personalization.component.html',
  styleUrls: ['./personalization.component.scss'],
})
export class PersonalizationComponent implements OnInit {
  @Output() personalization = new EventEmitter();
  @Input() enablePersonalization = false;
  @Input() name;
  personalizationList = camapign.personalization;
  $subscription = new Subscription();
  constructor(private _emailService: EmailService) {}

  ngOnInit(): void {
    this.listenForPersonalizationDisable();
  }

  listenForPersonalizationDisable() {
    this._emailService.$disablePersonalizationPopup[this.name].subscribe(
      (response) => {
        if (response) this.enablePersonalization = false;
      }
    );
  }

  addPersonalization(event, value) {
    event.stopPropagation();
    this.personalization.emit(value);
  }

  openPersonalization(event) {
    event.stopPropagation();
    this.enablePersonalization = !this.enablePersonalization;
    if (this.name === 'subject')
      this._emailService.$disablePersonalizationPopup.previewText.next(true);
    else this._emailService.$disablePersonalizationPopup.subject.next(true);
  }

  get campaignConfiguration() {
    return campaignConfig;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
