import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { BuchenComponent } from './buchen/buchen.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AdminComponent } from './admin/admin.component';


const routes: Routes = [
  { path: 'pages', component: PagesComponent ,
  children:[
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'buchen', component: BuchenComponent },
  { path: 'accounts', component: AccountsComponent}
],}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class PagesRoutingModule { }
