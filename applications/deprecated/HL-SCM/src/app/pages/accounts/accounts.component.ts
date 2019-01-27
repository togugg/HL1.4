import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

export interface Table {
  name: any;
  stand: any;
}


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  accounts: any;
  sortedData: Table[] = [];
  unsortedData: Table[] = [];
  name = "";
  displayedColumns: string[] = ['name', 'stand', 'delete'];

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
          'trash',
          sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-delete-24px.svg'));
  }

 ngOnInit() {

 }

  compare(a,b) {
  if (a.name.toLowerCase() < b.name.toLowerCase())
    return -1;
  if (a.name.toLowerCase() > b.name.toLowerCase())
    return 1;
  return 0;
}



}
