import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MapComponent } from './uso_do_solo/uso_do_solo.component';
import { MapMobileComponent } from './uso_do_solo/uso_do_solo-mobile.component';
import { AppRoutingModule } from './app-routing.module';
import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { PaginasModule } from './paginas/paginas.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import { HttpClientModule } from '@angular/common/http';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

const appRoutes: Routes = [
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: 'map-mobile',
    component: MapMobileComponent,
  }
  /*{ path: '',
    redirectTo: '/map',
    pathMatch: 'full'
  }*/
];

const appMobileRoutes: Routes = [
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: 'map-mobile',
    component: MapMobileComponent,
  }
  /*{ path: '',
    redirectTo: '/map-mobile',
    pathMatch: 'full'
  }*/
];

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapMobileComponent,
    AppNavbarComponent,
    LayoutComponent,
    HeaderComponent
  ],
  imports: [
    BrowserAnimationsModule,
    MatExpansionModule,
    MatTabsModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    PaginasModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    NgbModule.forRoot()
  ],
  entryComponents:[],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  public constructor(private router: Router) {

    console.log(window.innerWidth)
    if (window.innerWidth < 768) {
      router.resetConfig(appMobileRoutes);
    }

  }
}
