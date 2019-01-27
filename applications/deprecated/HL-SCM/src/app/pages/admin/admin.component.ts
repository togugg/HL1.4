import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as Excel from 'excel4node';
//import * as Json2csvParser from 'json2csv';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

export interface Table {
  Name: any;
  Bilanz: any;
}


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {


  accounts: any;
  password: any;

  sortedData: Table[] = [];
  unsortedData: Table[] = [];

  strichlisteJson = {'Intervall': {}, 'Bilanzen':[]};

  strichlisteStartDatum;
  tallySheetNr;

  constructor(
  ) { }






  fromUnixToDate(unix_timestamp: any): any{
    var a = new Date(unix_timestamp * 1000);
     var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
     var year = a.getFullYear();
     var month = months[a.getMonth()];
     var date = a.getDate();
     var hour = a.getHours();
     var min = "0" + a.getMinutes();
     var sec = "0" + a.getSeconds();
     var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min.substr(-2) + ':' + sec.substr(-2) ;
     return time;
  }



  ngOnInit() {
  }

 

}
