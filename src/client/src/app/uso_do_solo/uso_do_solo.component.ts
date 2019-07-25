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
import Circle from 'ol/style/Circle.js';
import {Circle as CircleStyle} from 'ol/style.js';
import Fill from 'ol/style/Fill';
import VectorSource from 'ol/source/Vector';

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
  basemaps = ['mapbox', 'satelite', 'estradas', 'relevo', 'landsat']
  descriptor:any;
  urls: any;
  searching = false;
  searchFailed = false;
  msFilterRegionAnd = '';
  msFilterRegion = '';
  model: any;

  regionSelected: 'Brasil';
  regionTypeBr: any;
  region_geom: any;
  regionSource: any;
  regionTypeFilter: any;

  layersNames= [];
  limitsNames = [];
  year: any;
  LayersTMS = {};
  limitsTMS = {};
  selectedTypeLayer: any;

	constructor(private http: HttpClient, private _service: SearchService) { 
		this.projection = OlProj.get('EPSG:900913');
		this.currentZoom = 5.8;
    this.layers = [];
    this.model = '';
    this.mapbox = {
    	'visible': true
    }
    this.satelite = {
    	'visible': false
    }
    this.estradas = {
    	'visible': false
    }
    this.relevo = {
    	'visible': false
    }
    this.landsat = {
    	'visible': false
    }
    this.regionTypeFilter = '';
    this.regionTypeBr = 'bioma';

    this.urls = [
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
  	if (this.regionTypeFilter != '') {
			this.http.get('service/map/extent?region=text='+"'"+this.region_geom+"'").subscribe(extentResult => {
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
		this.regionSelected = region.item.name;
		this.regionTypeFilter = region.item.type;
    this.regionTypeBr = region.item.type;
  	var regionType = region.item.type;
  	var region = region.item.value;
  	this.region_geom = region;


  	if(regionType == 'estado') {
  		regionType = 'uf'
  	}else if (regionType == 'municipio') {
  		regionType = 'cd_geocmu'
  	}


  	this.msFilterRegionAnd = " AND "+regionType+"='"+region+"'";
  	this.msFilterRegion = regionType+"='"+region+"'";

  	this.zoomExtent();

  	this.updateSourceLayer();
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
          url: 'http://mapbiomas-staging.terras.agr.br/wms',
          projection: 'EPSG:3857',
          params: {'LAYERS': 'rgb', 
          					'SERVICE': 'WMS',
          					'TILED': true,
          					'VERSION': '1.1.1',
          					'TRANSPARENT': 'true', 
          					'MAP': 'wms/v/staging/classification/rgb.map', 
          					'YEAR': 2017
         	},
         	serverType: 'mapserver',
          tileGrid: this.tileGrid
        }),
				visible: false,
	    })
	  }

    this.layers.push(this.mapbox.layer)
    this.layers.push(this.satelite.layer)
    this.layers.push(this.estradas.layer)
    this.layers.push(this.relevo.layer)
    this.layers.push(this.landsat.layer)
	}

	private createLayers() {
		var olLayers: OlTileLayer[] = new Array();

		//layers
		for (let layer of this.layersNames) {
    	this.LayersTMS[layer.value] = this.createTMSLayer(layer.value, layer.visible, layer.opacity, layer.layerfilter);
			this.layers.push(this.LayersTMS[layer.value])
		}

		//limits
		for (let limits of this.limitsNames) {
			this.limitsTMS[limits.value] = this.createTMSLayer(limits.value, limits.visible, limits.opacity, limits.layerfilter)
			this.layers.push(this.limitsTMS[limits.value])
		}

		this.regionsLimits = this.createVectorLayer('regions', '#663300', 3);
		this.layers.push(this.regionsLimits);
    
		this.layers.push()
		this.layers = this.layers.concat(olLayers.reverse());

	}

	private createTMSLayer(layername, visible, opacity, filter) {
		return new OlTileLayer({
			source: new OlXYZ({
				urls: this.getUrls(layername, filter)
			}),
			tileGrid: this.tileGrid,
			visible: visible,
			opacity: opacity
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

	private getUrls(layername, filter) {
		var result = []

		var msfilter = ""

		console.log('teste: ',!isNaN(filter), layername, filter)

		if(filter == 'yearsAndRegions'){
			msfilter = "&MSFILTER=year="+this.year+" AND bioma='CERRADO' "+this.msFilterRegionAnd
		} else if (filter == 'pasture_degraded') {
			msfilter = "&MSFILTER=category='1' AND bioma='CERRADO' "+this.msFilterRegionAnd
		} else if (filter == 'biomaCerrado') {
			msfilter = "&MSFILTER=bioma='Cerrado'"
		} else if (!isNaN(filter)) {
			console.log('é número"')
			msfilter = "&MSFILTER=year="+filter+" AND bioma='CERRADO' "+this.msFilterRegionAnd
		}
		
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

	private updateSourceLayer(){

		for (let layer of this.layersNames) {
	  	var source_layers = this.LayersTMS[layer.value].getSource();

			source_layers.setUrls(this.getUrls(layer.value, layer.layerfilter))

			source_layers.refresh();
		}

  }

  baseLayerChecked(base, e) {

  	for(let basemap of this.basemaps) {
  		if(base == basemap && e.checked){
  			this[base].layer.setVisible(true);
				this[base].visible = true;
  		} else if (basemap != base) {
  			this[basemap].layer.setVisible(false);
				this[basemap].visible = false;
  		} else {
  			this.mapbox.layer.setVisible(true);
				this.mapbox.visible = true;
  			if(basemap !='mapbox') {
  				this[basemap].layer.setVisible(false);
					this[basemap].visible = false;
  			}
  		}
  	}
	}

  getMatchRegion(){
  		this.region_geom = 'CERRADO'
			this.zoomExtent();
  	  this.model = '';
			this.msFilterRegion = '';
			this.msFilterRegionAnd = '';
			this.regionTypeFilter = '';
      this.regionTypeBr = 'bioma';
			this.regionSelected = 'Brasil';
      this.updateSourceLayer();
  }

  groupLayerschecked(layers, e) {

		if (e.checked) {
			this.LayersTMS[layers].setVisible(e.checked);
		} else {
	    	this.LayersTMS[layers].setVisible(e.checked);
		}
	}

	layerchecked(layers, e) {

		//layers
		if (e.checked) {
			console.log('layers: ', layers[0].value, e)
			/*for(let layer of layers) {
			}*/
			//console.log('selected: ', this.LayersTMS[this.descriptor.groups[0].layers[0].selectedType])
			this.LayersTMS[layers[0].value].setVisible(e.checked);
		} else {
			for (let layer of layers) {
	    	this.LayersTMS[layer.value].setVisible(e.checked);
			}
		}

	}

	limitsLayersChecked(layers, e) {
		//limits
		for(let limits of this.limitsNames) {
			console.log(limits.visible)
			if(layers.value == limits.value && e.checked){
				this.limitsTMS[limits.value].setVisible(true);
  			limits.visible = true;
			} else if (limits.value != layers.value) {
				this.limitsTMS[limits.value].setVisible(false);
				limits.visible = false;
			} else {
					this.limitsTMS[limits.value].setVisible(false);
					limits.visible = false;
			}
		}

	}

	updateyear(layer, year) {
		console.log('updateyear: ', layer, year)
		var source_layers = this.LayersTMS[layer].getSource();

		source_layers.setUrls(this.getUrls(layer, year))

		source_layers.refresh();
		/*this.updateSourceLayer();*/
	}

	updateType(layers) {

		this.selectedTypeLayer = this.descriptor.groups[0].layers[0].selectedType

		for(let layer of layers) {
			if(layer.value == this.selectedTypeLayer){
				this.LayersTMS[this.selectedTypeLayer].setVisible(true);
			} else {
				this.LayersTMS[layer.value].setVisible(false);
			}
		}
	}

	ngOnInit() {

		this.http.get('service/app-descriptor').subscribe(result => {
			this.descriptor = result

			for (let groups of this.descriptor.groups) {
				for(let layers of groups.layers) {
					var ultimo = layers.years[layers.years.length-1]
					this.year = ultimo.value
					console.log(ultimo.value)
					for(let types of layers.types) {
						this.layersNames.push(types)
					}
				}
			}

			for(let limits of this.descriptor.limits) {
				for(let types of limits.types){
					this.limitsNames.push(types)
				}
			}

			this.createMap();
		});
	}

}
