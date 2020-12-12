import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { TemplateService } from 'libs/web-user/shared/src/lib/services/template.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'hospitality-bot-temp000001',
  templateUrl: './temp000001.component.html',
  styleUrls: ['./temp000001.component.scss'],
})
export class Temp000001Component implements OnInit, AfterViewInit {
  isLoaderVisible: boolean = true;
  $subscription: Subscription = new Subscription();

  constructor(
    public _templateLoadingService: TemplateLoaderService,
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef,
    private _templateService: TemplateService,
    private _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.initConfig();
    this.registerListeners();
  }

  private initConfig(): void {
    //this.loadStyle('taj.styles.css');
    this.initTranslationService();
  }

  private initTranslationService(): void {
    this._translateService.use('en-us');
  }

  private registerListeners(): void {
    this.$subscription.add(
      this._templateLoadingService.isTemplateLoading$.subscribe((isLoading) => {
        if (isLoading === false) {
          this.isLoaderVisible = false;
        }
      })
    );
  }

  ngAfterViewInit(): void {
    this.initCssVariables();
  }

  private initCssVariables(): void {
    let cssText: string = '';
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

  loadStyle(styleName: string): void {
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

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  updateTran(lan) {
    this._translateService.use(lan);
  }
}
