import { DOCUMENT } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { TemplateService } from 'libs/web-user/shared/src/lib/services/template.service';

@Component({
  selector: 'hospitality-bot-temp000001',
  templateUrl: './temp000001.component.html',
  styleUrls: ['./temp000001.component.scss'],
})
export class Temp000001Component implements OnInit, AfterViewInit {
  isLoaderVisible = true;

  constructor(
    public _templateLoadingService: TemplateLoaderService,
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef,
    private _templateService: TemplateService
  ) {}

  ngOnInit(): void {
    this.initConfig();
    this.registerListeners();
  }

  private initConfig() {
    this.loadStyle('taj.styles.css');
  }

  private registerListeners() {
    this._templateLoadingService.isTemplateLoading$.subscribe((isLoading) => {
      if (isLoading === false) {
        this.isLoaderVisible = false;
      }
    });
  }

  ngAfterViewInit() {
    this.initCssVariables();
  }

  initCssVariables() {
    let cssText = '';
    // this._templateService.templateData.layout_variables = {
    //   '--stepper-background-color': 'blue',
    //   '--header-background-color': 'red',
    //   '--primary-button-background-color': 'red',
    // };
    for (let stepperLayoutVariable in this._templateService.templateData
      .layout_variables) {
      cssText +=
        stepperLayoutVariable +
        ':' +
        this._templateService.templateData.layout_variables[
          stepperLayoutVariable
        ] +
        ';';
    }
    this.elementRef.nativeElement.ownerDocument.body.style.cssText = cssText;
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
