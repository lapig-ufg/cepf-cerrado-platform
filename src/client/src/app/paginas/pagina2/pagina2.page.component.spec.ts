import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Pagina2.PageComponent } from './pagina2.page.component';

describe('Pagina2.PageComponent', () => {
  let component: Pagina2.PageComponent;
  let fixture: ComponentFixture<Pagina2.PageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Pagina2.PageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Pagina2.PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
