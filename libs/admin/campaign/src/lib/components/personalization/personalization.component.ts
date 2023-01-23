import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { camapign } from '../../constant/demo-data';
import { EmailService } from '../../services/email.service';
import { campaignConfig } from '../../constant/campaign';

@Component({
  selector: 'hospitality-bot-personalization',
  templateUrl: './personalization.component.html',
  styleUrls: ['./personalization.component.scss'],
})
export class PersonalizationComponent implements OnInit, OnDestroy {
  @Output() personalization = new EventEmitter();
  @Input() enablePersonalization = false;
  @Input() name: string;
  personalizationList = camapign.personalization;
  $subscription = new Subscription();
  constructor(private _emailService: EmailService) {}

  ngOnInit(): void {
    this.listenForPersonalizationDisable();
  }

  /**
   * @function listenForPersonalizationDisable TO listen for personalization disable.
   */
  listenForPersonalizationDisable() {
    this._emailService.$disablePersonalizationPopup[this.name].subscribe(
      (response: boolean) => {
        if (response) this.enablePersonalization = false;
      }
    );
  }

  /**
   * @function addPersonalization TO add Personalization.
   */
  addPersonalization(event: PointerEvent, value: string) {
    event.stopPropagation();
    this.personalization.emit(value);
  }

  /**
   * @function openPersonalization function to open personalization on the basis of name.
   */
  openPersonalization(event: PointerEvent) {
    event.stopPropagation();
    this.enablePersonalization = !this.enablePersonalization;
    if (this.name === 'subject')
      this._emailService.$disablePersonalizationPopup.previewText.next(true);
    else this._emailService.$disablePersonalizationPopup.subject.next(true);
  }

  get campaignConfiguration() {
    return campaignConfig;
  }

  /**
   * @function ngOnDestroy unsubscribe subscription
   */
  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
