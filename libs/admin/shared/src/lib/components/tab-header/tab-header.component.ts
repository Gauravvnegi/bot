import { DOCUMENT } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'hospitality-bot-tab-header',
  templateUrl: './tab-header.component.html',
  styleUrls: ['./tab-header.component.scss'],
})
export class TabHeaderComponent implements OnInit {
  @Input() listItems = [];
  @Input() selectedIndex = 0;
  @Output() selectedTabChange = new EventEmitter();
  @ViewChild('tabFilter') tabFilter: ElementRef;
  @Input() extraGap = 40;

  @Input() isSticky = false;
  isScrolledUp: boolean = false;
  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    this.document
      .getElementById('main-layout')
      ?.addEventListener('scroll', this.onScroll);
  }

  onSelectedTabChange(event) {
    this.selectedTabChange.next(event);
  }

  onScroll = () => {
    const tabFilterElement = this.tabFilter?.nativeElement;
    if (tabFilterElement) {
      const { top } = tabFilterElement.getBoundingClientRect();
      this.isScrolledUp = top < 120;
    }
  };
}
