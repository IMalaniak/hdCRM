import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DepartmentService } from '../../_services';
import { Department } from '../../_models';
import { AuthenticationService, PrivilegeService } from '@/_shared/services';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
  addDepPrivilege: boolean;
  departments$: Observable<Department[]>;

  constructor(
    private departmentService: DepartmentService,
    private authService: AuthenticationService,
    private privilegeService: PrivilegeService,
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.addDepPrivilege = this.privilegeService.isPrivileged(user, 'addDepartment');
    });
    this.getDepartmentsData();
  }

  getDepartmentsData(): void {
    this.departments$ = this.departmentService.getDepartmentList();
  }
}
