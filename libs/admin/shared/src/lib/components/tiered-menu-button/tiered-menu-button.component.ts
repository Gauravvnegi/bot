import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
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
  @Input() link: string;
  @Input() splitButton = false;
  @Input() openNewWindow = false;
  @Output() clicked = new EventEmitter();
  @ViewChild('menu') menu: TieredMenu;
  @ViewChild('btn') button: ElementRef;

  constructor(private router: Router) {}
  ngOnInit() {
    document.body.addEventListener('click', (event) =>
      this.onDocumentClick(event)
    );
  }

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

  labelClickedAction() {
    if (this.link && this.openNewWindow) {
      window.open(this.link);
    } else if (this.link) {
      this.router.navigate([this.link]);
    }
    this.clicked.emit(true);
  }
}
