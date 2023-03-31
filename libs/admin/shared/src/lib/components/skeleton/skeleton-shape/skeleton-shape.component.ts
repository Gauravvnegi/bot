import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'skeleton-shape',
  host: {
    class: 'pulse',
  },
  template: ``,
  styles: [
    `
      :host {
        display: block;
        width: var(--skeleton-rect-width);
        height: var(--skeleton-rect-height);
        border-radius: var(--skeleton-rect-borderRadius);
        background: rgb(239, 241, 246) no-repeat;
      }
    `,
  ],
})
export class SkeletonShapeComponent implements OnInit {
  width: string;
  height: string;
  borderRadius: string;
  className: string;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit() {
    const host = this.host.nativeElement;

    if (this.className) {
      host.classList.add(this.className);
    }

    host.style.setProperty('--skeleton-rect-width', this.width ?? '100%');
    host.style.setProperty('--skeleton-rect-height', this.height ?? '20px');
    host.style.setProperty(
      '--skeleton-rect-borderRadius',
      this.borderRadius ?? '10px'
    );
  }
}
