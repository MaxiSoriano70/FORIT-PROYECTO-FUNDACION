import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../shared/entities/user';
import { FullnamePipe } from '../../shared/pipes/fullname.pipe';

@Component({
  selector: 'app-table-students',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    FullnamePipe
  ],
  templateUrl: './table-students.component.html',
  styleUrls: ['./table-students.component.css']
})
export class TableStudentsComponent implements OnInit {
  @Input() students: User[] = [];
  @Output() editStudent = new EventEmitter<User>();
  @Output() deleteStudent = new EventEmitter<User>();
  @Output() detailStudent = new EventEmitter<User>();

  displayedColumns: string[] = ['fullname', 'email', 'phone', 'address', 'actions'];
  dataSource!: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.students);
  }

  ngOnChanges(): void {
    if (this.students) {
      this.dataSource = new MatTableDataSource(this.students);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEdit(student: User): void {
    this.editStudent.emit(student);
  }

  onDelete(student: User): void {
    this.deleteStudent.emit(student);
  }

  onDetail(student: User): void {
    this.detailStudent.emit(student);
  }
}
