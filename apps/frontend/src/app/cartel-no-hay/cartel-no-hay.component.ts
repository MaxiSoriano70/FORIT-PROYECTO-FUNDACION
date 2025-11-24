import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cartel-no-hay',
  standalone: true,
  templateUrl: './cartel-no-hay.component.html',
  styleUrl: './cartel-no-hay.component.css'
})
export class CartelNoHayComponent {

  @Input() mensaje: string = "No hay registros disponibles";

}
