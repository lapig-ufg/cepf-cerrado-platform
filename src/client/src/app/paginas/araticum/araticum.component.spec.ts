import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AraticumComponent } from './araticum.component';

describe('HomePageComponent', () => {
  let component: AraticumComponent;
  let fixture: ComponentFixture<AraticumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AraticumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AraticumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
