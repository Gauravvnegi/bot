import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'web-user-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {
  constructor() {}

  @Input()
  url: string;
  @Input() alt: string;
  @Input() config: any;

  sourceImage = false;
  mobileImage: any;
  tabImage: any;

  ngOnInit(): void {
    if (this.config.responsive) {
      this.imageResponsiveUrls();
    }
  }

  imageResponsiveUrls() {
    if (this.url) {
      let dotIndex = this.url.lastIndexOf('.');
      this.tabImage = [
        this.url.slice(0, dotIndex),
        '-tab',
        this.url.slice(dotIndex),
      ].join('');
      this.mobileImage = [
        this.url.slice(0, dotIndex),
        '-mob',
        this.url.slice(dotIndex),
      ].join('');
    }
  }

  updateUrl(e) {
    this.sourceImage = true;
  }
}
