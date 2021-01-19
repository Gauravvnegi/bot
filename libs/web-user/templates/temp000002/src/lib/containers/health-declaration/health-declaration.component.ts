import { Component, OnInit } from '@angular/core';
import { HealthDeclarationComponent as BaseHealthDeclarationComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/health-declaration/health-declaration.component';

@Component({
  selector: 'hospitality-bot-health-declaration',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/health-declaration/health-declaration.component.html',
  styleUrls: ['./health-declaration.component.scss'],
})
export class HealthDeclarationComponent extends BaseHealthDeclarationComponent {}
