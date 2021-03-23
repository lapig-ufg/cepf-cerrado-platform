import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ouvidoria.page',
  templateUrl: './ouvidoria.page.component.html',
  styleUrls: ['./ouvidoria.page.component.scss']
})
export class OuvidoriaPageComponent implements OnInit {

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
