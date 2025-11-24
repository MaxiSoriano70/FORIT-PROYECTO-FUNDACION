import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BannerComponent } from "../../banner/banner.component";
import { LoadingComponent } from "../../loading/loading.component";
import { Observable, take } from 'rxjs';
import { Course } from '../../../shared/entities/course';
import { HomeApiService } from './home-api.service';
import { RollingCodeComponent } from "../../rolling-code/rolling-code.component";
import { FooterComponent } from "../../footer/footer.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { User } from '../../../shared/entities/user';
import { Sesion } from '../../ngrx/auth/auth.model';
import { ModalAddFormInformationComponent } from '../../modal-add-form-information/modal-add-form-information.component';
import { CartelNoHayComponent } from "../../cartel-no-hay/cartel-no-hay.component";
declare const swal: any;

@Component({
  selector: 'app-home',
  imports: [CommonModule, BannerComponent, LoadingComponent, RollingCodeComponent, FooterComponent, CartelNoHayComponent],
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
    this.usuario$.pipe(take(1)).subscribe(usuario => {

      const modalRef = this.modalService.open(ModalAddFormInformationComponent);

      modalRef.componentInstance.courseId = courseId;
      modalRef.componentInstance.usuario = usuario;

      modalRef.closed.subscribe((data) => {
        if (data) {
          this.homeApiService.createInformation(data).subscribe({
            next: () => {
              swal({
                title: "¡Solicitud enviada!",
                text: "Tu información fue enviada correctamente. Pronto nos contactaremos contigo.",
                icon: "success",
                button: "Aceptar"
              });
            },
            error: () => {
              swal({
                title: "Error",
                text: "Hubo un problema al enviar la información. Intenta nuevamente.",
                icon: "error",
                button: "Aceptar"
              });
            }
          });
        }
      });

    });
  }

}
