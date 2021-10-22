import {Component, Inject, Input, Optional, OnInit, HostListener} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-tutorials',
  templateUrl: './tutorials.component.html',
  styleUrls: ['./tutorials.component.scss']
})
export class TutorialsComponent implements OnInit {

  innerHeigth: number;
  pdfs: any;
  pdfsFolder: string;

  constructor(
      public dialogRef: MatDialogRef<TutorialsComponent>,
      private http: HttpClient,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
      public translate: TranslateService,
      private sanitizer: DomSanitizer
  ) {
    this.innerHeigth = window.innerHeight  - 240;
    this.pdfsFolder = '../../assets/documents/tutorials'
    this.pdfs = [];
  }

  ngOnInit() {
    this.getAllFiles();
  }

  async getAllFiles() {
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/PDF/1.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/PDF/2.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/PDF/3.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/PDF/4.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/PDF/5.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/PDF/6.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/PDF/7.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/PDF/8.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/PDF/9.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/PDF/10.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/PDF/11.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/PDF/12.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/PDF/13.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/A TOOL TO ANALYZE ORTHOMOSAIC IMAGES FROM AGRICULTURAL FIELD TRIALS IN R FIELDimageR.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/CONHECIMENTOS BÁSICOS.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/CONVERSÃO DE ARQUIVOS NO FORMATO KML PARA SHAPEFILE QGIS 3.4.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/CONVERSÃO DE ARQUIVOS NO FORMATO SHAPEFILE PARA KML QGIS 3.4.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/CRIAÇÃO DE VETORES (POLÍGONOS, PONTOS E LINHAS) QGIS 3.4.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/ELABORAÇÃO DE CARTA DE LOCALIZAÇÃO QGIS 3.4.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/IMPORTAÇÃO DE CAMADAS MATRICIAIS QGIS 3.4.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/IMPORTAÇÃO DE CAMADAS VETORIAIS QGIS 3.4.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/RECORTE DE CAMADAS  MATRICIAIS QGIS 3.4.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/RECORTE DE FEIÇÕES VETORIAIS QGIS 3.4.pdf')});
    this.pdfs.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/tutorials/VETORIZAÇÃO DE CAMADAS MATRICIAIS QGIS 3.4.pdf')});
  }
  closeDialog() {
    this.dialogRef.close();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeigth = window.innerHeight - 240;
  }



}
