import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaLayoutComponent } from './pagina-layout.component';

describe('PaginaLayoutComponent', () => {
  let component: PaginaLayoutComponent;
  let fixture: ComponentFixture<PaginaLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginaLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
