import {Component, Injectable, OnInit} from '@angular/core';
import { MapComponent } from './uso_do_solo.component';


import {map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import { of } from 'rxjs';

@Component({
	selector: 'app-map-mobile',
	templateUrl: 'uso_do_solo-mobile.component.html',
	styleUrls: [
		'./uso_do_solo-mobile.component.scss'
	]
})

export class MapMobileComponent extends MapComponent {

}