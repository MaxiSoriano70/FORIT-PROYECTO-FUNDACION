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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Course } from '../../shared/entities/course';

@Component({
  selector: 'app-table-registrations',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './table-registrations.component.html',
  styleUrls: ['./table-registrations.component.css']
})
export class TableRegistrationsComponent implements OnChanges, AfterViewInit {

  @Input() courses: Course[] = [];

  @Output() manageStudents = new EventEmitter<Course>();

  displayedColumns: string[] = [
    'name',
    'startDate',
    'endDate',
    'capacity',
    'pricePerMonth',
    'actions'
  ];

  dataSource = new MatTableDataSource<Course>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = this.courses;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['courses'] && !changes['courses'].firstChange) {
      this.dataSource.data = this.courses;
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

  onManage(course: Course): void {
    this.manageStudents.emit(course);
  }
}
