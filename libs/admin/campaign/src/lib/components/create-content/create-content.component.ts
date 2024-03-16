import { Component, OnInit } from '@angular/core';
import { campaignConfig } from '../../constant/campaign';
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';
import { ModuleNames } from '@hospitality-bot/admin/shared';
import { CampaignForm, TemplateType } from '../../types/campaign.type';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignService } from '../../services/campaign.service';
@Component({
  selector: 'hospitality-bot-create-content',
  templateUrl: './create-content.component.html',
  styleUrls: ['./create-content.component.scss'],
})
export class CreateContentComponent implements OnInit {
  parentFG: FormGroup;
  readonly campaignConfig = campaignConfig;

  constructor(
    private routesConfigService: RoutesConfigService,
    private controlContainer: ControlContainer,
    private router: Router,
    private route: ActivatedRoute,
    private campaignService: CampaignService
  ) {}

  ngOnInit(): void {
    this.parentFG = this.controlContainer.control as FormGroup;
  }

  /**
   * @function openTemplateList function to open template list.
   */
  openTemplateList(type: TemplateType) {
    this.campaignService.templateData.next(type);
    this.routesConfigService.navigate({
      additionalPath: 'template',
    });
    this.router.navigate(['template'], { relativeTo: this.route });
  }

  createTemplate() {
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.TEMPLATE,
      additionalPath: 'create-template',
    });
  }

  get inputControls() {
    return this.parentFG.controls as Record<
      keyof CampaignForm,
      AbstractControl
    >;
  }
}
