import { Injectable } from '@angular/core';
import { Subject, Subscription, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class EventBusService {
  private subject = new Subject<any>();

  constructor() {}

  /**
   *
   * @param events event type as string
   * @param action callback function
   */
  on(event: Events, action: any): Subscription {
    return this.subject
      .pipe(
        filter((e: EmitEvent) => e.name === event),
        map((e: EmitEvent) => e.value)
      )
      .subscribe(action);
  }

  emit(event: EmitEvent) {
    this.subject.next(event);
  }
}

export class EmitEvent {
  /**
   * @param name name of the event
   * @param value value of the event (optional)
   * @author Amit Singh
   */
  constructor(public name: any, public value?: any) {}
}

export enum Events {
  added
}
