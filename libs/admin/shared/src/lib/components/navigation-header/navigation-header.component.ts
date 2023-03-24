import { DOCUMENT, Location } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fullMonths } from '../../constants';
import { NavRouteOptions } from '../../types/common.type';

@Component({
  selector: 'hospitality-bot-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss'],
})
export class NavigationHeaderComponent implements OnInit, OnDestroy {
  draftDate: string;
  isScrolledUp: boolean;

  @Input() heading: string;
  @Input() routes: NavRouteOptions = [];
  @Input() set dateTime(value: number) {
    if (value) {
      this.setDraftTime(new Date(value));
    }
  }

  @ViewChild('header') header: ElementRef;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.document
      .getElementById('main-layout')
      ?.addEventListener('scroll', this.onScroll);
  }

  setDraftTime(date: Date) {
    const currentDate = date.getDate();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    const fullDate = `${fullMonths[currentMonth]}, ${currentDate} ${currentYear}`;

    const currentTime = date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    this.draftDate = `${fullDate} ${currentTime}`;
  }

  back() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.document
      .getElementById('main-layout')
      ?.removeEventListener('scroll', this.onScroll);
  }

  onScroll = () => {
    const { top } = this.header?.nativeElement.getBoundingClientRect();
    this.isScrolledUp = top < 20;
  };
}
