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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { GoogleAnalyticsService } from './services/google-analytics.service'
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LightboxModule } from 'ngx-lightbox';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData, LocationStrategy, HashLocationStrategy, DecimalPipe } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FileUploadComponent } from './uso_do_solo/file-upload/file-upload.component';
import { RegionReportComponent } from './uso_do_solo/region-report/region-report.component';
import { SpinnerImgComponent } from './uso_do_solo/spinner-img/spinner-img.component';
import { ChartsComponent } from './uso_do_solo/charts/charts.component';
import { ChartModule } from 'primeng/chart';
import { DatePipe } from '@angular/common';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NoCacheHeadersInterceptor } from './interceptors/no-cache-headers-interceptor.interceptor';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DropdownModule } from 'primeng/dropdown';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

import { PanelModule } from 'primeng/panel';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';

registerLocaleData(localePt);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapMobileComponent,
    UsoDoSoloMetadados,
    FileUploadComponent,
    RegionReportComponent,
    SpinnerImgComponent,
    ChartsComponent
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    PanelModule,
    SidebarModule,
    TableModule,
    TooltipModule,
    AccordionModule,
    MatSidenavModule,
    MatTooltipModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    DropdownModule,
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
    MatProgressBarModule,
    MatCardModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollPanelModule,
    PaginasModule,
    ChartModule,
    NgbModule,
    LightboxModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [
      UsoDoSoloMetadados,
      RegionReportComponent,
      ChartsComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    DatePipe,
    DecimalPipe,
    GoogleAnalyticsService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NoCacheHeadersInterceptor,
      multi: true
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerGestureConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
