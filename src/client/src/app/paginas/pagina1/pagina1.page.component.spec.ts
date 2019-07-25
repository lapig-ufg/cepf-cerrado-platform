import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Pagina1.PageComponent } from './pagina1.page.component';

describe('Pagina1.PageComponent', () => {
  let component: Pagina1.PageComponent;
  let fixture: ComponentFixture<Pagina1.PageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Pagina1.PageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Pagina1.PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
