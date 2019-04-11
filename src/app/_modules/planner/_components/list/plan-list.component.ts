import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';
import { Plan } from '../../_models';
import { PlanService } from '../../_services';
import { AuthenticationService, PrivilegeService } from '@/_shared/services';

@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.scss']
})
export class PlanListComponent implements OnInit {
  addPlanPrivilege: boolean;
  plans$: Observable<Plan[]>;

  constructor(
    private planService: PlanService,
    private authService: AuthenticationService,
    private privilegeService: PrivilegeService,
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.addPlanPrivilege = this.privilegeService.isPrivileged(user, 'addPlan');
    });
    this.getPlannerData();
  }

  getPlannerData(): void {
    this.plans$ = this.planService.getFullList();
  }
}
