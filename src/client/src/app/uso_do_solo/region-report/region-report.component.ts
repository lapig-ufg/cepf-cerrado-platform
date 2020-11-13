import { Component, Inject, Input, Optional, OnInit, HostListener } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Lightbox } from 'ngx-lightbox';
import logos from '../logos';
import * as moment from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { GoogleAnalyticsService } from '../../services/google-analytics.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
declare let html2canvas: any;

@Component({
  selector: 'app-region-report',
  templateUrl: './region-report.component.html'
})
export class RegionReportComponent implements OnInit {
  innerHeigth: number;
  dados: any = {};
  texts: any = {};
  loading: boolean;
  svgLoading: string;
  urlTerraClass: Array<{ src: string; caption: string; thumb: string }> = [];
  urlImagesLandSat: Array<{ src: string; caption: string; thumb: string }> = [];
  constructor(
    private http: HttpClient,
    private lightBox: Lightbox,
    private decimalPipe: DecimalPipe,
    public dialogRef: MatDialogRef<RegionReportComponent>,
    public googleAnalyticsService: GoogleAnalyticsService,
    public translate: TranslateService,
    @Optional() @Inject(MAT_DIALOG_DATA) public params: any
  ) {
    this.loading = false;
    this.innerHeigth = window.innerHeight - 180;
    this.dados = params.dados;
    this.svgLoading = '/assets/img/loading.svg';
    // this.setConfigChart();
  }

  ngOnInit() {
    this.getTexts();
    let register_event = this.dados.type + "_" + this.dados.region.metadata.region_display
    this.googleAnalyticsService.eventEmitter("openRegionsReport", "Region_Report", register_event, 12);

  }

  async getTexts() {
    this.texts['label_img'] = 'TerraClass Cerrado';
    this.texts['label_title'] = this.translate.instant(this.dados.type + '.title', {name: this.dados.region.metadata.region_display})
    this.texts['label_info'] = this.translate.instant(this.dados.type + '.info')
    this.texts['label_region'] = this.translate.instant(this.dados.type + '.region');
  }
  getValueBurnetArea(item) {
    return item.area_queimada > 0 ? this.decimalPipe.transform(item.area_queimada, '1.2-2') + '  km²' : '-';
  }

  setConfigChart() {
    this.dados.graphic.options['showAllTooltips'] = true;
    this.dados.graphic.options['responsive'] = true;
  }

  openLightBoxTerraClass(): void {
    const ob = {
      src: this.dados.region.terraclass.imgLarge,
      caption: this.texts.label_img,
      thumb: this.dados.region.terraclass.imgSmall
    };
    this.urlTerraClass.push(ob);
    this.lightBox.open(this.urlTerraClass);
  }

  openLightBoxImagesLandSat(image): void {
    this.urlImagesLandSat = [];
    const ob = {
      src: image.imgLarge,
      caption: this.translate.instant('year') + ' ' + image.year + ' | ' + this.dados.region.metadata.region_display,
      thumb: image.imgLarge
    };
    this.urlImagesLandSat.push(ob);
    this.lightBox.open(this.urlImagesLandSat);
  }

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.addEventListener("load", function () {
        resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }
  async canvasToBase64Chart() {
    let canvas = await html2canvas(document.querySelector("#reportChart"));
    return canvas.toDataURL('image/png');
  }
  separar(base, maximo) {
    let resultado = [[]];
    let grupo = 0;

    for (let indice = 0; indice < base.length; indice++) {
      if (resultado[grupo] === undefined) {
        resultado[grupo] = [];
      }

      resultado[grupo].push(base[indice]);

      if ((indice + 1) % maximo === 0) {
        grupo = grupo + 1;
      }
    }
    return resultado;
  }

  async printReportCounty() {


    let register_event = this.dados.region.type + "_" + this.dados.region.metadata.region_display
    this.googleAnalyticsService.eventEmitter("printRegionsReport", "Print_Report", register_event, 11);

    this.loading = true;
    let language = this.dados.language.replace('lang=', '');
    let self = this;


    let document = {
      pageSize: 'A4',
      // by default we use portrait, you can change it to landscape if you wish
      pageOrientation: 'portrait',

      // [left, top, right, bottom]
      pageMargins: [40, 70, 40, 80],

      header: {
        margin: [24, 10, 24, 30],
        columns: [
          {
            image: logos.logoCEPF[this.dados.language],
            width: 80
          },
          {
            // [left, top, right, bottom]
            margin: [65, 15, 10, 10],
            text: this.texts.label_title.toUpperCase(),
            style: 'titleReport',
          },

        ]
      },
      footer: function (currentPage, pageCount) {
        return {
          table: {
            widths: '*',
            body: [
              [
                { image: logos.signature, colSpan: 3, alignment: 'center', fit: [400, 45] },
                {},
                {},
              ],
              [
                { text: 'https://cerradodpat.org', alignment: 'left', style: 'textFooter', margin: [60, 0, 0, 0] },
                { text: moment().format('DD/MM/YYYY HH:mm:ss'), alignment: 'center', style: 'textFooter', margin: [0, 0, 0, 0] },
                { text: logos.page.title[language] + currentPage.toString() + logos.page.of[language] + '' + pageCount, alignment: 'right', style: 'textFooter', margin: [0, 0, 60, 0] },
              ],
            ]
          },
          layout: 'noBorders'
        };
      },
      content: [],
      styles: {
        titleReport: {
          fontSize: 16,
          bold: true
        },
        textFooter: {
          fontSize: 9
        },
        textImglegend: {
          fontSize: 9
        },
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        data: {
          bold: true,
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        codCar: {
          fontSize: 11,
          bold: true,
        },
        textObs: {
          fontSize: 11,
        },
        tableDpat: {
          margin: [0, 5, 0, 15],
          fontSize: 11,
        },
        tableDpatImage: {
          fontSize: 7,
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        citySummary: {
          fontSize: 13,
          color: 'black'
        },
        metadata: {
          background: '#0b4e26',
          color: '#fff'
        }
      }
    };

    if (this.dados.region.metadata) {
      // @ts-ignore
      let columns = [];
      let legend = [];

      document.content.push({ text: this.texts.label_info, style: 'subheader' });
      legend.push({ text: this.translate.instant('metadata').toUpperCase(), alignment: 'left', style: 'data', margin: [0, 5, 0, 5] });
      // @ts-ignore
      let table = {
        style: 'tableDpat', layout: 'noBorders', widths: [150], table: {
          body: [
            [
              { text: self.texts.label_region, alignment: 'left' },
              { text: self.dados.region.metadata.region_display, alignment: 'left', style: 'data' }
            ],
            [
              { text: self.texts.label_area, alignment: 'left' },
              { text: self.decimalPipe.transform(self.dados.region.metadata.area, '1.2-2') + '  km²', alignment: 'left', style: 'data' }
            ]
          ]
        }
      };
      legend.push(table);
      legend.push({
        image: await self.getBase64ImageFromUrl(self.dados.region.legendas.legendRegion),
        width: 120,
        alignment: 'left'
      });
      legend.push({
        image: await self.getBase64ImageFromUrl(self.dados.region.legendas.legendTerraclass),
        width: 130,
        alignment: 'left'
      });

      columns.push(
        [
          {
            image: await self.getBase64ImageFromUrl(self.dados.region.terraclass.imgLarge),
            width: 300,
            margin: 5,
            alignment: 'center'
          },
          { text: this.texts.label_img, alignment: 'center', style: 'data', margin: [0, 3, 0, 10] },
        ],
        legend,
      );
      document.content.push({ columns: columns });
    }

    if (this.dados.region.chart_pastagem_queimadas_peryear.data.datasets[0].data.length > 0) {
      document.content.push({ text: this.translate.instant('title_chart_pasture'), style: 'subheader' });
      document.content.push({ image: await self.canvasToBase64Chart(), width: 490, alignment: 'center', margin: [2, 10, 2, 0] });
    }
    // if (self.dados.region.anual_statistic) {
    //   document.content.push({ text: self.texts.label_images, style: 'subheader' });
    //   let columnsImages = self.separar(self.dados.region.anual_statistic, 3);
    //
    //   for (let [index, images] of columnsImages.entries()) {
    //     let sizeColumns = images.length;
    //     let imagesLanset = [];
    //     for (let [index, image] of images.entries()) {
    //       let marginLeft: number = sizeColumns <= 2 ? 43 : 2;
    //       imagesLanset.push([
    //         { text: self.texts.label_year + ' ' + image.year, alignment: 'center', margin: [0, 5, 0, 0] },
    //         { image: await self.getBase64ImageFromUrl(image.imgSmall), width: 170, alignment: 'center', margin: [2, 2, 2, 0] },
    //       ]);
    //     }
    //     document.content.push({ columns: imagesLanset });
    //   }
    // }
    if (self.dados.region.table_pastagem_queimadas_peryear.length > 0) {
      document.content.push({ text: this.translate.instant('title_table_pasture'), style: 'subheader', pageBreak: 'before' });
      // document.content.push({ text: self.dados.ranking.table.description + ' ' + self.dados.ranking.desmatInfo.Viewvalue, margin: [2, 30, 20, 10], alignment: 'center', style: 'citySummary' });
      let tableCounties = {
        style: 'tableCounty',
        layout: 'headerLineOnly',
        table: {
          headerRows: 1,
          widths: ['*', 200, '*', '*'],
          body: [],
          margin: 10
        }
      };
      let headers = this.translate.instant('analyzed_area_pasture_per_year');
      tableCounties.table.body.push([
        { text: headers[0], alignment: 'center' },
        { text: headers[1], alignment: 'center' },
        { text: headers[2], alignment: 'center' }
      ]);
      for (let [index, year] of self.dados.region.table_pastagem_queimadas_peryear.entries()) {
        tableCounties.table.body.push([
          { text: year.year, alignment: 'center' },
          { text: self.decimalPipe.transform(year.area_pastagem, '1.2-2') + '  km²', alignment: 'center' },
          { text: this.getValueBurnetArea(year), alignment: 'center' }
        ]);
      }
      document.content.push(tableCounties);
    }

    const filename = 'Report - ' + self.dados.region.metadata.region_display + '.pdf';

    pdfMake.createPdf(document).download(filename);
    this.loading = false;
  }

  closeDialog() {
    this.dialogRef.close({ event: 'close' });
  }

}
