'use strict';
const path = require('path')
var fonts = {
  Roboto: {
    normal: path.join(__dirname,'fonts/Roboto-Regular.ttf'),
    bold: path.join(__dirname,'fonts/Roboto-Medium.ttf'),
    italics: path.join(__dirname,'fonts/Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname,'fonts/Roboto-MediumItalic.ttf')
  }
};

var PdfPrinter = require('pdfmake/src/printer');
var printer = new PdfPrinter(fonts);


class PdfMaker {


 static makePDf(tableData) {
    return new Promise((resolve) => {
      var docDefinition = {


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

      docDefinition.content[4].table.body[1] = tableData

      let chunks = [];

      var pdfBase64;

      var pdfDoc = printer.createPdfKitDocument(docDefinition);

      pdfDoc.on('data', (chunk) => {
        chunks.push(chunk);
      });

      pdfDoc.on('end', () => {
        const result = Buffer.concat(chunks);
        pdfBase64 = ('data:application/pdf;base64,' + result.toString('base64'));
        resolve(pdfBase64)
      });

      pdfDoc.end()
    })
  }

}

module.exports = PdfMaker;
