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
  selector: 'app-table-users',
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
  templateUrl: './table-users.component.html',
  styleUrls: ['./table-users.component.css']
})
export class TableUsersComponent implements OnInit {
  @Input() users: User[] = [];
  @Output() editUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<User>();
  @Output() detailUser = new EventEmitter<User>();

  displayedColumns: string[] = ['fullname', 'email', 'phone', 'address', 'role', 'actions'];
  dataSource!: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.users);
  }

  ngOnChanges(): void {
    if (this.users) {
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEdit(user: User): void {
    this.editUser.emit(user);
  }

  onDelete(user: User): void {
    this.deleteUser.emit(user);
  }

  onDetail(user: User): void {
    this.detailUser.emit(user);
  }
}
