import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Course } from '../../../../shared/entities/course';

@Component({
  selector: 'app-view-curso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-curso.component.html',
  styleUrl: './view-curso.component.css'
})
export class ViewCursoComponent {
  course: Course | undefined;

  constructor(private router: Router, private location: Location) {
    const navigation = this.router.getCurrentNavigation();
    this.course = navigation?.extras.state?.['course'];
  }

  goBack(): void {
    this.location.back();
  }
}
