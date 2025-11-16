import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BannerComponent } from "../../banner/banner.component";
import { LoadingComponent } from "../../loading/loading.component";
import { Observable } from 'rxjs';
import { Course } from '../../../shared/entities/course';
import { HomeApiService } from './home-api.service';
import { RollingCodeComponent } from "../../rolling-code/rolling-code.component";
import { FooterComponent } from "../../footer/footer.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddFormInformationComponent } from '../../modal-add-form-information/modal-add-form-information.component';

import { Store } from '@ngrx/store';
import { User } from '../../../shared/entities/user';
import { Sesion } from '../../ngrx/auth/auth.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, BannerComponent, LoadingComponent, RollingCodeComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  courses$!: Observable<Course[]>;
  usuario$: Observable<User | null>;

  constructor(
    private homeApiService: HomeApiService,
    private modalService: NgbModal,
    private store: Store<{ sesion: Sesion }>
  ) {
    this.usuario$ = this.store.select(state => state.sesion.usuarioLogueado);
  }

  ngOnInit(): void {
    this.courses$ = this.homeApiService.getCursos();
  }

  abrirModal(courseId: string) {
    const modalRef = this.modalService.open(ModalAddFormInformationComponent, { size: 'lg' });
    modalRef.componentInstance.courseId = courseId;

    modalRef.closed.subscribe((data) => {
      if (data) {
        console.log("Información enviada:", data);
      }
    });
  }
}
