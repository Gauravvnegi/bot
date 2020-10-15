import {
  Component,
  OnInit,
  Input,
  ViewContainerRef,
} from '@angular/core';
import { ApplicationStatusComponent } from '../application-status/application-status.component';

@Component({
  selector: 'hospitality-bot-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent extends ApplicationStatusComponent implements OnInit {
  
}
