import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

import { MatListModule } from '@angular/material/list';
import { HttpClientModule } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { DataService } from "./services/data.service";




@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    PagesModule,
    MatToolbarModule,
    MatSidenavModule,
    HttpClientModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatListModule,
    HttpModule,
    BrowserModule,
    FormsModule,
    MatIconModule
  ],
  exports: [],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
