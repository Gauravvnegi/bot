import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { routes } from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from '../../../services/global-filters.service';

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
  @Input() bgColor: string = '#4b56c0';

  @Output() navToggle = new EventEmitter<boolean>();

  constructor(private globalFilterService: GlobalFilterService) {}

  ngOnInit(): void {}

  get routes() {
    return routes;
  }

  toggleSideNav() {
    this.isExpanded = !this.isExpanded;
    this.navToggle.emit(this.isExpanded);
    this.globalFilterService.selectedModule.next('');
  }
}
