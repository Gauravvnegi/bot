import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SpecialCommentsConfigI } from 'libs/web-user/shared/src/lib/data-models/stayDetailsConfig.model';
import { StayDetailsService } from 'libs/web-user/shared/src/lib/services/stay-details.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-special-comments',
  templateUrl: './special-comments.component.html',
  styleUrls: ['./special-comments.component.scss'],
})
export class SpecialCommentsComponent implements OnInit, OnChanges {
  private $subscription: Subscription = new Subscription();
  @Input() parentForm: FormGroup;
  @Input() reservationData;

  @Output()
  addFGEvent = new EventEmitter();

  specialCommentsForm: FormGroup;
  commentsDetailsConfig: SpecialCommentsConfigI;

  constructor(
    protected fb: FormBuilder,
    protected _stayDetailService: StayDetailsService
  ) {
    this.initSpecialCommentsForm();
  }

  ngOnChanges() {
    this.setSpecialComments();
  }

  ngOnInit(): void {
    this.setFieldConfiguration();
    this.registerListeners();
  }

  /**
   * Initialize form
   */
  initSpecialCommentsForm() {
    this.specialCommentsForm = this.fb.group({
      comments: [''],
    });
  }

  setFieldConfiguration() {
    this.commentsDetailsConfig = this._stayDetailService.setFieldConfigForSpecialComments();
  }

  setSpecialComments() {
    if (this.reservationData) {
      this.addFGEvent.next({
        name: 'special_comments',
        value: this.specialCommentsForm,
      });

      this.specialCommentsForm.patchValue(
        this._stayDetailService.special_comments
      );
    }
  }

  registerListeners() {
    this.listenForStayDetailDSchange();
  }

  listenForStayDetailDSchange() {
    this.$subscription.add(
      this._stayDetailService.stayDetailDS$.subscribe((value) => {
        this.specialCommentsForm.patchValue(
          this._stayDetailService.special_comments
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
