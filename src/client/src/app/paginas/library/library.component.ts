import {Component, Inject, Input, Optional, OnInit, HostListener} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {

  innerHeigth: number;
  articles: any[];
  literature: any[];
  publications: any[];


  constructor(
      public dialogRef: MatDialogRef<LibraryComponent>,
      private http: HttpClient,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
      public translate: TranslateService,
      private sanitizer: DomSanitizer
  ) {
    this.innerHeigth = window.innerHeight  - 240;
    this.getAllArticlesFiles();
    this.getAllLiteratureFiles();
    this.getAllPublicationsFiles();
    console.log(this.articles, this.publications, this.literature)
  }

  ngOnInit() {
  }

   getAllArticlesFiles() {
    this.articles = []
    for (let i = 1; i <= 10; i++) {
      this.articles.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/library/articles/' + i + '.pdf')});
    }
  }
   getAllLiteratureFiles() {
    this.literature = []
    for (let i = 1; i <= 10; i++) {
      this.literature.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/library/literature/' + i + '.pdf')});
    }
  }
   getAllPublicationsFiles() {
    this.publications = []
    this.publications.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/library/publications/1.pdf')});
    this.publications.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/library/publications/2.pdf')});
  }

  closeDialog() {
    this.dialogRef.close();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeigth = window.innerHeight - 240;
  }



}
