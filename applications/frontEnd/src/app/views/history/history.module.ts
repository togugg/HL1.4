import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ModalModule } from 'ngx-bootstrap/modal';

import { HistoryRoutingModule } from './history-routing.module';
import { MonthlyComponent } from './monthly/monthly.component';
import { HistoryComponent } from './history.component';


// Angular

@NgModule({
  imports: [
    CommonModule,
    HistoryRoutingModule,
    FormsModule,
    ChartsModule,
    ModalModule.forRoot()
  ],
  declarations: [
  MonthlyComponent,
  HistoryComponent]
})
export class HistoryModule { }
