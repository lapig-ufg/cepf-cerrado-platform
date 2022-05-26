import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, NavigationEnd } from '@angular/router';
import { HomePageComponent } from './paginas/home/home.page.component';
import { ProjectPageComponent } from './paginas/project/project.page.component';
import { BiomaPageComponent } from './paginas/bioma/bioma.page.component';
import { OuvidoriaPageComponent } from './paginas/ouvidoria/ouvidoria.page.component';
import { SalvaGuardaPageComponent } from './paginas/salva_guarda/salva_guarda.page.component';
import { CovidgoiasComponent } from './paginas/covidgoias/covidgoias/covidgoias.component';
import { MapComponent } from './uso_do_solo/uso_do_solo.component';
import { MapMobileComponent } from './uso_do_solo/mobile/uso_do_solo-mobile.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {AraticumComponent} from './paginas/araticum/araticum.component';


// tslint:disable-next-line:ban-types
declare let gtag: Function;

const routes: Routes = [

  { path: '', component: HomePageComponent },
/* ROTA PARA paginas */
  { path: 'araticum', component: AraticumComponent },
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

const routesMobile: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'araticum', component: AraticumComponent },
  { path: 'project', component: ProjectPageComponent },
  { path: 'cerrado', component: BiomaPageComponent},
  { path: 'ouvidoria', component: OuvidoriaPageComponent},
  { path: 'salva_guarda', component: SalvaGuardaPageComponent},
  { path: 'usodosolo', component: MapMobileComponent },
  { path: 'covidgoias', component: CovidgoiasComponent },
  { path: 'usodosolo/:token', component: MapComponent },
  { path: 'regions/:token', component: MapComponent },
  { path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(public router: Router) {

    if (window.innerWidth < 1025) {
      router.resetConfig(routesMobile);
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'UA-168214071-1',
          {
            'page_path': event.urlAfterRedirects
          }
        );
      }
    })
  }
}
