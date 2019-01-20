import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { BuchenComponent } from './buchen/buchen.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AdminComponent } from './admin/admin.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { NotifierModule } from 'angular-notifier';
import { MatIconModule } from '@angular/material/icon';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DynamicFormsCoreModule } from "@ng-dynamic-forms/core";
import { DynamicFormsMaterialUIModule } from "@ng-dynamic-forms/ui-material";

import { ModalModule } from "ngx-bootstrap";


@NgModule({
  imports: [
    ReactiveFormsModule,
    ModalModule.forRoot(),
    DynamicFormsCoreModule,
    DynamicFormsMaterialUIModule,
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NotifierModule.withConfig( {
      // Custom options in here
      position: {

  horizontal: {

    /**
     * Defines the horizontal position on the screen
     * @type {'left' | 'middle' | 'right'}
     */
    position: 'right',

    /**
     * Defines the horizontal distance to the screen edge (in px)
     * @type {number}
     */
    distance: 20

  },

  vertical: {

    /**
     * Defines the vertical position on the screen
     * @type {'top' | 'bottom'}
     */
    position: 'top',

    /**
     * Defines the vertical distance to the screen edge (in px)
     * @type {number}
     */
    distance: 20,

    /**
     * Defines the vertical gap, existing between multiple notifications (in px)
     * @type {number}
     */
    gap: 10

  }

}
    } )
  ],
  declarations: [
    HomeComponent,
    PagesComponent,
    BuchenComponent,
    AccountsComponent,
    AdminComponent,
  ]
})
export class PagesModule { }
