import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DepartmentService } from '../../_services';
import { Department } from '../../_models';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
  departments$: Observable<Department[]>;

  constructor(
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.getDepartmentsData();
  }

  getDepartmentsData(): void {
    this.departments$ = this.departmentService.getDepartmentList();
  }
}
