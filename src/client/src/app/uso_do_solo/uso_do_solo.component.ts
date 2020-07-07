import {Component, Injectable, OnInit, Inject} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';

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
import Select from 'ol/interaction/Select';
import * as Condition from 'ol/events/condition';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { style } from '@angular/animations';
import Fill from 'ol/style/Fill';
import Circle from 'ol/style/Circle';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { saveAs } from 'file-saver';

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
	
	metadados: any;

	layersTypes= [];
  basemapsNames = [];
  limitsNames = [];
  year: any;
  LayersTMS = {};
  limitsTMS = {};
	layersNames = [];
	fieldPointsStop: any;

	downloadLayer: string;
	downloadLimit: string;
	layerCheckedDow: any;

	layerofDowloads = [];
	linkDownload: any;
	loadingSHP: boolean;
  loadingCSV: boolean;

	

	constructor(private http: HttpClient, private _service: SearchService, public dialog: MatDialog) { 
		this.projection = OlProj.get('EPSG:900913');
		this.currentZoom = 5.8;
		this.layers = [];
		
		this.defaultRegion = {
			type: 'bioma',
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
		this.loadingSHP = false;
    this.loadingCSV = false;
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

	 openDialog(layer): void {
		
		if (layer.types) {
			for(let info of layer.types) {
				if(info.value == layer.selectedType) {
					this.metadados = info.metadados
				}
			}
		} else {
			this.metadados = layer.metadados
		}


		const dialogRef = this.dialog.open(UsoDoSoloMetadados, {
      width: '650px',
			data: {name: this.metadados}
		});
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

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
		this.addPoints();
	}

	private updateCharts() {
		for (let group of this.descriptor.groups) {
			if (group.dataService != undefined) {
				this.http.get(group.dataService+"?typeRegion="+this.selectRegion.type+"&textRegion="+this.selectRegion.text+"&filterRegion="+this.msFilterRegion+"&year="+this.year).subscribe(result => {
					
					group.chartConfig = result

					for(let graphic of group.chartConfig) {
						if(graphic.type != 'line') {

							graphic.data = {
								labels: graphic.indicators.map(element => element.label),
								datasets: [
									{
											data: graphic.indicators.map(element => element.value),
											backgroundColor: graphic.indicators.map(element => element.color),
											hoverBackgroundColor: graphic.indicators.map(element => element.color)
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
	      center: OlProj.fromLonLat([-48, -13.5]),
	      projection: this.projection,
	      zoom: this.currentZoom,
	    }),
	    loadTilesWhileAnimating: true,
    	loadTilesWhileInteracting: true 
		});
		
		var selectOver = new Select({
			condition: Condition.pointerMove,
			layers: [this.fieldPointsStop],
			style: style
    });

    var select = new Select({
			condition: Condition.click,
			layers: [this.fieldPointsStop],
			style: style
    });

    select.on('select', function(event) {
    	if(event.selected.length > 0) {
    		var featureSel = event.selected[0]
    		this.closeInfo = false;
    		this.totalFotos = featureSel.get('foto').length
    		this.fotoAtual = 1
	    	this.infoFeature = {
	    		id: featureSel.get('id'),
	    		foto: featureSel.get('foto'),
	    		cobertura: featureSel.get('cobertura'),
	    		obs: featureSel.get('obs'),
	    		data: featureSel.get('data'),
	    		periodo: featureSel.get('periodo'),
					horario: featureSel.get('horario'),
					altura: featureSel.get('altura'),
					homoge: featureSel.get('homoge'),
					invasoras: featureSel.get('invasoras'),
					gado: featureSel.get('gado'),
					qtd_cupins: featureSel.get('qtd_cupins'),
					forrageira: featureSel.get('forrageira'),
					solo_exp: featureSel.get('solo_exp')
	    	}
    	}
  	}.bind(this));

  	this.map.addInteraction(select);
  	this.map.addInteraction(selectOver);

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

		this.fieldPointsStop = this.createVectorLayer('fieldPointsStop', '#fc16ef', 3);
		this.fieldPointsStop.setVisible(false);

		this.regionsLimits = this.createVectorLayer('regions', '#663300', 3);
		this.layers.push(this.regionsLimits);
		this.layers.push(this.fieldPointsStop);
    
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
          image: new Circle({
		        radius: 4,
		        fill: new Fill({color: '#ffd5c1', width: 1}),
		        stroke: new Stroke({color: '#7b2900', width: 2})
		      })
        }),
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

		if(layer.timeSelected) {
			this.year = layer.timeSelected
		}

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
			if(layer.value == "uso_solo_mapbiomas") {
				this.year = layer.timeSelected
				this.updateCharts();
			}
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

	limitsLayersChecked(layers, e) {
		//limits
		for(let limits of this.limitsNames) {
			if(layers.value == limits.value) {
				this.limitsTMS[limits.value].setVisible(e.checked);
				limits.visible = e.checked;
			}

			/* if(layers.value == limits.value && e.checked){
				this.limitsTMS[limits.value].setVisible(true);
  			limits.visible = true;
			} else {
				this.limitsTMS[limits.value].setVisible(false);
				limits.visible = false;
			} */
		}

	}

	// downloadLayers(layer,e) {

	// 	this.layerofDowloads.push({
	// 		'layer':layer,
	// 		'checked': e.checked
	// 	})

	// 	if(e.checked === false) {
	// 		for (var i=0; i <= this.layerofDowloads.length; i++) {
	// 			console.log(layer)
	// 			if(layer == this.layerofDowloads[i].layer) {
	// 				this.layerofDowloads.splice(i)
	// 			}
	// 		}
	// 	}

	// 	console.log('downloadLayers: ', this.layerofDowloads)
	// }
  
  changeVisibility(layer, e) {
		//if(e) {
			//this.downloadLayers(layer.selectedType, e)
		//}
		//console.log('changeeeee::', layer.selectedType, e)

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
		}

	addPoints() {
		var msfilter = "?msfilter=bioma='CERRADO'";
		if (this.msFilterRegion) {
			msfilter = msfilter+' AND '+this.msFilterRegion;
		}
		var fieldValidationUrl = '/service/map/fieldPoints'+msfilter;

		this.http.get(fieldValidationUrl).subscribe(fieldValResult => {
			var features = (new GeoJSON()).readFeatures(fieldValResult, {
			  dataProjection : 'EPSG:4326',
			  featureProjection: 'EPSG:3857'
			});

			this.regionSource = this.fieldPointsStop.getSource();
			this.regionSource.clear()
			this.regionSource.addFeatures(features)
		})
	}

	buttonDownload(tipo, layer, e) {
		var yearDownload = '';
		var columnsCSV = '';
		var regionType = this.selectRegion.type;
		var filterRegion;
		if(layer.types) {
			for(let layerSelected of layer.types) {
				if (layerSelected.value == layer.selectedType){
					if(layerSelected.timeSelected)
						yearDownload = '&'+layerSelected.timeSelected;
						columnsCSV = '&columnsCSV='+layerSelected.columnsCSV;
				}
			}
		} else if (layer.timeSelected) {
			yearDownload = '&'+layer.timeSelected;
			columnsCSV = '&columnsCSV='+layer.columnsCSV;
		}

		if(this.msFilterRegion == "") {
			filterRegion = this.regionFilterDefault
		} else {
			filterRegion = this.msFilterRegion
		}

		console.log('region',this.selectRegion)

		if (this.selectRegion.type == 'estado')
			regionType = "uf"

		if (tipo == 'shp') {
			this.linkDownload = "/service/map/downloadSHP?layer="+layer.selectedType+yearDownload+'&regionType='+regionType+'&region='+this.selectRegion.value;
		} else {
			console.log("/service/map/downloadCSV?layer="+layer.selectedType+yearDownload+'&filterRegion='+filterRegion+columnsCSV+'&regionName='+this.selectRegion.value)
			this.linkDownload = "/service/map/downloadCSV?layer="+layer.selectedType+yearDownload+'&filterRegion='+filterRegion+columnsCSV+'&regionName='+this.selectRegion.value;
		}
	}

  // downloadCSV(layer) {

	// 	var yearDownload = '';
	// 	var columnsCSV = '';
	// 	var filterRegion;
	// 	if(layer.types) {
	// 		for(let layerSelected of layer.types) {
	// 			if (layerSelected.value == layer.selectedType){
	// 				if(layerSelected.timeSelected)
	// 					yearDownload = layerSelected.timeSelected;
	// 					columnsCSV = layerSelected.columnsCSV;
	// 			}
	// 		}
	// 	} else if (layer.timeSelected) {
	// 		yearDownload = layer.timeSelected;
	// 		columnsCSV = layer.columnsCSV;
	// 	}

	// 	if(this.msFilterRegion == "") {
	// 		filterRegion = this.regionFilterDefault
	// 	} else {
	// 		filterRegion = this.msFilterRegion
	// 	}

  //   let parameters = {
  //     "layer": layer.selectedType,
  //     "filterRegion": filterRegion,
  //     "year": yearDownload,
	// 		"columnsCSV": columnsCSV
  //   };

  //   this.http.post("/service/map/downloadCSV", parameters, {responseType: 'blob'})
  //       .toPromise()
  //       .then(blob => {
  //         saveAs(blob, parameters.layer+'_'+ parameters.year + '.csv');
  //         this.loadingCSV = false;
  //       }).catch(err => this.loadingCSV = false);
  // }

  // buttonDownload(tipo, layer, e) {
  //   if (tipo == 'csv') {
  //     this.loadingCSV = true;
  //     this.downloadCSV(layer);
  //   } else {
  //     this.loadingSHP = true;
  //     this.downloadSHP(layer);
  //   }
  // }

	//onSubmit(layer) {
		// TODO: Use EventEmitter with form value
		//var form_download = document.querySelectorAll(".FormDown")
		/* for(let layers of form_download) {

		} */
		/* for(let teste of form_download) {
			console.log()
		} */
		//console.log(typeof(form_download), form_download)
	//}

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
			this.addPoints();
		});
		
	}

}

@Component({
  selector: 'uso_do_solo_metadados',
  templateUrl: 'uso_do_solo_metadados.html',
})
export class UsoDoSoloMetadados {

  constructor(
    public dialogRef: MatDialogRef<UsoDoSoloMetadados>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
