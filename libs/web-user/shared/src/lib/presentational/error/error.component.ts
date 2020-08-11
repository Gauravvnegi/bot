import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';

@Component({
  selector: 'web-user-error',
  template: `<p class="help is-danger text-danger" [class.hide]="_hide">{{_text}}</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorComponent implements OnInit {

  _text: string;
  _hide = true;

    @Input() set text(value) {
        if (value !== this._text) {
            this._text = value;
            this._hide = !value;
            this.cdr.detectChanges();
        }
    };

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit() { }

}
