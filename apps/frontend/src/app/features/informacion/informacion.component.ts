import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, switchMap } from 'rxjs';
import { InformacionServiceService } from './informacion-service.service';
import { IInformation } from '../../../shared/entities/information';
import { TableInformationComponent } from "../../table-information/table-information.component";
import { LoadingComponent } from "../../loading/loading.component";
import { ModalEditFormInformationComponent } from "../../modal-edit-form-information/modal-edit-form-information.component";
import { EdteamComponent } from "../../edteam/edteam.component";
import { FooterComponent } from "../../footer/footer.component";
declare const swal: any;

@Component({
  selector: 'app-informacion',
  imports: [CommonModule, TableInformationComponent, LoadingComponent, EdteamComponent, FooterComponent],
  templateUrl: './informacion.component.html',
  styleUrl: './informacion.component.css'
})
export class InformacionComponent implements OnInit {

  information$!: Observable<IInformation[]>;

  constructor(
    private infoService: InformacionServiceService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadInformation();
  }

  loadInformation() {
    this.information$ = this.infoService.getAll();
  }

  openEditModal(info: IInformation): void {
    const modalRef = this.modalService.open(ModalEditFormInformationComponent, { size: 'lg' });
    modalRef.componentInstance.info = info;

    modalRef.result.then((updatedInfo: IInformation) => {
      if (updatedInfo) {
        this.infoService.update(updatedInfo._id!, updatedInfo).pipe(
          switchMap(() => {
            this.loadInformation();
            return of(null);
          })
        ).subscribe({
          next: () => swal('Éxito', 'Datos actualizados correctamente.', 'success'),
          error: () => swal('Error', 'Ocurrió un error al actualizar.', 'error')
        });
      }
    }).catch(() => {});
  }

  onInformationDeleted(info: IInformation): void {
    swal({
      title: '¿Seguro?',
      text: `Eliminar: ${info.firstName} ${info.lastName}`,
      icon: 'warning',
      buttons: ['Cancelar', 'Eliminar'],
      dangerMode: true
    }).then((willDelete: boolean) => {
      if (willDelete) {
        this.infoService.delete(info._id!).pipe(
          switchMap(() => {
            this.loadInformation();
            return of(null);
          })
        ).subscribe({
          next: () => swal('Eliminado', 'Registro eliminado correctamente.', 'success'),
          error: () => swal('Error', 'No se pudo eliminar.', 'error')
        });
      }
    });
  }

  onConvert(info: IInformation) {
    this.infoService.convertToUser(info._id!).pipe(
      switchMap(() => {
        this.loadInformation();
        return of(null);
      })
    ).subscribe({
      next: () => swal('Éxito', 'Convertido en usuario.', 'success'),
      error: () => swal('Error', 'No se pudo convertir.', 'error')
    });
  }
}
