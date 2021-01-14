import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent, PaginaIndisponivelDialog } from './home/home.page.component';
import { HeaderPageComponent } from './header/header.page.component';
import { FooterPageComponent } from './footer/footer.page.component';
import { ProjectPageComponent } from './project/project.page.component';
import { BiomaPageComponent } from './bioma/bioma.page.component';
import { SalvaGuardaPageComponent } from './salva_guarda/salva_guarda.page.component';
import { OuvidoriaPageComponent } from './ouvidoria/ouvidoria.page.component';
import { CovidgoiasComponent } from './covidgoias/covidgoias/covidgoias.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [ 
    HomePageComponent, 
    PaginaIndisponivelDialog,
    HeaderPageComponent, 
    ProjectPageComponent, 
    BiomaPageComponent, 
    OuvidoriaPageComponent,
    SalvaGuardaPageComponent,
    FooterPageComponent,
    CovidgoiasComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  entryComponents:[PaginaIndisponivelDialog],
})
export class PaginasModule { }
