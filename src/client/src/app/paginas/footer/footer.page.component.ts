import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer-pages',
  templateUrl: './footer.page.component.html',
  styleUrls: ['./footer.page.component.scss']
})
export class FooterPageComponent implements OnInit {

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

   }

  ngOnInit() {
  }

}
