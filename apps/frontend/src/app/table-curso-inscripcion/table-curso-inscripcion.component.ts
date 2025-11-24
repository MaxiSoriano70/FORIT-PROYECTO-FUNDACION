import { Component, Input, OnInit, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ViewInscripcionApiService } from '../features/inscripciones/view-inscripcion/view-inscripcion-api.service';
import { TableCursoInscripcionApiService } from './table-curso-inscripcion-api.service';
declare const swal: any;

@Component({
  selector: 'app-table-curso-inscripcion',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './table-curso-inscripcion.component.html',
  styleUrl: './table-curso-inscripcion.component.css'
})
export class TableCursoInscripcionComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() courseId!: string;
  @Input() inscripciones: any[] = [];

  displayedColumns: string[] = [
    'student',
    'quotas',
    'pagado',
    'precioCuota',
    'status',
    'finalizo',
    'acciones'
  ];

  dataSource = new MatTableDataSource<any>([]);
  curso: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: ViewInscripcionApiService,
    private apiCurso: TableCursoInscripcionApiService
  ) {}

  ngOnInit() {
    console.log("ID del curso recibido:", this.courseId);

    if (this.courseId) {
      this.apiCurso.getCursoById(this.courseId).subscribe({
        next: (res) => {
          this.curso = res.data;
          console.log("Curso cargado:", this.curso);
        },
        error: (err) => console.error("Error al obtener curso", err)
      });
    }
  }

  ngOnChanges() {
    this.dataSource.data = this.inscripciones;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  puedeEliminar(): boolean {
    if (!this.curso) return false;

    const hoy = new Date();
    const inicio = new Date(this.curso.startDate);

    return hoy < inicio;
  }

  pagarCuota(row: any) {
    swal({
      title: "¿Confirmar pago?",
      text: `¿Deseas registrar el pago de 1 cuota de ${row.studentName}?`,
      icon: "warning",
      buttons: ["Cancelar", "Sí, pagar"],
      dangerMode: true,
    }).then((confirm: boolean) => {
      if (!confirm) return;

      this.api.payQuota(row._id, 1).subscribe({
        next: (res) => {
          row.paidQuotas = res.data.paidQuotas;
          swal("¡Pago registrado!", "Pago procesado.", "success");
        },
        error: () => swal("Error", "No se pudo registrar el pago.", "error")
      });
    });
  }

  darDeBaja(row: any) {
    swal({
      title: "¿Dar de baja?",
      text: `La inscripción de ${row.studentName} pasará a ABANDONADO.`,
      icon: "warning",
      buttons: ["Cancelar", "Sí"],
      dangerMode: true,
    }).then((confirm: boolean) => {
      if (!confirm) return;

      this.api.deactivateRegistration(row._id).subscribe({
        next: () => {
          row.status = "ABANDONADO";
          swal("Hecho", "Alumno dado de baja.", "success");
        },
        error: () => swal("Error", "No se pudo dar de baja.", "error")
      });
    });
  }

  darDeAlta(row: any) {
    swal({
      title: "¿Dar de alta?",
      text: `La inscripción de ${row.studentName} pasará a ACTIVO.`,
      icon: "info",
      buttons: ["Cancelar", "Sí"],
    }).then((confirm: boolean) => {
      if (!confirm) return;

      this.api.activateRegistration(row._id).subscribe({
        next: () => {
          row.status = "ACTIVO";
          swal("Hecho", "Alumno dado de alta.", "success");
        },
        error: () => swal("Error", "No se pudo activar.", "error")
      });
    });
  }

  eliminarInscripcion(row: any) {
    swal({
      title: "¿Eliminar inscripción?",
      text: `Esta acción eliminará la inscripción de ${row.studentName}.`,
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    }).then((confirm: boolean) => {
      if (!confirm) return;

      this.api.deleteRegistration(row._id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(i => i._id !== row._id);
          swal("Eliminada", "Inscripción eliminada.", "success");
        },
        error: () => swal("Error", "No se pudo eliminar.", "error")
      });
    });
  }
}
