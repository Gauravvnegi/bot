import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { campaignConfig } from '../../constant/campaign';
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';
import { ModuleNames } from '@hospitality-bot/admin/shared';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'hospitality-bot-create-content',
  templateUrl: './create-content.component.html',
  styleUrls: ['./create-content.component.scss'],
})
export class CreateContentComponent implements OnInit {
  @Output() changeStep = new EventEmitter();

  readonly campaignConfig = campaignConfig;

  constructor(
    private routesConfigService: RoutesConfigService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  /**
   * @function goBack function to go back on previous page.
   */
  goBack() {
    this.changeStep.emit({ step: 'previous' });
  }

  /**
   * @function openTemplateList function to open template list.
   */
  openTemplateList(type: string) {
    this.changeStep.emit({ step: 'next', templateType: type });
  }

  viewTemplate() {
    this.router.navigate(['template'], {
      relativeTo: this.route,
    });
  }

  createTemplate() {
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.TEMPLATE,
      additionalPath: 'create-template',
    });
  }
}
