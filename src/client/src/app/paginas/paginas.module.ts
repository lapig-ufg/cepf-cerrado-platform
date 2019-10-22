import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home/home.page.component';
import { HeaderPageComponent } from './header/header.page.component';
import { FooterPageComponent } from './footer/footer.page.component';
import { ProjectPageComponent } from './project/project.page.component';


@NgModule({
  declarations: [ HomePageComponent, HeaderPageComponent, ProjectPageComponent, FooterPageComponent],
  imports: [
    CommonModule
  ]
})
export class PaginasModule { }
