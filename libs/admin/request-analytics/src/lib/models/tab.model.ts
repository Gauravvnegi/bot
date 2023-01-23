import { Type } from '@angular/core';
export class Tab {
  public id: number;
  public title: string;
  public tabData: any;
  public active: boolean;
  public component: Type<any>;
  constructor(input) {
    this.tabData = input.tabData;
    this.component = input.component;
    this.title = input.title;
  }
}
