import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';
import { MatTableDataSource } from '@angular/material';
import { NotifierService } from 'angular-notifier';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

export interface Table {
  name: any;
  stand: any;
}


@Component({
  selector: 'app-buchen',
  templateUrl: './buchen.component.html',
  styleUrls: ['./buchen.component.css']
})
export class BuchenComponent implements OnInit {

  accounts: any;
  sortedData: Table[] = [];
  unsortedData: Table[] = [];
  name = "";
  displayedColumns: string[] = ['name'];
  dataSource;
  activeUser = "";
  bilanzOfActiveUser = 0;
  neueBuchung = 0;
  undoTransaction = false;
  log: any;

  private readonly notifier: NotifierService;


  constructor(
    notifierService: NotifierService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.notifier = notifierService;
    iconRegistry.addSvgIcon(
      'info',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/baseline-info-24px.svg'));
  }

  ngOnInit() {
  }

  addingToBuchung(plus: number) {
    this.neueBuchung += plus;
  }



  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }





}
