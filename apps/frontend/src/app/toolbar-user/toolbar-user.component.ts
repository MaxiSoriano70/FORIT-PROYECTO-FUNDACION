import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../../shared/entities/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddFormUserComponent } from '../modal-add-form-user/modal-add-form-user.component';
declare const swal: any;

@Component({
  selector: 'app-toolbar-user',
  imports: [],
  templateUrl: './toolbar-user.component.html',
  styleUrl: './toolbar-user.component.css'
})
export class ToolbarUserComponent {
  @Output() addUser = new EventEmitter<User>();

  constructor(private modalService: NgbModal) { }

  abrirModal() {
    const modalRef = this.modalService.open(ModalAddFormUserComponent, { centered: true });

    modalRef.result.then(
      (newUser: User) => {
        if (newUser) {
          this.addUser.emit(newUser);
          swal("¡Éxito!", "El usuario fue agregado correctamente.", "success");
        }
      },
      () => { }
    );
  }
}
