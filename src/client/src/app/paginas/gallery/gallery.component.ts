import {Component, Inject, Input, Optional, OnInit, HostListener} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  innerHeigth: number;
  innerWidth: number;
  images: any[];

  constructor(
      public dialogRef: MatDialogRef<GalleryComponent>,
      private http: HttpClient,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
      public translate: TranslateService,
      private sanitizer: DomSanitizer
  ) {
    this.innerHeigth = window.innerHeight  - 240;
    this.innerWidth = window.innerWidth - 400;
  }

  ngOnInit() {
    this.getAllImages();
  }

  async getAllImages() {
    this.images = [];
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/1_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/2_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/3_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/4_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/5_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/6_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/7_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/8_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/9_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/10_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/11_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/12_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/13_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/14_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/15_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/16_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/17_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/18_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/19_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/20_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/21_BARROS_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/22_BARROS_2019.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/23_BARROS_2019.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/24_BARROS_2019.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/25_BARROS_2019.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/26_BARROS_2019.jpg'), alt: '', title: ''});
    // this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/27_MESQUITA_2019.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/28_MESQUITA_2019.jpg'), alt: '', title: ''});
    // this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/29_MESQUITA_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/30_MESQUITA_2018.jpg'), alt: '', title: ''});
    // this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/31_MESQUITA_2019.jpg'), alt: '', title: ''});
    // this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/32_MESQUITA_2019.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/33_MESQUITA_2019.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/34_MESQUITA_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/35_MESQUITA_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/36_MESQUITA_2018.jpg'), alt: '', title: ''});
    // this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/37_MESQUITA_2019.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/38_CORREIA_2017.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/39_FERREIRA_2016.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/40_FERREIRA_2017.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/41_FERREIRA_2017.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/42_FERREIRA_2015.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/43_FERREIRA_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/44_FERREIRA_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/45_FERREIRA_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/46_FERREIRA_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/47_FERREIRA_2017.jpg'), alt: '', title: ''});
    // this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/48_LAPIG_2013.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/49_LAPIG_2013.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/50_LAPIG_2015.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/51_LAPIG_2016.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/52_LAPIG_2015.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/53_LAPIG_2016.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/54_LAPIG_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/56_LAPIG_2013.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/57_LAPIG_2013.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/58_LAPIG_2013.jpg'), alt: '', title: ''});
    // this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/59_LAPIG_2013.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/60_LAPIG_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/61_LAPIG_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/62_LAPIG_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/63_LAPIG_2015.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/64_LAPIG_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/65_LAPIG_2016.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/66_LAPIG_2015.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/67_LAPIG_2018.jpg'), alt: '', title: ''});
    // this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/68_LAPIG_2013.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/69_LAPIG_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/70_LAPIG_2019.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/71_LAPIG_2018.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/72_LAPIG_2019.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/73_LAPIG_2019.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/74_LAPIG_2016.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/75_LAPIG_2013.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/76_LAPIG_2013.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/77_LAPIG_2013.jpg'), alt: '', title: ''});
    // this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/78_LAPIG_2013.jpg'), alt: '', title: ''});
    this.images.push({source: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/img/gallery/79_LAPIG_2013.jpg'), alt: '', title: ''});

  }
  closeDialog() {
    this.dialogRef.close();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeigth = window.innerHeight - 200;
    this.innerWidth = window.innerWidth - 400;
  }



}
