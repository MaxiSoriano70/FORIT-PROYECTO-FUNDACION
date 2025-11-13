import { Component } from '@angular/core';
import { User } from '../../../../shared/entities';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-usuario',
  imports: [],
  templateUrl: './view-usuario.component.html',
  styleUrl: './view-usuario.component.css'
})
export class ViewUsuarioComponent {
  user: User | undefined;

  constructor(private router: Router, private location: Location) {
    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras.state?.["user"];
  }

  goBack(): void {
    this.location.back();
  }
}
