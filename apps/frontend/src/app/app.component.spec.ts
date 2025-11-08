import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule
      ],
    }).compileComponents();
  });

  it('deberia retornar un titulo correcto', () =>{
    const fixture = TestBed.createComponent(AppComponent);
    const titulo = fixture.componentInstance.obtenerTitulo();
    expect(titulo).toBe('Entrega 3');
  });
});
