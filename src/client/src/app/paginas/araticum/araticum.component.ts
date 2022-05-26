import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {TutorialsComponent} from '../tutorials/tutorials.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-home',
    templateUrl: './araticum.component.html',
    styleUrls: ['./araticum.component.scss']
})
export class AraticumComponent implements OnInit {
    languages: any = [];
    language: string;

    bntStylePOR: any;
    bntStyleENG: any;

    styleSelected: any;
    styleDefault: any;

    constructor(
        public dialog: MatDialog,
        public translate: TranslateService,
    ) {

        translate.addLangs(['en', 'pt']);
        translate.setDefaultLang('pt');
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|pt/) ? browserLang : 'en');

        this.language = browserLang;

        this.styleSelected = {
            'background-color': '#fe8321'
        };

        this.styleDefault = {
            'background-color': '#707070'
        };
    }

    private setStylesLangButton() {
        if (this.language == 'pt' || this.language == 'pt-br') {
            this.bntStyleENG = this.styleDefault;
            this.bntStylePOR = this.styleSelected;
        } else {
            this.bntStyleENG = this.styleSelected;
            this.bntStylePOR = this.styleDefault;
        }
    }

    changeLanguage(lang) {
        this.translate.use(lang);
        if (this.language != (lang)) {
            this.language = lang;
            this.setStylesLangButton();
        }
    }

    ngOnInit() {
        this.setStylesLangButton();
    }

    openTutorials() {
        this.dialog.open(TutorialsComponent, {
            id: 'tutorials',
            width: 'calc(100% - 20em)',
            height: 'calc(100% - 2em)',
        });
    }

    onClickPlatform(url) {
        window.open(url,  'blank');
    }


}
