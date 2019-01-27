import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ChartsModule } from 'ng2-charts/ng2-charts';


import { HistoryRoutingModule } from './history-routing.module';
import { MonthlyComponent } from './monthly/monthly.component';


// Angular

@NgModule({
  imports: [
    CommonModule,
    HistoryRoutingModule,
    FormsModule,
    ChartsModule
  ],
  declarations: [
  MonthlyComponent]
})
export class HistoryModule { }
