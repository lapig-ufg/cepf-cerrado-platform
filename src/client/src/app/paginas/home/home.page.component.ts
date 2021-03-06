import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TutorialsComponent } from '../tutorials/tutorials.component';
import { TranslateService } from '@ngx-translate/core';
import { GalleryComponent } from "../gallery/gallery.component";
import { LibraryComponent } from "../library/library.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.component.html',
  styleUrls: ['./home.page.component.scss']
})
export class HomePageComponent implements OnInit {
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

  openDialog() {
    //const dialogRef = this.dialog.open(PaginaIndisponivelDialog);

    const dialogRef = this.dialog.open(PaginaIndisponivelDialog, {
      width: '650px'
		});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
    this.setStylesLangButton();
  }
  openTutorials() {
    this.dialog.open(TutorialsComponent, {
      id: 'tutorials',
      width: 'calc(100% - 5vw)',
      height: 'calc(100% - 10vh)',
    });
  }
  openGallery() {
    this.dialog.open(GalleryComponent, {
      id: 'tutorials',
      width: 'calc(100% - 5vw)',
      height: 'calc(100% - 10vh)',
    });
  }
  openLibrary() {
    this.dialog.open(LibraryComponent, {
      id: 'tutorials',
      width: 'calc(100% - 5vw)',
      height: 'calc(100% - 10vh)',
    });
  }


}

@Component({
  selector: 'pagina-indisponivel-dialog',
  templateUrl: 'pagina-indisponivel-dialog.html',
})
export class PaginaIndisponivelDialog {
  constructor(
    public dialogRef: MatDialogRef<PaginaIndisponivelDialog>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
