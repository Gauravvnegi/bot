import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { routes } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-sidenav-expand',
  templateUrl: './sidenav-expand.component.html',
  styleUrls: ['./sidenav-expand.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('200ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
})
export class SidenavExpandComponent implements OnInit {
  @Input() title: string;
  @Input() submenuItems: any;
  @Input() isExpanded: boolean = true;
  @Input() logoUrl: string;

  @Output() navToggle = new EventEmitter<boolean>();

  ngOnInit(): void {}

  get routes() {
    return routes;
  }

  toggleSideNav() {
    this.isExpanded = !this.isExpanded;
    this.navToggle.emit(this.isExpanded);
  }
}
