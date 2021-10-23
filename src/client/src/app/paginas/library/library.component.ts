import {Component, Inject, Input, Optional, OnInit, HostListener} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {PageEvent} from '@angular/material/paginator';
import { articlesJson } from './articles';

@Component({
    selector: 'app-library',
    templateUrl: './library.component.html',
    styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
    search: string;
    innerHeigth: number;
    articles: Article[];
    literature: any[];
    publications: any[];
    showArticles: any[];
    showLiteratures: any[];
    showPublications: any[];
    paginateArticles: Paginate;
    paginateLiteratures: Paginate;
    paginatePublications: Paginate;

    constructor(
        public dialogRef: MatDialogRef<LibraryComponent>,
        private http: HttpClient,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        public translate: TranslateService,
        private sanitizer: DomSanitizer
    ) {
        this.search = '';
        this.paginateArticles = {
            length: 385,
            pageSize: 0,
            pageSizeOptions: [6]
        };
        this.paginateLiteratures = {
            length: 39,
            pageSize: 0,
            pageSizeOptions: [6]
        };
        this.paginatePublications = {
            length: 2,
            pageSize: 0,
            pageSizeOptions: [6]
        };
        this.innerHeigth = window.innerHeight - 240;
        this.getAllArticlesFiles();
        this.getAllLiteratureFiles();
        this.getAllPublicationsFiles();
    }

    ngOnInit() {
    }

    getAllArticlesFiles() {
        this.articles = [];
        articlesJson.forEach(article => {
            article.path = this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/library/articles/' + article.id + '.pdf');
            this.articles.push(article);
        });
        this.showArticles = this.articles.slice(0, 6);
    }

    getAllLiteratureFiles() {
        this.literature = [];
        for (let i = 0; i <= 39; i++) {
            this.literature.push({path: this.sanitizer.bypassSecurityTrustResourceUrl('../../../assets/documents/library/literature/' + i + '.pdf')});
        }
        this.showLiteratures = this.literature.slice(0, 6);
    }

    getAllPublicationsFiles() {
        this.publications = [];
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

    public getDataArticles(ev?: PageEvent) {
        console.log(ev);
        const startIndex = ev.pageIndex * ev.pageSize;

        const endIndex = startIndex < length ?
            Math.min(startIndex + ev.pageSize, length) :
            startIndex + ev.pageSize;
        this.showArticles = this.articles.slice(startIndex, endIndex);
    }
    public getDataLiteratures(ev?: PageEvent) {
        const startIndex = ev.pageIndex * ev.pageSize;

        const endIndex = startIndex < length ?
            Math.min(startIndex + ev.pageSize, length) :
            startIndex + ev.pageSize;
        this.showLiteratures = this.literature.slice(startIndex, endIndex);
    }
}

export interface Paginate {
    length: number;
    pageSize: number;
    pageSizeOptions: number[];
}

export interface Article {
    id: string;
    title: string;
    keys: string;
    path?: SafeResourceUrl;
}

