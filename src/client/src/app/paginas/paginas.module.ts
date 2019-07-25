import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginaLayoutComponent } from './layout/pagina-layout.component';
import { HomePageComponent } from './home/home.page.component';
import { Pagina1PageComponent } from './pagina1/pagina1.page.component';
import { Pagina2PageComponent } from './pagina2/pagina2.page.component';



@NgModule({
  declarations: [PaginaLayoutComponent, HomePageComponent, Pagina1PageComponent, Pagina2PageComponent],
  imports: [
    CommonModule
  ]
})
export class PaginasModule { }
