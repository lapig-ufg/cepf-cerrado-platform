import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MapComponent, UsoDoSoloMetadados } from './uso_do_solo/uso_do_solo.component';
import { MapMobileComponent } from './uso_do_solo/uso_do_solo-mobile.component';
import { AppRoutingModule } from './app-routing.module';
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
import { MatDialogModule } from '@angular/material';

import { HttpClientModule } from '@angular/common/http';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData, LocationStrategy, HashLocationStrategy } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import {ChartModule} from 'primeng/chart';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapMobileComponent,
    UsoDoSoloMetadados
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
    MatDialogModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PaginasModule,
    ChartModule,
    NgbModule.forRoot()
  ],
  entryComponents:[UsoDoSoloMetadados],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
