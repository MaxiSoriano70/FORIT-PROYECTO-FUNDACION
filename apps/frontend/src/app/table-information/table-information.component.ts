import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { IInformation } from '../../shared/entities/information';

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

  @Input() informations: any[] = [];

  @Output() editInformation = new EventEmitter<IInformation>();
  @Output() deleteInformation = new EventEmitter<IInformation>();
  @Output() viewInformationDetails = new EventEmitter<IInformation>();
  @Output() convertToUser = new EventEmitter<IInformation>();

  displayedColumns: string[] = [
    'fullName',
    'email',
    'phone',
    'courseName',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<IInformation>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.informations;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['informations'] && !changes['informations'].firstChange) {
      this.dataSource.data = this.informations;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEdit(info: IInformation): void {
    this.editInformation.emit(info);
  }

  onDelete(info: IInformation): void {
    this.deleteInformation.emit(info);
  }

  onViewDetails(info: IInformation): void {
    this.viewInformationDetails.emit(info);
  }

  onConvert(info: IInformation): void {
    this.convertToUser.emit(info);
  }
}
