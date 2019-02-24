import { Injectable } from '@angular/core';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfMakerService {


createPdf(tableData) {

  var dd = {

    content: [
      // Header
      // Line breaks
      '\n\n',
      // Billing Headers
      {
        columns: [
          { text: 'Billing From' },
          { text: 'Billing To' },
        ]
      },
      // Billing Details
      {
        columns: [
          { text: 'Your Name \n Your Company Inc. \n\n Address \n Street name 1A \n Bayreuth 00000 \n   GER' },
          { text: 'Client Name \n Client Company \n\n Address \n Other street 25 \n Munich 00000 \n   GER' },
        ]
      },
      // Line breaks
      '\n\n',
      // Items
      {
        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          widths: ['*', 40, 'auto', 'auto'],

          body: [
            // Table Header
            ['Product', 'Qty', 'Price', 'Total'],
            // Items
            []
          ]
        }
      },
      // Line breaks
      '\n\n',
      // Signature
      {
        columns: [
          '',
          {
            stack: [
              '_________________________',
              'Your Name',
              'Your job title'
            ]
          },
        ]
      },
      // Line breaks
      '\n\n\n\n\n',
      // Notes Header
      'NOTES',
      'Some notes goes here \n Notes second line',
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true
      },
      bigger: {
        fontSize: 15,
        italics: true,
      }
    },
    defaultStyle: {
      columnGap: 20,
    }
  }

  dd.content[4].table.body[1] = tableData

  pdfMake.createPdf(dd).download();
}

  constructor() { }
}
