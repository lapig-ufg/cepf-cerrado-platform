import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomePageComponent } from './paginas/home/home.page.component';
import { ProjectPageComponent } from './paginas/project/project.page.component';
import { MapComponent } from './uso_do_solo/uso_do_solo.component';

const routes: Routes = [
/* ROTA RAIZ */ 
  { path: '', component: HomePageComponent },
/* ROTA PARA paginas */
  { path: 'project', component: ProjectPageComponent },
  { path:'layout', component: LayoutComponent },
  { path: 'usodosolo', component: MapComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
