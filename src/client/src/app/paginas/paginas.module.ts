import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent, PaginaIndisponivelDialog } from './home/home.page.component';
import { HeaderPageComponent } from './header/header.page.component';
import { FooterPageComponent } from './footer/footer.page.component';
import { ProjectPageComponent } from './project/project.page.component';
import { BiomaPageComponent } from './bioma/bioma.page.component';
import { SalvaGuardaPageComponent } from './salva_guarda/salva_guarda.page.component';
import { OuvidoriaPageComponent } from './ouvidoria/ouvidoria.page.component';
import { CovidgoiasComponent } from './covidgoias/covidgoias/covidgoias.component'


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
    CommonModule
  ],
  entryComponents:[PaginaIndisponivelDialog],
})
export class PaginasModule { }
