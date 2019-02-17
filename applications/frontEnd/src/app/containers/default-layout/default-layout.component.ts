import { Component, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from './../../_nav';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnDestroy {
  customerId;
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  constructor(
    private httpService: HttpService,
    private router: Router,
    @Inject(DOCUMENT) _document?: any
    ) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
    this.getCustomerId();
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }

  getCustomerId() {
    let user = document.cookie.match(new RegExp('(^| )' + 'userName' + '=([^;]+)'))[2];
    this.customerId = decodeURIComponent(user).split("@")[1];
    //this.stockQuery.selector.supplierId = this.supplierId;
  }

  logOut() {
    this.httpService.signOut().subscribe((res)=> {
      console.log(res)
      this.router.navigate(['login'])
    })
  }
}
