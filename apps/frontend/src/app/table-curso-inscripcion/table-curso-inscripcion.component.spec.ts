import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCursoInscripcionComponent } from './table-curso-inscripcion.component';

describe('TableCursoInscripcionComponent', () => {
  let component: TableCursoInscripcionComponent;
  let fixture: ComponentFixture<TableCursoInscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCursoInscripcionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableCursoInscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
