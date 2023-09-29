import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TieredMenu } from 'primeng/tieredmenu';

@Component({
  selector: 'hospitality-bot-tiered-menu-button',
  templateUrl: './tiered-menu-button.component.html',
  styleUrls: ['./tiered-menu-button.component.scss'],
})
export class TieredMenuButtonComponent implements OnInit {
  @Input() label: string;
  @Input() icon = 'pi-chevron-down';
  @Input() items: MenuItem[];
  @ViewChild('menu') menu: TieredMenu;
  @ViewChild('btn') button: ElementRef;

  onDocumentClick(event: Event) {
    if (
      !(
        this.menu.el.nativeElement.contains(event.target) ||
        this.button.nativeElement.contains(event.target)
      )
    ) {
      this.menu.hide();
    }
  }

  constructor(private el: ElementRef) {}
  ngOnInit() {
    document.body.addEventListener('click', (event) =>
      this.onDocumentClick(event)
    );
  }
}
