import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IInformation } from '../../shared/entities/information';
import { TableInformationApiService } from './table-information-api.service';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
declare const swal: any;

@Component({
  selector: 'app-table-information',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './table-information.component.html',
  styleUrls: ['./table-information.component.css']
})
export class TableInformationComponent implements OnChanges, AfterViewInit {

  @Input() informations: IInformation[] = [];
  @Output() editInformation = new EventEmitter<IInformation>();
  @Output() deleteInformation = new EventEmitter<IInformation>();
  @Output() viewInformationDetails = new EventEmitter<IInformation>();
  @Output() convertToUser = new EventEmitter<IInformation>();

  displayedColumns: string[] = ['fullName', 'email', 'phone', 'courseName', 'status', 'actions'];
  dataSource = new MatTableDataSource<IInformation>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private apiService: TableInformationApiService) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['informations']) {
      if (this.informations.length === 0) return;

      const checks = this.informations.map(info =>
        this.apiService.isUserByEmail(info.email).pipe(
          map(isUser => ({ ...info, isAlreadyUser: isUser })),
          catchError(() => of({ ...info, isAlreadyUser: false }))
        )
      );

      forkJoin(checks).subscribe(results => {
        this.dataSource.data = results;
        if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  onEdit(info: IInformation): void {
    this.editInformation.emit(info);
  }

  onDelete(info: IInformation): void {
    this.deleteInformation.emit(info);
  }

  onConvert(info: IInformation): void {
    this.convertToUser.emit(info);
  }

  onMarkAsInformed(info: IInformation): void {

    swal({
      title: '¿Marcar como informado?',
      text: `Se marcará como INFORMADO a ${info.firstName} ${info.lastName}.`,
      icon: 'warning',
      buttons: ['Cancelar', 'Marcar'],
      dangerMode: false
    }).then((confirm: boolean) => {
      if (!confirm) return;

      this.apiService.markAsInformed(info._id).subscribe({
        next: () => {
          info.status = "INFORMADO";
          this.dataSource.data = [...this.dataSource.data];
          swal('Éxito', 'Marcado como INFORMADO.', 'success');
        },
        error: err => {
          console.error('Error actualizando estado:', err);
          swal('Error', 'No se pudo marcar como informado.', 'error');
        }
      });
    });

  }

}
