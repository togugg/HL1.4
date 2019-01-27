import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastComponent } from './forecast.component';
import { YearlyComponent } from './yearly/yearly.component';

import { ForecastRoutingModule } from './forecast-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ForecastRoutingModule
  ],
  declarations: [
    ForecastComponent,
    YearlyComponent]
})
export class ForecastModule { }
