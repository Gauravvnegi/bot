import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';

@Component({
  selector: 'hospitality-bot-temp000001',
  templateUrl: './temp000001.component.html',
  styleUrls: ['./temp000001.component.scss'],
})
export class Temp000001Component implements OnInit {
  isLoaderVisible = true;

  constructor(
    public _templateLoadingService: TemplateLoaderService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.initConfig();
    this.registerListeners();
  }

  private initConfig() {
    // this.loadStyle('taj.styles.css');
  }

  private registerListeners() {
    this._templateLoadingService.isTemplateLoading$.subscribe((isLoading) => {
      if (isLoading === false) {
        this.isLoaderVisible = false;
      }
    });
  }

  loadStyle(styleName: string) {
    const head = this.document.getElementsByTagName('head')[0];
    let themeLink = this.document.getElementById(
      'client-theme'
    ) as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = styleName;
    } else {
      const style = this.document.createElement('link');
      style.id = 'client-theme';
      style.rel = 'stylesheet';
      style.href = `${styleName}`;

      head.appendChild(style);
    }
  }
}
