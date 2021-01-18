import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { Temp000002RoutingModule } from './temp000002-routing.module';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [...Temp000002RoutingModule.components],
})
export class Temp000002Module {}
