import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidgoiasComponent } from './covidgoias.component';

describe('CovidgoiasComponent', () => {
  let component: CovidgoiasComponent;
  let fixture: ComponentFixture<CovidgoiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovidgoiasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidgoiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
