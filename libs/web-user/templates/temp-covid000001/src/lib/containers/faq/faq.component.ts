import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { FaqService } from 'libs/web-user/shared/src/lib/services/faq.service';
import { HyperlinkElementService } from 'libs/web-user/shared/src/lib/services/hyperlink-element.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit, OnDestroy {
  @ViewChild('advisories') hyperlinkElement: ElementRef;
  $subscription: Subscription = new Subscription();
  faqCategories = [];
  faqQuestions = [];

  dropdown: boolean = true;

  selectingCategory: string;

  constructor(
    private _faqService: FaqService,
    public _hyperlink: HyperlinkElementService
  ) {}

  ngOnInit(): void {
    this.setFaqConfiguration();
    this.onCategorySelect(this.Faq[0].category);
    this.listenForElementClicked();
  }

  listenForElementClicked() {
    this.$subscription.add(
      this._hyperlink.$element.subscribe((res) => {
        if (res && res['element'] && res['element'] === 'advisories') {
          this.scrollIntoView(this.hyperlinkElement.nativeElement);
        }
      })
    );
  }

  categorySelection() {
    this.dropdown = !this.dropdown;
  }

  scrollIntoView($element): void {
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
    this._hyperlink.setSelectedElement('');
  }

  setFaqConfiguration() {
    this.Faq.forEach((element) => {
      this.faqCategories.push(this.setFieldConfiguration(element.category));
    });
  }

  setFieldConfiguration(label) {
    return this._faqService.setFieldConfigForFaq(label);
  }

  onCategorySelect(event) {
    this.selectingCategory = event;
    this.dropdown = !this.dropdown;
    this.setCategoriesQuestions(event);
  }

  setCategoriesQuestions(category: string) {
    const faqCategory = this.Faq.filter((faq) => faq.category === category);
    faqCategory.forEach((element) => {
      this.faqQuestions = element.faq;
    });
  }

  get Faq() {
    return this._faqService.faqDetails.faq;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
