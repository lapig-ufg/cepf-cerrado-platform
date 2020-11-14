import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './paginas/home/home.page.component';
import { ProjectPageComponent } from './paginas/project/project.page.component';
import { BiomaPageComponent } from './paginas/bioma/bioma.page.component';
import { OuvidoriaPageComponent } from './paginas/ouvidoria/ouvidoria.page.component';
import { SalvaGuardaPageComponent } from './paginas/salva_guarda/salva_guarda.page.component';
import { CovidgoiasComponent } from './paginas/covidgoias/covidgoias/covidgoias.component';
import { MapComponent } from './uso_do_solo/uso_do_solo.component';

const routes: Routes = [
/* ROTA RAIZ */ 
  { path: '', component: HomePageComponent },
/* ROTA PARA paginas */
  { path: 'project', component: ProjectPageComponent },
  { path: 'cerrado', component: BiomaPageComponent},
  { path: 'ouvidoria', component: OuvidoriaPageComponent},
  { path: 'salva_guarda', component: SalvaGuardaPageComponent},
  { path: 'usodosolo', component: MapComponent},
  { path: 'covidgoias', component: CovidgoiasComponent },
  { path: 'usodosolo/:token', component: MapComponent },
  { path: 'regions/:token', component: MapComponent },
  { path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
