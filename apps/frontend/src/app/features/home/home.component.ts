import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BannerComponent } from "../../banner/banner.component";
import { LoadingComponent } from "../../loading/loading.component";
import { Observable } from 'rxjs';
import { Course } from '../../../shared/entities/course';
import { HomeApiService } from './home-api.service';
import { EdteamComponent } from "../../edteam/edteam.component";
import { RollingCodeComponent } from "../../rolling-code/rolling-code.component";
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule, BannerComponent, LoadingComponent, RollingCodeComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  courses$!: Observable<Course[]>;

  constructor(private homeApiService: HomeApiService) { }

  ngOnInit(): void {
    this.courses$ = this.homeApiService.getCursos();
  }

  private loadCourses() {
    this.courses$ = this.homeApiService.getCursos();
  }
}
