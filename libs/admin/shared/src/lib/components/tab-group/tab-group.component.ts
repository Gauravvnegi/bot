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
import { Filter } from '../../types/table.type';

@Component({
  selector: 'hospitality-bot-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss'],
})
export class TabGroupComponent implements OnInit {
  @Input() listItems: Filter<string, string>[] = [];
  @Input() selectedIndex = 0;
  @Input() isLoading: boolean;
  @Input() isContent = false;
  @Input() isScrollable = false;
  @Input() view: 'vertical' | 'horizontal' = 'horizontal';
  @Output() selectedTabChange = new EventEmitter();
  @ViewChild('tabFilter') tabFilter: ElementRef;
  @Input() extraGap = 40;
  @Input() isCountVisible: boolean = true;

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
