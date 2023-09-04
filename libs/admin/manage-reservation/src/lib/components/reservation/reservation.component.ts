import { Component } from '@angular/core';
import {
  EntitySubType,
  EntityType,
} from '@hospitality-bot/admin/shared';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'hospitality-bot-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent {

  constructor(
    private formService: FormService,
  ) {}

}

export enum Feedback {
  STAY = 'STAYFEEDBACK',
  TRANSACTIONAL = 'TRANSACTIONALFEEDBACK',
  BOTH = 'ALL',
}
