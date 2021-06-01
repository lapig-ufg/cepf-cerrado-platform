import {Component, Injectable, OnInit} from '@angular/core';
import { MapComponent, SearchService } from '../uso_do_solo.component';

@Component({
	selector: 'app-map-mobile',
	templateUrl: 'uso_do_solo-mobile.component.html',
	providers: [SearchService]
	// styleUrls: [
	// 	'./uso_do_solo-mobile.component.scss'
	// ]
})

export class MapMobileComponent extends MapComponent {
	indexOpenConsulta: any = 0;
	tabNum = 0;
  selected = 0;
	height: number;

	ngOnInit() {
    super.ngOnInit();
    this.currentZoom = 4.8;
		this.height = window.innerHeight;
	}

}