import {Component, Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import * as ol from 'openlayers';

import {Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';

import BingMaps from 'ol/source/BingMaps';
import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import OlView from 'ol/View';
import * as OlProj from 'ol/proj';
import TileGrid from 'ol/tilegrid/TileGrid';
import * as OlExtent from 'ol/extent.js';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import VectorSource from 'ol/source/Vector';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

const SEARCH_URL = 'service/map/search';
const PARAMS = new HttpParams({
  fromObject: {
    format: 'json'
  }
});


@Injectable()
export class SearchService {
  constructor(private http: HttpClient) {}

  search(term: string) {
    if (term === '') {
      return of([]);
    }

    return this.http.get(SEARCH_URL, {params: PARAMS.set('key', term)}).pipe(
        map(response => response)
      );
  }
}


@Component({
	selector: 'app-map',
	templateUrl: './uso_do_solo.component.html',
	providers: [SearchService],
	styleUrls: [
		'./uso_do_solo.component.css'
	]
})

export class MapComponent implements OnInit {
	map: OlMap;
	layers: Array<TileWMS>;
	tileGrid: TileGrid;
	projection: OlProj;
	currentZoom: Number;
	regionsLimits: any;

  mapbox: any;
  satelite: any;
	estradas: any;
  relevo: any;
  landsat: any;
  descriptor:any;
  regionFilterDefault: any;
  urls: any;
  searching = false;
  searchFailed = false;
  msFilterRegion = '';
  valueRegion: any;

	selectRegion: any;
	defaultRegion: any;
	regionSource: any;

	collapseLayer: boolean;
  collapseCharts: boolean;
  collapseLegends: boolean;

	layersTypes= [];
  basemapsNames = [];
  limitsNames = [];
  year: any;
  LayersTMS = {};
  limitsTMS = {};
	layersNames = [];

	constructor(private http: HttpClient, private _service: SearchService) { 
		this.projection = OlProj.get('EPSG:900913');
		this.currentZoom = 5.8;
		this.layers = [];
		
		this.defaultRegion = {
			type: 'biome',
			text: 'CERRADO',
			value: 'CERRADO'
		}
		this.selectRegion = this.defaultRegion;

    this.urls = [
			/* 'http://localhost:5501/ows' */
    	'http://o1.lapig.iesa.ufg.br/ows',
    	'http://o2.lapig.iesa.ufg.br/ows',
    	'http://o3.lapig.iesa.ufg.br/ows',
    	'http://o4.lapig.iesa.ufg.br/ows'
    ];

		this.tileGrid = new TileGrid({
    	extent: this.projection.getExtent(),
    	resolutions: this.getResolutions(this.projection),
      tileSize: 512
    });

    this.descriptor = {
    	"groups": []
		}
		
		this.updateCharts();
	}

	search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this._service.search(term).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )

	formatter = (x: {text: string}) => x.text;

	private zoomExtent() {
		var map = this.map;
  	if (this.selectRegion.type != '') {
			this.http.get('service/map/extent?region='+this.selectRegion.value).subscribe(extentResult => {
				var features = (new GeoJSON()).readFeatures(extentResult, {
				  dataProjection : 'EPSG:4326',
				  featureProjection: 'EPSG:3857'
				});

				this.regionSource = this.regionsLimits.getSource();
				this.regionSource.clear()
				this.regionSource.addFeature(features[0])
				var extent = features[0].getGeometry().getExtent();
				map.getView().fit(extent, { duration: 1500 });
			})
		}
  }


	updateRegion(region) {

		if (region == this.defaultRegion)
			this.valueRegion = ''

		this.selectRegion = region;

		if (this.selectRegion.type == 'municipio')
			this.msFilterRegion = "cd_geocmu = '" + this.selectRegion.value + "'"
		else if (this.selectRegion.type == 'estado')
			this.msFilterRegion = "uf = '" + this.selectRegion.value + "'"
		else
			this.msFilterRegion = ""

  	this.zoomExtent();
		this.updateSourceAllLayer();
		this.updateCharts();
	}

	private updateCharts() {
		/* console.log('filter:  ', this.msFilterRegion, this.selectRegion.type, this.selectRegion.text) */
		for (let group of this.descriptor.groups) {
			if (group.dataService != undefined) {
				this.http.get(group.dataService+"?typeRegion="+this.selectRegion.type+"&textRegion="+this.selectRegion.text+"&filterRegion="+this.msFilterRegion).subscribe(result => {
					
					group.chartConfig = result

					for(let graphic of group.chartConfig) {
						/* console.log(graphic) */
						if(graphic.type != 'line') {

							graphic.data = {
								labels: graphic.indicators.map(element => element.label),
								datasets: [
									{
											data: graphic.indicators.map(element => element.value),
											backgroundColor: graphic.indicators.map(element => element.color)
									}
								]
							}
						}
					}
			
				})
			}
		}

	}

	private getResolutions(projection) {
		var projExtent = projection.getExtent();
    var startResolution = OlExtent.getWidth(projExtent) / 256;
    var resolutions = new Array(22);
    for (var i = 0, ii = resolutions.length; i < ii; ++i) {
      resolutions[i] = startResolution / Math.pow(2, i);
    }
    return resolutions
	}

	private createMap() {
		this.createBaseLayers();
		this.createLayers();
    this.map = new OlMap({
      target: 'map',
      layers: this.layers,
      view: new OlView({
	      center: OlProj.fromLonLat([-52, -14]),
	      projection: this.projection,
	      zoom: this.currentZoom,
	    }),
	    loadTilesWhileAnimating: true,
    	loadTilesWhileInteracting: true 
    });

	}

	private createBaseLayers() {
		this.mapbox = {
			visible: true,
			layer: new OlTileLayer({
	      source: new OlXYZ({
		      wrapX: false,
		      url: 'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
		    }),
				visible: true
	    })
		}
    
    this.satelite = {
			visible: false,
			layer: new OlTileLayer({
	      preload: Infinity,
        source: new BingMaps({
          key: 'VmCqTus7G3OxlDECYJ7O~G3Wj1uu3KG6y-zycuPHKrg~AhbMxjZ7yyYZ78AjwOVIV-5dcP5ou20yZSEVeXxqR2fTED91m_g4zpCobegW4NPY',
          imagerySet: 'Aerial'
        }),
				visible: false
	    })
	  }

	  this.estradas = {
			visible: false,
			layer: new OlTileLayer({
	      preload: Infinity,
        source: new BingMaps({
          key: 'VmCqTus7G3OxlDECYJ7O~G3Wj1uu3KG6y-zycuPHKrg~AhbMxjZ7yyYZ78AjwOVIV-5dcP5ou20yZSEVeXxqR2fTED91m_g4zpCobegW4NPY',
          imagerySet: 'Road'
        }),
				visible: false
	    })
	  }

	  this.relevo = {
			visible: false,
			layer: new OlTileLayer({
				source: new OlXYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
          			'World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}'
        }),
				visible: false,
	    })
	  }

	  this.landsat = {
			visible: false,
			layer: new OlTileLayer({
				source: new TileWMS({
					url: 'http://workspace.mapbiomas.org/wms',
          projection: 'EPSG:3857',
          params: {'LAYERS': 'rgb', 
          					'SERVICE': 'WMS',
          					'VERSION': '1.1.1',
										'TRANSPARENT': 'true',
          					'MAP': 'wms/v/4.0/classification/rgb.map', 
          					'YEAR': 2018
         	},
         	serverType: 'mapserver',
          tileGrid: this.tileGrid
        }),
				visible: false,
	    })
    }
    
    for(let baseName of this.basemapsNames){
      this.layers.push(this[baseName.value].layer)
    }
    
	}

	private createLayers() {
		var olLayers: OlTileLayer[] = new Array();

		//layers
		for (let layer of this.layersTypes) {
    	this.LayersTMS[layer.value] = this.createTMSLayer(layer);
			this.layers.push(this.LayersTMS[layer.value])
		}

		//limits
		for (let limits of this.limitsNames) {
			this.limitsTMS[limits.value] = this.createTMSLayer(limits)
			this.layers.push(this.limitsTMS[limits.value])
		}

		this.regionsLimits = this.createVectorLayer('regions', '#663300', 3);
		this.layers.push(this.regionsLimits);
    
		this.layers.push()
		this.layers = this.layers.concat(olLayers.reverse());

	}

	private createTMSLayer(layer) {
		return new OlTileLayer({
			source: new OlXYZ({
				urls: this.parseUrls(layer)
			}),
			tileGrid: this.tileGrid,
			visible: layer.visible,
			opacity: layer.opacity
		});
	}

	private createVectorLayer(layerName, strokeColor, width) {
    return new VectorLayer({
    	name: layerName,
      source: new VectorSource({
	    }),
	    style: [
		    new Style({
	        stroke: new Stroke({
	          color: strokeColor,
	          width: width
	        })
	      })
      ]
    });
	}

	private parseUrls(layer) {
    var result = []

		var filters = []

		if (layer.timeHandler == 'msfilter' && layer.times)
			filters.push(layer.timeSelected)
		if (layer.layerfilter)
			filters.push(layer.layerfilter)
		if (this.regionFilterDefault)
			filters.push(this.regionFilterDefault)
		if (layer.regionFilter && this.msFilterRegion)
			filters.push(this.msFilterRegion)

		var msfilter = '&MSFILTER=' + filters.join(' AND ')

		var layername = layer.value
		if (layer.timeHandler == 'layername')
			layername = layer.timeSelected

		for (let url of this.urls) {
			result.push(url
				+ "?layers=" + layername
				+ msfilter
				+ "&mode=tile&tile={x}+{y}+{z}"
				+ "&tilemode=gmap" 
				+ "&map.imagetype=png"
			);
		}

		return result;
	}

  private updateSourceAllLayer() {
    for (let layer of this.layersTypes) {
	  	this.updateSourceLayer(layer)
		}
  }
  
	private updateSourceLayer(layer){
	  	var source_layers = this.LayersTMS[layer.value].getSource();
			source_layers.setUrls(this.parseUrls(layer))
			source_layers.refresh();
  }

  baseLayerChecked(base, e) {

  	for(let basemap of this.basemapsNames) {
      if(base.value == basemap.value && e.checked){
        this[base.value].layer.setVisible(true);
				basemap.visible = true;
  		} else if (basemap.value != base.value) {
        this[basemap.value].layer.setVisible(false);
				basemap.visible = false;
  		} else {
        this[this.descriptor.basemaps[0].defaultBaseMap].layer.setVisible(true);
  			if(basemap.value != this.descriptor.basemaps[0].defaultBaseMap) {
          this[basemap.value].layer.setVisible(false);
					this[basemap.value].visible = false;
  			}
  		}
  	}
	}

 /*  groupLayerschecked(layers, e) {
		
		if (e.checked) {
			this.LayersTMS[layers].setVisible(e.checked);
		} else {
	    	this.LayersTMS[layers].setVisible(e.checked);
		}
	} */

	limitsLayersChecked(layers, e) {
		//limits
		for(let limits of this.limitsNames) {
			if(layers.value == limits.value && e.checked){
				this.limitsTMS[limits.value].setVisible(true);
  			limits.visible = true;
			} else {
				this.limitsTMS[limits.value].setVisible(false);
				limits.visible = false;
			}
		}

	}
  
  changeVisibility(layer, e) {

    if(layer.types) {
      for(let layerType of layer.types) {
        this.LayersTMS[layerType.value].setVisible(false)
      }
    } else {
      this.LayersTMS[layer.value].setVisible(false)
    }
		
		if (e != undefined)
			layer.visible = e.checked

		this.LayersTMS[layer.selectedType].setVisible(layer.visible)
	}

	legendchecked(layer, e) {
		layer.visible = !layer.visible
		this.changeVisibility(layer,e);
		console.log(layer);
	}

	ngOnInit() {

		this.http.get('service/map/descriptor').subscribe(result => {
      this.descriptor = result
      this.regionFilterDefault = this.descriptor.regionFilterDefault;

			for (let groups of this.descriptor.groups) {
				
				for(let layers of groups.layers) {
          if(layers.types) {
            for(let types of layers.types) {
              this.layersTypes.push(types)
            }
          } else {
            this.layersTypes.push(layers);
					}
					this.layersTypes.sort(function (e1, e2) {
						return (e2.order - e1.order)
					});

					this.layersNames.push(layers);
				}

      }
      for(let basemap of this.descriptor.basemaps) {
				for(let types of basemap.types){
					this.basemapsNames.push(types)
				}
			}

			for(let limits of this.descriptor.limits) {
				for(let types of limits.types){
					this.limitsNames.push(types)
				}
      }

			this.createMap();
			this.updateCharts();
		});
		
	}

}
