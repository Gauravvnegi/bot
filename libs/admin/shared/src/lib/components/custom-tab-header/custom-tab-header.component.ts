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
  SimpleChanges,
} from '@angular/core';
import { Filter } from '../../types/table.type';

@Component({
  selector: 'hospitality-bot-custom-tab-header',
  templateUrl: './custom-tab-header.component.html',
  styleUrls: ['./custom-tab-header.component.scss'],
})
export class CustomTabHeaderComponent implements OnInit {
  @Input() listItems: Filter<string, string>[] = [];
  @Input() selectedIndex = 0;
  @Input() isLoading: boolean;
  @Input() isContent = false;
  @Input() isScrollable = true;
  @Input() view: 'vertical' | 'horizontal' = 'vertical';
  @Output() selectedTabChange = new EventEmitter();
  @ViewChild('tabFilter') tabFilter: ElementRef;
  @Input() extraGap = 40;
  @ViewChild('tabContainer') tabContainer: ElementRef;
  @Input() scrollWidth = 300;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  @Input() isSticky = false;
  isScrolledUp: boolean = false;

  ngOnInit(): void {
    this.document
      .getElementById('main-layout')
      ?.addEventListener('scroll', this.onScroll);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Reset selectedIndex to 0 when listItems change
    if (
      changes.listItems.previousValue.length !==
      changes.listItems.currentValue.length
    ) {
      this.selectedIndex = 0;
      this.selectedTabChange.emit(this.listItems[0]?.value);
    }
  }

  onScroll = () => {
    const tabFilterElement = this.tabFilter?.nativeElement;
    if (tabFilterElement) {
      const { top } = tabFilterElement.getBoundingClientRect();
      this.isScrolledUp = top < 120;
    }
  };

  selectTab(index: number): void {
    if (!this.listItems[index]?.disabled) {
      this.selectedIndex = index;
      this.selectedTabChange.emit(this.listItems[index].value);
    }
  }

  scrollTabs(direction: 'left' | 'right'): void {
    const tabContainer = this.tabContainer.nativeElement;
    if (direction === 'left') {
      tabContainer.scrollLeft -= this.scrollWidth;
    } else {
      tabContainer.scrollLeft += this.scrollWidth;
    }
  }
}
