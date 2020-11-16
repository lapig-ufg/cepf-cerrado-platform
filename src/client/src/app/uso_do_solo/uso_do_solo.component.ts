import { Component, Injectable, HostListener, OnInit, Inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as ol from 'openlayers';
import * as _ol_TileUrlFunction_ from 'ol/tileurlfunction.js';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { defaults as defaultInteractions } from 'ol/interaction';
import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlView from 'ol/View';
import Overlay from 'ol/Overlay.js';
import BingMaps from 'ol/source/BingMaps';
import TileWMS from 'ol/source/TileWMS';
import UTFGrid from 'ol/source/UTFGrid.js';
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
import { MatIconRegistry } from '@angular/material/icon';
import { saveAs } from 'file-saver';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { GoogleAnalyticsService } from '../services/google-analytics.service';
import { RegionReportComponent } from './region-report/region-report.component';
import logos from './logos';
import * as moment from 'moment';
import {ChartsComponent} from './charts/charts.component';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

declare let html2canvas: any;

const SEARCH_URL = 'service/map/search';
let SEARCH_REGION = '/service/map/searchregion';
const PARAMS = new HttpParams({
	fromObject: {
		format: 'json'
	}
});


@Injectable()
export class SearchService {
	constructor(private http: HttpClient) { }

	search(term: string) {
		if (term === '') {
			return of([]);
		}

		return this.http.get(SEARCH_URL, { params: PARAMS.set('key', term) }).pipe(
			map(response => response)
		);
	}
}


@Component({
	selector: 'app-map',
	templateUrl: './uso_do_solo.component.html',
	providers: [SearchService],
	styleUrls: [
		'./uso_do_solo.component.scss'
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
	descriptor: any;
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

	layersTypes = [];
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

	/** Variables for upload shapdefiles **/
	layerFromUpload: any = {
		label: null,
		layer: null,
		checked: false,
		visible: null,
		loading: false,
		dragArea: true,
		error: false,
		strokeColor: '#2224ba',
		token: '',
		analyzedAreaLoading: false,
		analyzedArea: {},
		heavyAnalysis: {},
		heavyAnalysisLoading: false
	};

	loadingPrintReport: boolean;

	layerFromConsulta: any = {
		label: null,
		layer: null,
		checked: false,
		visible: null,
		loading: false,
		dragArea: true,
		error: false,
		strokeColor: '#257a33',
		token: '',
		analyzedAreaLoading: false,
		analyzedArea: {},
		heavyAnalysis: {},
		heavyAnalysisLoading: false
	};

	selectedIndexConteudo: number;
	selectedIndexUpload: number;

	titlesLayerBox: any = {
		label_upload: "Subir arquivo",
		upload_submit: "Submeter arquivo",
		label_upload_msg: "upload_msg",
		label_upload_tooltip: "tooltip",
		label_upload_max_size_msg: "Tamanho máximo",
		label_upload_title_file: "Upload title",
		label_upload_token: "Upload token",
		upload_search: "Procurar",
		btn_search: "Consultar",
		btn_analyze: "Analisar",
		btn_clear: "Limpar",
		warning: "Atenção",
		not_found: "Não encontrado",
		cd_geocmu: "Geocódigo: ",
		area_pastagem: "Área de Pastagem: ",
		area_mun: "Área do Município: ",
		ua: "Unidade Animal: ",
		n_kbcs: "Nº de Cabeças de Gado: ",
		year: "Ano: ",
		click_more_text: "Clique aqui para aproximar "
	}
	httpOptions: any;
	utfgridsourcePastagem: UTFGrid;
	utfgridlayerPastagem: OlTileLayer;
	utfgridsourceMapbiomas: UTFGrid;
	utfgridlayerMapbiomas: OlTileLayer;
	infodataPastagem: any
	infodataMapbiomas: any = {}
	infoOverlay: Overlay;
	keyForClick: any;
	keyForPointer: any;
	showStatistics: boolean;
	innerHeigth: number;
	showLayers: boolean;

	languages: any = [];
	language: string;

	bntStylePOR: any;
	bntStyleENG: any;

	styleSelected: any;
	styleDefault: any;
	breakpointMobile: number;

	constructor(
		private http: HttpClient,
		private _service: SearchService,
		public dialog: MatDialog,
		public googleAnalyticsService: GoogleAnalyticsService,
		public translate: TranslateService,
		private decimalPipe: DecimalPipe,
		public router: Router,
		public route: ActivatedRoute
	) {
		translate.addLangs(['en', 'pt']);
		translate.setDefaultLang('pt');
		const browserLang = translate.getBrowserLang();
		translate.use(browserLang.match(/en|pt/) ? browserLang : 'en');

		this.language = browserLang;

		this.projection = OlProj.get('EPSG:900913');
		this.currentZoom = 5.8;
		this.layers = [];

		this.styleSelected = {
			'background-color': '#fe8321'
		};

		this.styleDefault = {
			'background-color': '#707070'
		};

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

		this.httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};

		this.showStatistics = false;
		this.showLayers = false;
		this.innerHeigth = window.innerHeight;
		this.breakpointMobile = 1024;
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

	formatter = (x: { text: string }) => x.text;
	private setStylesLangButton() {
		if (this.language == 'pt' || this.language == 'pt-br') {
			this.bntStyleENG = this.styleDefault;
			this.bntStylePOR = this.styleSelected;
		}
		else {
			this.bntStyleENG = this.styleSelected;
			this.bntStylePOR = this.styleDefault;
		}
	}
	changeLanguage(lang) {
		this.translate.use(lang);
		if (this.language != (lang)) {
			this.language = lang;
			this.setStylesLangButton();
			this.updateDescriptor();
		}
	}
	private updateDescriptor() {
		this.http.get('service/map/descriptor?lang=' + this.language).subscribe(result => {
			this.descriptor = result
			this.regionFilterDefault = this.descriptor.regionFilterDefault;
			this.basemapsNames = [];
			this.limitsNames = [];
			this.layersNames = [];
			this.layersTypes = [];

			for (let groups of this.descriptor.groups) {

				for (let layers of groups.layers) {
					if (layers.types) {
						for (let types of layers.types) {
							this.layersTypes.push(types)
						}
					} else {
						this.layersTypes.push(layers);
					}
					// this.layersTypes.sort(function (e1, e2) {
					// 	return (e2.order - e1.order)
					// });

					this.layersNames.push(layers);
				}

			}
			for (let basemap of this.descriptor.basemaps) {
				for (let types of basemap.types) {
					this.basemapsNames.push(types)
				}
			}

			for (let limits of this.descriptor.limits) {
				for (let types of limits.types) {
					this.limitsNames.push(types)
				}
			}
			this.updateCharts();
		});
	}

	openDialog(layer): void {

		if (layer.types) {
			for (let info of layer.types) {
				if (info.value == layer.selectedType) {
					this.metadados = info.metadados
				}
			}
		} else {
			this.metadados = layer.metadados
		}


		const dialogRef = this.dialog.open(UsoDoSoloMetadados, {
			width: '90%',
			data: { name: this.metadados }
		});
		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
		});
	}

	private zoomExtent() {
		var map = this.map;
		if (this.selectRegion.type != '') {
			this.http.get('service/map/extent?region=' + this.selectRegion.value).subscribe(extentResult => {
				var features = (new GeoJSON()).readFeatures(extentResult, {
					dataProjection: 'EPSG:4326',
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

	zoomIn(level = 0.7) {
		this.map.getView().setZoom(this.map.getView().getZoom() + level);
	}

	zoomOut(level = 0.7) {
		this.map.getView().setZoom(this.map.getView().getZoom() - level);
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.innerHeigth = window.innerHeight;

	}

	updateRegion(region) {
		if (region == this.defaultRegion) {
			this.valueRegion = ''
		}


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
	async openRegionReport() {
		let dados = {};
		let url = '/service/analysis/regionreport?';

		if (this.selectRegion.type === 'estado') {
			url += 'type=estado&region=' + this.selectRegion.value.toLowerCase();
			dados['type'] = 'estado';
		} else if (this.selectRegion.type === 'municipio') {
			url += 'type=municipio&region=' + this.selectRegion.value.toLowerCase();
			dados['type'] = 'municipio';
		} else {
			return;
		}

		dados['region'] = await this.http.get(url).toPromise();

		dados['language'] = this.language;
		if (window.innerWidth < this.breakpointMobile) {
			// this.dialog.open(RegionReportMobileComponent, {
			// 	width: '98%',
			// 	minWidth: '95%',
			// 	height: 'calc(100% - 5vh)',
			// 	panelClass: 'full-width-dialog',
			// 	data: { dados }
			// });
		} else {
			this.dialog.open(RegionReportComponent, {
				width: 'calc(100% - 5vw)',
				height: 'calc(100% - 5vh)',
				data: { dados }
			});
		}

	}

	private updateCharts() {

		for (let group of this.descriptor.groups) {
			if (group.dataService != undefined) {
				this.http.get(group.dataService + "?typeRegion=" + this.selectRegion.type + "&textRegion=" + this.selectRegion.text + "&filterRegion=" + this.msFilterRegion + "&year=" + this.year + "&lang=" + this.language).subscribe(result => {
					group.chartConfig = result

					for (let graphic of group.chartConfig) {
						if (graphic.type != 'line') {

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

	changeTextUpload($e) {

		if (this.layerFromConsulta.error) {
			this.layerFromConsulta = {
				label: null,
				layer: null,
				checked: false,
				visible: null,
				loading: false,
				dragArea: true,
				error: false,
				strokeColor: '#257a33',
				token: '',
				analyzedAreaLoading: false,
				analyzedArea: {},
			};
		}
	}

	onChangeCheckUpload(event) {
		let map = this.map;
		this.layerFromUpload.checked = !this.layerFromUpload.checked;

		if (this.layerFromUpload.checked) {

			map.addLayer(this.layerFromUpload.layer);
			let extent = this.layerFromUpload.layer.getSource().getExtent();
			map.getView().fit(extent, { duration: 1800 });

			//   let prodes = this.layersNames.find(element => element.id === 'desmatamento_prodes');
			//   prodes.selectedType = 'bi_ce_prodes_desmatamento_100_fip';
			//   this.changeVisibility(prodes, undefined);
			//   this.infodataPastagemMunicipio = null;

		} else {
			map.removeLayer(this.layerFromUpload.layer);
		}

	}
	getCitiesAnalyzedArea(fromConsulta = false) {
		let cities = '';
		if (fromConsulta) {
			if (this.layerFromConsulta.analyzedArea.regions_intersected.hasOwnProperty('municipio')) {
				for (let [index, city] of this.layerFromConsulta.analyzedArea.regions_intersected.municipio.entries()) {
					let citiesCount = this.layerFromConsulta.analyzedArea.regions_intersected.municipio.length;
					if (citiesCount === 1) {
						cities += city.name + '.';
						return cities;
					}
					if (index === citiesCount - 1) {
						cities += city.name + '.';
					} else {
						cities += city.name + ', ';
					}
				}
			}
		} else {
			if (this.layerFromUpload.analyzedArea.regions_intersected.hasOwnProperty('municipio')) {
				for (let [index, city] of this.layerFromUpload.analyzedArea.regions_intersected.municipio.entries()) {
					let citiesCount = this.layerFromUpload.analyzedArea.regions_intersected.municipio.length;
					if (citiesCount === 1) {
						cities += city.name + '.';
						return cities;
					}
					if (index === citiesCount - 1) {
						cities += city.name + '.';
					} else {
						cities += city.name + ', ';
					}
				}
			}
		}

		return cities;
	}
	getStatesAnalyzedArea(fromConsulta = false) {
		let states = '';
		if (fromConsulta) {
			if (this.layerFromConsulta.analyzedArea.regions_intersected.hasOwnProperty('estado')) {
				for (let [index, state] of this.layerFromConsulta.analyzedArea.regions_intersected.estado.entries()) {
					let statesCount = this.layerFromConsulta.analyzedArea.regions_intersected.estado.length;
					if (statesCount === 1) {
						states += state.name + '.';
						return states;
					}
					if (index === statesCount - 1) {
						states += state.name + '.';
					} else {
						states += state.name + ', ';
					}
				}
			}
		} else {
			if (this.layerFromUpload.analyzedArea.regions_intersected.hasOwnProperty('estado')) {
				for (let [index, state] of this.layerFromUpload.analyzedArea.regions_intersected.estado.entries()) {
					let statesCount = this.layerFromUpload.analyzedArea.regions_intersected.estado.length;
					if (statesCount === 1) {
						states += state.name + '.';
						return states;
					}
					if (index === statesCount - 1) {
						states += state.name + '.';
					} else {
						states += state.name + ', ';
					}
				}
			}
		}

		return states;
	}

	async printRegionsIdentification(token) {
		let language = this.language;
		let self = this;
		console.log(language)
		let dd = {
			pageSize: { width: 400, height: 400 },

			// by default we use portrait, you can change it to landscape if you wish
			pageOrientation: 'portrait',

			content: [],
			styles: {
				titleReport: {
					fontSize: 16,
					bold: true
				},
				textFooter: {
					fontSize: 9
				},
				textImglegend: {
					fontSize: 9
				},
				header: {
					fontSize: 18,
					bold: true,
					margin: [0, 0, 0, 10]
				},
				data: {
					bold: true,
				},
				subheader: {
					fontSize: 16,
					bold: true,
					margin: [0, 10, 0, 5]
				},
				codCar: {
					fontSize: 11,
					bold: true,
				},
				textObs: {
					fontSize: 11,
				},
				tableDpat: {
					margin: [0, 5, 0, 15],
					fontSize: 11,
				},
				tableHeader: {
					bold: true,
					fontSize: 13,
					color: 'black'
				},
				token: {
					bold: true,
					fontSize: 16,
				},
				metadata: {
					background: '#0b4e26',
					color: '#fff'
				}
			}
		}

		// @ts-ignore
		dd.content.push({
			image: logos.logoCEPF[this.language],
			width: 80,
			alignment: 'center'
		});
		dd.content.push({ text: logos.upload.description[language], alignment: 'center', margin: [10, 10, 20, 0] });

		dd.content.push({ text: token, alignment: 'center', style: 'token', margin: [20, 20, 20, 0] });

		// @ts-ignore
		dd.content.push({ qr: 'https://cepf.lapig.iesa.ufg.br/#/regions/' + token, fit: '150', alignment: 'center' });
		// @ts-ignore
		dd.content.push({ text: 'https://cepf.lapig.iesa.ufg.br/#/regions/' + token, alignment: 'center', style: 'textFooter', margin: [20, 10, 20, 60] });

		const filename = logos.upload.title[language] + ' - ' + token + '.pdf'
		pdfMake.createPdf(dd).download(filename);
	}

	async printAnalyzedAreaReport(fromConsulta = false) {

		this.googleAnalyticsService.eventEmitter("printAnalyzedAreaReport", "Print_Report", this.layerFromConsulta.token, 10);

		let language = this.language;
		let self = this;
		let layer = null;
		let isFromConsulta = false;
		if (fromConsulta) {
			isFromConsulta = true;
			layer = this.layerFromConsulta;
		} else {
			layer = this.layerFromUpload;
		}

		this.loadingPrintReport = true;

		let dd = {
			pageSize: 'A4',

			// by default we use portrait, you can change it to landscape if you wish
			pageOrientation: 'portrait',

			// [left, top, right, bottom]
			pageMargins: [40, 70, 40, 80],

			header: {
				margin: [24, 10, 24, 30],
				columns: [
					{
						image: logos.logoCEPF[this.language],
						width: 80
					},
					{
						// [left, top, right, bottom]
						margin: [65, 15, 10, 10],
						text: this.translate.instant('report_analyzed_area_title').toUpperCase(),
						style: 'titleReport',
					},

				]
			},
			footer: function (currentPage, pageCount) {
				return {
					table: {
						widths: '*',
						body: [
							[
								{ image: logos.signature, colSpan: 3, alignment: 'center', fit: [400, 45] },
								{},
								{},
							],
							[
								{ text: 'https://cepf.lapig.iesa.ufg.br', alignment: 'left', style: 'textFooter', margin: [60, 0, 0, 0] },
								{ text: moment().format('DD/MM/YYYY HH:mm:ss'), alignment: 'center', style: 'textFooter', margin: [0, 0, 0, 0] },
								{ text: logos.page.title[language] + currentPage.toString() + logos.page.of[language] + '' + pageCount, alignment: 'right', style: 'textFooter', margin: [0, 0, 60, 0] },
							],
						]
					},
					layout: 'noBorders'
				};
			},
			content: [],
			styles: {
				titleReport: {
					fontSize: 16,
					bold: true
				},
				textFooter: {
					fontSize: 9
				},
				textImglegend: {
					fontSize: 9
				},
				header: {
					fontSize: 18,
					bold: true,
					margin: [0, 0, 0, 10]
				},
				data: {
					bold: true,
				},
				subheader: {
					fontSize: 14,
					bold: true,
					margin: [0, 10, 0, 5]
				},
				codCar: {
					fontSize: 11,
					bold: true,
				},
				textObs: {
					fontSize: 11,
				},
				tableDpat: {
					margin: [0, 5, 0, 15],
					fontSize: 11,
				},
				tableHeader: {
					bold: true,
					fontSize: 13,
					color: 'black'
				},
				tableCar: {
					fontSize: 12,
				},
				metadata: {
					background: '#0b4e26',
					color: '#fff'
				},
				bold: {
					bold: true,
				}
			}
		}
		dd.content.push({ text: this.translate.instant('analyzed_area_total_area') + this.decimalPipe.transform(layer.analyzedArea.shape_upload.area_upload, '1.2-2') + '  km²', style: 'subheader' });

		if (layer.heavyAnalysis.table_pastagem_queimadas_peryear.length > 0) {
			dd.content.push({ text: self.translate.instant('burned_data_title'), style: 'subheader', alignment: 'center' });
			let table = {
				style: 'tableCar',
				layout: 'lightHorizontalLines',
				table: {
					headerRows: 1,
					widths: [52, '*'],
					body: [],
					margin: 10
				}
			};
			let headers = []
			for (let [index, header] of self.translate.instant('burned_data_headers').entries()) {
				headers.push(
					{ text: header, alignment: 'center' }
				);
			}
			table.table.body.push(headers);

			for (let [index, item] of layer.heavyAnalysis.table_pastagem_queimadas_peryear.entries()) {
				table.table.body.push([
					{ text: item.year, alignment: 'center', style: 'bold' },
					{ text: self.decimalPipe.transform(item.area_queimada, '1.2-2') + ' km²', alignment: 'center' },
				]);
			}
			dd.content.push(table);
		}
		if (layer.analyzedArea.regions_intersected.hasOwnProperty('municipio')) {
			dd.content.push({ text: self.translate.instant('analyzed_area_table_city_title'), style: 'subheader', alignment: 'center' });
			dd.content.push({ text: self.getCitiesAnalyzedArea(isFromConsulta), alignment: 'center' });
		}
		if (layer.analyzedArea.regions_intersected.hasOwnProperty('estado')) {
			dd.content.push({ text: self.translate.instant('analyzed_area_table_state_title'), style: 'subheader', alignment: 'center' });
			dd.content.push({ text: self.getStatesAnalyzedArea(isFromConsulta), alignment: 'center' });
		}

		// @ts-ignore
		dd.content.push({ text: layer.token, alignment: 'center', style: 'textFooter', margin: [25, 20, 20, 10], pageBreak: false });
		// @ts-ignore
		dd.content.push({ qr: 'https://cepf.lapig.iesa.ufg.br/#/regions/' + layer.token, fit: '100', alignment: 'center' });
		// @ts-ignore
		dd.content.push({ text: 'https://cepf.lapig.iesa.ufg.br/#/regions/' + layer.token, alignment: 'center', margin: [0, 5, 10, 0], style: 'textFooter' });
		let filename = this.translate.instant('report_analyzed_area_title') + ' - ' + layer.token + '.pdf'
		pdfMake.createPdf(dd).download(filename);
		this.loadingPrintReport = false;
	}

	async openCharts(title, description = false, data, type, options) {
		let ob = {
			title: title,
			description: description,
			type: type,
			data: data,
			options: options,
		}
		this.dialog.open(ChartsComponent, {
			width: 'calc(100% - 5vw)',
			height: 'calc(100% - 5vh)',
			data: { ob }
		});
	}

	async analyzeUploadShape(fromConsulta = false) {
		let params = [];
		let self = this;
		let urlParams = '';

		let paramsHeavyAnalysis = []
		let urlParamsHeavyAnalysis = '';

		if (fromConsulta) {
			this.layerFromConsulta.analyzedAreaLoading = true;
			params.push('token=' + this.layerFromConsulta.token)
			this.layerFromConsulta.error = false;
			urlParams = '/service/upload/initialanalysis?' + params.join('&');

			try {
				let result = await this.http.get(urlParams, this.httpOptions).toPromise()
				this.layerFromConsulta.analyzedArea = result;
				this.layerFromConsulta.analyzedAreaLoading = false;

			} catch (err) {
				self.layerFromConsulta.analyzedAreaLoading = false;
				self.layerFromConsulta.error = true;
			}

			this.layerFromConsulta.heavyAnalysisLoading = true;
			urlParamsHeavyAnalysis = '/service/upload/analysisarea?' + params.join('&');
			let resultHeavyAnalysis = await this.http.get(urlParamsHeavyAnalysis).toPromise();
			this.layerFromConsulta.heavyAnalysis = resultHeavyAnalysis;
			this.layerFromConsulta.heavyAnalysisLoading = false;

			this.googleAnalyticsService.eventEmitter("analyzeConsultaUploadLayer", "Analyze-Consulta-Upload", this.layerFromConsulta.token, 5);
		} else {
			this.layerFromUpload.analyzedAreaLoading = true;
			params.push('token=' + this.layerFromUpload.token)
			this.layerFromUpload.error = false;
			urlParams = '/service/upload/initialanalysis?' + params.join('&');

			try {
				let result = await this.http.get(urlParams, this.httpOptions).toPromise()
				this.layerFromUpload.analyzedArea = result;
				this.layerFromUpload.analyzedAreaLoading = false;
			} catch (err) {
				self.layerFromUpload.analyzedAreaLoading = false;
				self.layerFromUpload.error = true;
			}
			this.layerFromUpload.heavyAnalysisLoading = true;
			urlParamsHeavyAnalysis = '/service/upload/analysisarea?' + params.join('&');
			let resultHeavyAnalysis = await this.http.get(urlParamsHeavyAnalysis).toPromise();
			this.layerFromUpload.heavyAnalysis = resultHeavyAnalysis
			this.layerFromUpload.heavyAnalysisLoading = false;
			this.googleAnalyticsService.eventEmitter("analyzeUploadLayer", "Analyze-Upload", this.layerFromUpload.token, 6);
		}

	}

	public onFileComplete(data: any) {

		let map = this.map;

		this.layerFromUpload.checked = false;
		this.layerFromUpload.error = false;

		if (this.layerFromUpload.layer != null) {
			map.removeLayer(this.layerFromUpload.layer);
		}
		if (!data.hasOwnProperty('features')) {
			return;
		}

		if (data.features.length > 1) {
			this.layerFromUpload.loading = false;

			this.layerFromUpload.visible = false;
			this.layerFromUpload.label = data.name;
			this.layerFromUpload.layer = data;
			this.layerFromUpload.token = data.token;

		} else {
			this.layerFromUpload.loading = false;

			if (data.features[0].hasOwnProperty('properties')) {

				let auxlabel = Object.keys(data.features[0].properties)[0];
				this.layerFromUpload.visible = false;
				this.layerFromUpload.label = data.features[0].properties[auxlabel];
				this.layerFromUpload.layer = data;
				this.layerFromUpload.token = data.token;

			} else {
				this.layerFromUpload.visible = false;
				this.layerFromUpload.label = data.name;
				this.layerFromUpload.layer = data;
				this.layerFromUpload.token = data.token;
			}
		}

		this.layerFromUpload.visible = true;
		let vectorSource = new VectorSource({
			features: (new GeoJSON()).readFeatures(data, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857'
			})
		});

		this.layerFromUpload.layer = new VectorLayer({
			source: vectorSource,
			style: [
				new Style({
					stroke: new Stroke({
						color: this.layerFromUpload.strokeColor,
						width: 4
					})
				}),
				new Style({
					stroke: new Stroke({
						color: this.layerFromUpload.strokeColor,
						width: 4,
						lineCap: 'round',
						zIndex: 1
					})
				})
			]
		});

		this.googleAnalyticsService.eventEmitter("uploadLayer", "Upload", "uploadLayer", 4);
	}

	loadLayerFromConsultaToMap() {
		const currentMap = this.map;
		const vectorSource = new VectorSource({
			features: (new GeoJSON()).readFeatures(this.layerFromConsulta.analyzedArea.geojson, {
				dataProjection: 'EPSG:4326',
				featureProjection: 'EPSG:3857'
			})
		});
		this.layerFromConsulta.layer = new VectorLayer({
			source: vectorSource,
			style: [
				new Style({
					stroke: new Stroke({
						color: this.layerFromConsulta.strokeColor,
						width: 4
					})
				}),
				new Style({
					stroke: new Stroke({
						color: this.layerFromConsulta.strokeColor,
						width: 4,
						lineCap: 'round',
						zIndex: 1
					})
				})
			]
		});
		currentMap.addLayer(this.layerFromConsulta.layer);
		const extent = this.layerFromConsulta.layer.getSource().getExtent();
		currentMap.getView().fit(extent, { duration: 1800 });

		// const prodes = this.layersNames.find(element => element.id === 'desmatamento_prodes');
		// prodes.selectedType = 'bi_ce_prodes_desmatamento_100_fip';
		// this.changeVisibility(prodes, undefined);
		// this.infodataPastagemMunicipio = null;
	}

	async searchUploadShape() {
		let params = [];
		let self = this;
		let urlParams = '';


		this.layerFromConsulta.analyzedAreaLoading = true;
		params.push('token=' + this.layerFromConsulta.token)
		this.layerFromConsulta.error = false;
		urlParams = '/service/upload/findgeojsonbytoken?' + params.join('&');

		try {
			let result = await this.http.get(urlParams, this.httpOptions).toPromise()

			this.layerFromConsulta.analyzedArea = result;
			this.layerFromConsulta.analyzedAreaLoading = false;
			this.loadLayerFromConsultaToMap();

		} catch (err) {
			self.layerFromConsulta.analyzedAreaLoading = false;
			self.layerFromConsulta.error = true;
		}

	}

	clearArea(fromConsulta = false) {
		if (fromConsulta) {
			this.map.removeLayer(this.layerFromConsulta.layer);
			this.layerFromConsulta.visible = false;
			this.layerFromConsulta.checked = false;
			this.layerFromConsulta.token = '';
			this.layerFromConsulta.analyzedArea = {}
			this.updateRegion(this.defaultRegion);
		} else {
			this.layerFromUpload.visible = false;
			this.layerFromUpload.checked = false;
			this.map.removeLayer(this.layerFromUpload.layer);
			this.layerFromUpload.analyzedArea = {}
			this.updateRegion(this.defaultRegion);
		}
	}

	clearUpload(fromConsulta = false) {
		if (fromConsulta) {
			this.layerFromConsulta.analyzedArea = {}
			this.map.removeLayer(this.layerFromConsulta.layer);
			this.layerFromConsulta.visible = false;
			this.layerFromConsulta.checked = false;
			this.layerFromConsulta.token = '';
			this.layerFromConsulta.error = false;
		} else {
			this.layerFromUpload.analyzedArea = {}
			this.map.removeLayer(this.layerFromUpload.layer);
			this.layerFromUpload.visible = false;
			this.layerFromUpload.checked = false;
		}
		this.updateRegion(this.defaultRegion);
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
			loadTilesWhileInteracting: true,
			interactions: defaultInteractions({ altShiftDragRotate: false, pinchRotate: false })
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

		select.on('select', function (event) {
			if (event.selected.length > 0) {
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

		this.infoOverlay = new Overlay({
			element: document.getElementById('map-info'),
			offset: [15, 15],
			stopEvent: false
		});
		this.keyForPointer = this.map.on(
			'pointermove',
			this.callbackPointerMoveMap.bind(this)
		);

		this.keyForClick = this.map.on(
			'singleclick',
			this.callbackClickMap.bind(this)
		);

		this.map.addOverlay(this.infoOverlay);


	}

	private callbackPointerMoveMap(evt) {

		let utfgridlayerPastagemVisible = this.utfgridlayerPastagem.getVisible();
		if (!utfgridlayerPastagemVisible || evt.dragging) {
			return;
		}

		let utfgridlayerMapbiomasVisible = this.utfgridlayerMapbiomas.getVisible();
		if (!utfgridlayerMapbiomasVisible || evt.dragging) {
			return;
		}


		let pastagem = this.layersNames.find(element => element.id === "mapa_pastagem");
		let mapbiomas = this.layersNames.find(element => element.id === "mapa_uso_solo");

		let coordinate = this.map.getEventCoordinate(evt.originalEvent);
		let viewResolution = this.map.getView().getResolution();
		let isPastagem = false
		if (pastagem.visible) {

			isPastagem = true;

			if (isPastagem) {
				if (this.utfgridsourcePastagem) {
					this.utfgridsourcePastagem.forDataAtCoordinateAndResolution(coordinate, viewResolution, function (data) {
						if (data) {
							window.document.body.style.cursor = 'pointer';
							this.infodataPastagem = data;
							this.infoOverlay.setPosition(this.infodataPastagem ? coordinate : undefined);
						}
						else {
							window.document.body.style.cursor = 'auto';
							this.infodataPastagem = null;
						}

					}.bind(this)
					);
				}
			}

		}

		if (mapbiomas.visible) {

			let isMapbiomas = false
			if (mapbiomas.selectedType === 'uso_solo_mapbiomas') {
				isMapbiomas = true;
			}
			// console.log(this.layersNames, isPastagem)
			if (isMapbiomas) {
				if (this.utfgridsourceMapbiomas) {
					this.utfgridsourceMapbiomas.forDataAtCoordinateAndResolution(coordinate, viewResolution, function (data) {
						if (data) {
							window.document.body.style.cursor = 'pointer';
							this.infodataMapbiomas = data;

							let auxColor = this.infodataMapbiomas.lulc_color.split("?")
							let auxName = this.infodataMapbiomas.lulc_name.split("?")
							let auxArea = this.infodataMapbiomas.lulc_ha.split("?")
							let arr = [];
							for (let i = 0; i < auxColor.length; i++) {
								arr.push({
									lulc_color: auxColor[i],
									lulc_name: auxName[i],
									lulc_area: parseFloat(auxArea[i])
								})
							}

							let result = []
							arr.reduce(function (res, value) {
								if (!res[value.lulc_name]) {
									res[value.lulc_name] = { lulc_name: value.lulc_name, lulc_color: value.lulc_color, lulc_area: 0 };
									result.push(res[value.lulc_name])
								}
								res[value.lulc_name].lulc_area += value.lulc_area;
								return res;
							}, {});


							this.infodataMapbiomas.arrLulc = result
							// console.log(this.infodataMapbiomas)

							this.infoOverlay.setPosition(this.infodataMapbiomas ? coordinate : undefined);
						}
						else {
							window.document.body.style.cursor = 'auto';
							this.infodataMapbiomas = null;
						}

					}.bind(this)
					);
				}
			}

		}


	}

	callbackClickMap(evt) {

		let zoom = this.map.getView().getZoom();
		let viewResolution = this.map.getView().getResolution();
		let coordinate = null;

		coordinate = this.map.getEventCoordinate(evt.originalEvent);


		let pastagem = this.layersNames.find(element => element.id === "mapa_pastagem");
		let mapbiomas = this.layersNames.find(element => element.id === "mapa_uso_solo");

		let isPastagem = false
		if (pastagem.visible) {
			isPastagem = true;
			if (isPastagem) {
				if (this.utfgridsourcePastagem) {
					this.utfgridsourcePastagem.forDataAtCoordinateAndResolution(coordinate, viewResolution, function (data) {
						if (data) {
							this.searchAndAppRegion(data)
						}
					}.bind(this)
					);
				}
			}
		}

		if (mapbiomas.visible) {
			let isMapbiomas = false
			if (mapbiomas.selectedType === 'uso_solo_mapbiomas') {
				isMapbiomas = true;
			}
			// console.log(this.layersNames, isPastagem)
			if (isMapbiomas) {
				if (this.utfgridsourceMapbiomas) {
					this.utfgridsourceMapbiomas.forDataAtCoordinateAndResolution(coordinate, viewResolution, function (data) {
						if (data) {
							this.searchAndAppRegion(data)
						}
					}.bind(this)
					);
				}
			}
		}

	}

	private searchAndAppRegion(data) {

		this.http.get(SEARCH_REGION, { params: PARAMS.set('key', data.cd_geocmu) }).subscribe(result => {
			let ob = result[0];

			this.updateRegion(ob);
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
					params: {
						'LAYERS': 'rgb',
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

		for (let baseName of this.basemapsNames) {
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

		this.utfgridsourcePastagem = new UTFGrid({
			tileJSON: this.getTileJSONPastagem()
		});

		this.utfgridlayerPastagem = new OlTileLayer({
			source: this.utfgridsourcePastagem
		});

		this.utfgridsourceMapbiomas = new UTFGrid({
			tileJSON: this.getTileJSONMapbiomas()
		});

		this.utfgridlayerMapbiomas = new OlTileLayer({
			source: this.utfgridsourceMapbiomas
		});

		this.layers.push(this.utfgridlayerPastagem);
		this.layers.push(this.utfgridlayerMapbiomas);

		this.layers = this.layers.concat(olLayers.reverse());
	}

	private getTileJSONPastagem() {
		let pastagem = this.layersNames.find(element => element.id === "mapa_pastagem");

		let text = ""
		if (pastagem != undefined) {
			let res = this.selectedTimeFromLayerType(pastagem.selectedType);
			if (res == undefined) {
				text = "year=2019"
			}
			else {
				text = res.value;
			}
		}

		return {
			version: '2.2.0',
			grids: [
				this.returnUTFGRID('cepf_pasture_rebanho_regions_utfgrid', text, '{x}+{y}+{z}')
			]
		};
	}

	private getTileJSONMapbiomas() {
		let mapbiomas = this.layersNames.find(element => element.id === "mapa_uso_solo");

		let text = ""
		if (mapbiomas != undefined) {
			let res = this.selectedTimeFromLayerType(mapbiomas.selectedType);
			text = res.value;
		}

		return {
			version: '2.2.0',
			grids: [
				this.returnUTFGRID('cepf_mapbiomas_regions_utfgrid', text, '{x}+{y}+{z}')
			]
		};
	}

	private returnUTFGRID(layername, filter, tile) {
		return '/ows?layers=' + layername + '&MSFILTER=' + filter + '&mode=tile&tile=' + tile + '&tilemode=gmap&map.imagetype=utfgrid'
	}

	private selectedTimeFromLayerType(layerName) {
		for (let layer of this.layersTypes) {
			if (layer.value == layerName) {
				if (layer.hasOwnProperty('times')) {
					for (let time of layer.times) {
						if (time.value == layer.timeSelected) {
							return time;
						}
					}
				}

			}
		}

		return undefined;
	}

	private handleInteraction() {

		let pastagem = this.layersNames.find(element => element.id === "mapa_pastagem");
		let mapbiomas = this.layersNames.find(element => element.id === "mapa_uso_solo");

		if (pastagem.visible || mapbiomas.visible) {
			if (pastagem.visible) {
				if (this.utfgridsourcePastagem) {
					let tileJSON = this.getTileJSONPastagem();

					this.utfgridsourcePastagem.tileUrlFunction_ = _ol_TileUrlFunction_.createFromTemplates(tileJSON.grids, this.utfgridsourcePastagem.tileGrid);
					this.utfgridsourcePastagem.tileJSON = tileJSON;
					this.utfgridsourcePastagem.refresh();

					this.utfgridlayerPastagem.setVisible(true);
				}
			}
			else {
				this.infodataPastagem = null;
			}

			if (mapbiomas.visible && mapbiomas.selectedType == "uso_solo_mapbiomas") {

				if (this.utfgridsourceMapbiomas) {
					let tileJSONmapbiomas = this.getTileJSONMapbiomas();

					this.utfgridsourceMapbiomas.tileUrlFunction_ = _ol_TileUrlFunction_.createFromTemplates(tileJSONmapbiomas.grids, this.utfgridsourceMapbiomas.tileGrid);
					this.utfgridsourceMapbiomas.tileJSON = tileJSONmapbiomas;
					this.utfgridsourceMapbiomas.refresh();

					this.utfgridlayerMapbiomas.setVisible(true);
				}
			} else {
				this.infodataMapbiomas = null;
			}


		}
		else {
			this.utfgridlayerPastagem.setVisible(false);
			this.infodataPastagem = null;
			this.utfgridlayerMapbiomas.setVisible(false);
			this.infodataMapbiomas = null;
			window.document.body.style.cursor = 'auto';
		}

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
						fill: new Fill({ color: '#ffd5c1', width: 1 }),
						stroke: new Stroke({ color: '#7b2900', width: 2 })
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

		if (layer.timeSelected) {
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

	private updateSourceLayer(layer) {
		var source_layers = this.LayersTMS[layer.value].getSource();
		source_layers.setUrls(this.parseUrls(layer))
		source_layers.refresh();
		if (layer.value == "uso_solo_mapbiomas" || layer.value == "pasture") {
			this.year = layer.timeSelected
			this.updateCharts();
			this.handleInteraction();
		}
		this.handleInteraction();
	}

	baseLayerChecked(base, e) {

		for (let basemap of this.basemapsNames) {
			if (base.value == basemap.value && e.checked) {
				this[base.value].layer.setVisible(true);
				basemap.visible = true;
			} else if (basemap.value != base.value) {
				this[basemap.value].layer.setVisible(false);
				basemap.visible = false;
			} else {
				this[this.descriptor.basemaps[0].defaultBaseMap].layer.setVisible(true);
				if (basemap.value != this.descriptor.basemaps[0].defaultBaseMap) {
					this[basemap.value].layer.setVisible(false);
					this[basemap.value].visible = false;
				}
			}
		}
	}

	limitsLayersChecked(layers, e) {
		//limits
		for (let limits of this.limitsNames) {
			if (layers.value == limits.value) {
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

		if (layer.types) {
			for (let layerType of layer.types) {
				this.LayersTMS[layerType.value].setVisible(false)
			}
		} else {
			this.LayersTMS[layer.value].setVisible(false)
		}

		if (e != undefined)
			layer.visible = e.checked

		this.handleInteraction();

		this.LayersTMS[layer.selectedType].setVisible(layer.visible)
	}

	legendchecked(layer, e) {
		layer.visible = !layer.visible
		this.changeVisibility(layer, e);
	}

	addPoints() {
		var msfilter = "?msfilter=bioma='CERRADO'";
		if (this.msFilterRegion) {
			msfilter = msfilter + ' AND ' + this.msFilterRegion;
		}
		var fieldValidationUrl = '/service/map/fieldPoints' + msfilter;

		this.http.get(fieldValidationUrl).subscribe(fieldValResult => {
			var features = (new GeoJSON()).readFeatures(fieldValResult, {
				dataProjection: 'EPSG:4326',
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
		if (layer.types) {
			for (let layerSelected of layer.types) {
				if (layerSelected.value == layer.selectedType) {
					if (layerSelected.timeSelected)
						yearDownload = '&' + layerSelected.timeSelected;
					columnsCSV = '&columnsCSV=' + layerSelected.columnsCSV;
				}
			}
		} else if (layer.timeSelected) {
			yearDownload = '&' + layer.timeSelected;
			columnsCSV = '&columnsCSV=' + layer.columnsCSV;
		}

		if (this.msFilterRegion == "") {
			filterRegion = this.regionFilterDefault
		} else {
			filterRegion = this.msFilterRegion
		}

		if (this.selectRegion.type == 'estado')
			regionType = "uf"

		if (tipo == 'shp') {
			this.linkDownload = "/service/map/downloadSHP?layer=" + layer.selectedType + yearDownload + '&regionType=' + regionType + '&region=' + this.selectRegion.value;
		} else {
			// console.log("/service/map/downloadCSV?layer=" + layer.selectedType + yearDownload + '&filterRegion=' + filterRegion + columnsCSV + '&regionName=' + this.selectRegion.value)
			this.linkDownload = "/service/map/downloadCSV?layer=" + layer.selectedType + yearDownload + '&filterRegion=' + filterRegion + columnsCSV + '&regionName=' + this.selectRegion.value;
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


	showDialogUTFGrid() {
		let dialog = { visibility: 'hidden' };

		if (this.infodataPastagem) {
			dialog.visibility = 'visible'
		}

		if (this.infodataMapbiomas) {
			dialog.visibility = 'visible'
		}


		return dialog;
	}

	disableUTFGrid() {
		this.infodataPastagem = null
		this.infodataMapbiomas = null
		window.document.body.style.cursor = 'auto';
	}

	ngOnInit() {

		this.http.get('service/map/descriptor?lang=' + this.language).subscribe(result => {
			this.descriptor = result
			this.regionFilterDefault = this.descriptor.regionFilterDefault;

			for (let groups of this.descriptor.groups) {

				for (let layers of groups.layers) {
					if (layers.types) {
						for (let types of layers.types) {
							this.layersTypes.push(types)
						}
					} else {
						this.layersTypes.push(layers);
					}
					// this.layersTypes.sort(function (e1, e2) {
					// 	return (e2.order - e1.order)
					// });

					this.layersNames.push(layers);
				}

			}
			for (let basemap of this.descriptor.basemaps) {
				for (let types of basemap.types) {
					this.basemapsNames.push(types)
				}
			}

			for (let limits of this.descriptor.limits) {
				for (let types of limits.types) {
					this.limitsNames.push(types)
				}
			}

			this.createMap();
			this.updateCharts();
			this.addPoints();
		});
		this.setStylesLangButton();

		const self = this;
		self.route.paramMap.subscribe(function (params) {
			// if (self.router.url.includes('usodosolo')) {
			// 	if (params.keys.includes('token')) {
			// 		if (window.innerWidth < self.breakpointMobile) {
			// 			self.router.navigate(['usodosolo/' + params.get('token')]);
			// 		} else {
			// 			self.openReport(params);
			// 		}
			// 	}
			// }

			if (self.router.url.includes('regions')) {
				if (window.innerWidth < self.breakpointMobile) {
					self.router.navigate(['regions/' + params.get('token')]);
				} else {
					self.selectedIndexConteudo = 1;
					self.selectedIndexUpload = 1;
					self.layerFromConsulta.token = params.get('token');
					self.searchUploadShape();
					self.analyzeUploadShape(true);
					self.showLayers = !self.showLayers;
				}
			}
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
		@Inject(MAT_DIALOG_DATA) public data) { }

	onNoClick(): void {
		this.dialogRef.close();
	}

}
