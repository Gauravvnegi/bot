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
export class TieredMenuButtonComponent {
  @Input() label: string;
  @Input() icon = 'pi-chevron-down';
  @Input() items: MenuItem[];
  @Input() link: string;
  @Input() splitButton = false;
  @Input() openNewWindow = false;
  @Input() disabled: boolean = false;
  @Output() clicked = new EventEmitter();
  @ViewChild('menu') menu: TieredMenu;
  @ViewChild('btn') button: ElementRef;
  documentClickHandler: (event: Event) => void;

  constructor(private router: Router) {}

  /**
   *
   * @param event clicked area Event, which have HTMLElement
   * @variable shouldNotExistIn target where should not clicked ( Negation of clicked )
   * @variable existIn where you just clicked on these element
   * @function removeEventListener will remove the event after closing menu,
   * it will prevent to hamper the other click operation
   */
  onDocumentClick(event: Event) {
    const clickedTarget = event.target as HTMLElement;
    const shouldNotExistIn = !(
      this.menu.el.nativeElement.contains(clickedTarget) ||
      this.button.nativeElement.contains(clickedTarget) ||
      clickedTarget.closest('.p-tieredmenu')
    );
    const existIn = clickedTarget.closest('.p-submenu-list');

    if (shouldNotExistIn || existIn) {
      this.menu.hide();
      document.body.removeEventListener('click', this.documentClickHandler);
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

  /**
   *
   * @param event TieredMenu reference event
   * @function documentClickHandler document click reference add
   * for the click on the outside of the tiered menu, because tiered menu
   * is in opened state.
   * @addEventListener add the click event on click of anywhere in the document
   */
  onToggle(event: TieredMenu) {
    this.menu.toggle(event);
    this.documentClickHandler = (event: Event) => this.onDocumentClick(event);
    document.body.addEventListener('click', this.documentClickHandler);
  }
}
