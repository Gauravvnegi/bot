import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'hospitality-bot-split-button',
  templateUrl: './split-button.component.html',
  styleUrls: ['./split-button.component.scss'],
})
export class SplitButtonComponent implements OnInit {
  @Input() splitOptions: MenuItem[] = [];
  @Input() label: string;
  @Input() isLoading: boolean = false;
  @Input() icon: string;
  @Input() piIcon: string = '';
  @Input() disabled: boolean = false;
  @Input() variant: SplitButtonVariant = 'outlined';

  @Output() onClick = new EventEmitter<Event>();
  ngOnInit(): void {}
}

export type SplitButtonVariant = 'contained' | 'outlined';
