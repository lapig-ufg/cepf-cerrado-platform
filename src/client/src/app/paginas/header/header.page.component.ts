import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header-pages',
  templateUrl: './header.page.component.html',
  styleUrls: ['./header.page.component.scss']
})
export class HeaderPageComponent implements OnInit {

  languages: any = [];
  language: string;
  
  bntStylePOR: any;
	bntStyleENG: any;

	styleSelected: any;
	styleDefault: any;

  constructor(public translate: TranslateService) {
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
		}
		else {
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

}
