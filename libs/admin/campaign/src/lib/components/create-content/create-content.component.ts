import { Component, Input, OnInit } from '@angular/core';
import { campaignConfig } from '../../constant/campaign';
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';
import { ModuleNames } from '@hospitality-bot/admin/shared';
import {
  CampaignForm,
  CampaignType,
  TemplateType,
} from '../../types/campaign.type';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'hospitality-bot-create-content',
  templateUrl: './create-content.component.html',
  styleUrls: ['./create-content.component.scss'],
})
export class CreateContentComponent implements OnInit {
  parentFG: FormGroup;
  readonly campaignConfig = campaignConfig;

  @Input() campaignType: CampaignType;

  constructor(
    private routesConfigService: RoutesConfigService,
    private controlContainer: ControlContainer,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.parentFG = this.controlContainer.control as FormGroup;
  }

  /**
   * @function openTemplateList function to open template list.
   */
  openTemplateList(type: TemplateType) {
    this.inputControls.template.patchValue(type, { emitEvent: false });

    const queryParams = {
      data: btoa(
        JSON.stringify(this.parentFG.getRawValue() as CampaignForm)
      ),
    };
    this.router.navigate(['template'], {
      relativeTo: this.route,
      queryParams: { campaignType: this.campaignType, ...queryParams },
    });
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
