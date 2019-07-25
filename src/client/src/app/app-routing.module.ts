import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomePageComponent } from './paginas/home/home.page.component';
import { Pagina1PageComponent } from './paginas/pagina1/pagina1.page.component';

const routes: Routes = [
/* ROTA RAIZ */ 
  { path: '', component: HomePageComponent },
/* ROTA PARA paginas */
	{ path: 'pagina1', component: Pagina1PageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
