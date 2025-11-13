import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosApiService } from './usuarios-api.service';
import { User } from '../../../shared/entities/user';
import { ToolbarUserComponent } from "../../toolbar-user/toolbar-user.component";
import { TableUsersComponent } from "../../table-users/table-users.component";
import { LoadingComponent } from "../../loading/loading.component";
import { ModalEditFormUserComponent } from '../../modal-edit-form-user/modal-edit-form-user.component';
import { Router } from '@angular/router';
declare const swal: any;

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarUserComponent,
    TableUsersComponent,
    LoadingComponent
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {

  users$!: Observable<User[]>;

  constructor(
    private usuariosApi: UsuariosApiService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.users$ = this.usuariosApi.getUsuarios();
  }

  onUserAdded(user: User): void {
    this.usuariosApi.addUsuario(user).pipe(
      switchMap(() => {
        this.loadUsers();
        return of(null);
      })
    ).subscribe({
      next: () => swal('Éxito', 'Usuario agregado correctamente.', 'success'),
      error: () => swal('Error', 'No se pudo agregar el usuario.', 'error')
    });
  }

  openEditModal(user: User): void {
    const modalRef = this.modalService.open(ModalEditFormUserComponent, { centered: true });
    modalRef.componentInstance.user = { ...user };

    modalRef.result.then((updatedUser: User) => {
      if (updatedUser) {
        this.usuariosApi.updateUsuario(updatedUser).pipe(
          switchMap(() => {
            this.loadUsers();
            return of(null);
          })
        ).subscribe({
          next: () => swal('Éxito', 'Usuario actualizado correctamente.', 'success'),
          error: () => swal('Error', 'Ocurrió un error al actualizar el usuario.', 'error')
        });
      }
    }).catch(() => {});
  }

  onUserDeleted(user: User): void {
    swal({
      title: '¿Estás seguro?',
      text: `Eliminar al usuario: ${user.firstName} ${user.lastName}`,
      icon: 'warning',
      buttons: {
        cancel: 'Cancelar',
        confirm: {
          text: 'Sí, eliminar',
          value: true
        }
      },
      dangerMode: true
    }).then((willDelete: boolean) => {
      if (willDelete) {
        this.usuariosApi.deleteUsuario(user).pipe(
          switchMap(() => {
            this.loadUsers();
            return of(null);
          })
        ).subscribe({
          next: () => swal('¡Eliminado!', 'El usuario fue eliminado correctamente.', 'success'),
          error: () => swal('Error', 'Ocurrió un error al eliminar el usuario.', 'error')
        });
      }
    });
  }

  openDetailPage(user: User): void {
    this.router.navigate(['/usuarios/view'], { state: { user } });
  }
}
