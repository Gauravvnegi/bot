import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'hospitality-bot-sidenav-expand',
  templateUrl: './sidenav-expand.component.html',
  styleUrls: ['./sidenav-expand.component.scss'],
})
export class SidenavExpandComponent implements OnInit {
  @Input() title: string;
  @Input() submenuItems: any;
  @Input() isExpanded: boolean = true;
  @Output() navToggle = new EventEmitter<boolean>();

  ngOnInit(): void {}

  toggleSideNav(){
    this.isExpanded = !this.isExpanded;
    this.navToggle.emit(this.isExpanded);
  }
}
