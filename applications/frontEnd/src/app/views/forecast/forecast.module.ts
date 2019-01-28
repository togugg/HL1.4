import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastComponent } from './forecast.component';
import { YearlyComponent } from './yearly/yearly.component';

import { ForecastRoutingModule } from './forecast-routing.module';

import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  imports: [
    CommonModule,
    ForecastRoutingModule,
    ModalModule.forRoot()
  ],
  declarations: [
    ForecastComponent,
    YearlyComponent]
})
export class ForecastModule { }
