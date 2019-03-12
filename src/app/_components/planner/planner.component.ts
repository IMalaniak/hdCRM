import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Plan } from '@/_models';
import { PlanService } from '@/_services';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnInit {
  plans: Plan[];

  constructor(
    private planService: PlanService
  ) {
  }

  ngOnInit() {
    this.getPlannerData();
  }

  getPlannerData(): void {
    this.planService.getFullList().subscribe(plans => {
      this.plans = plans;
    });
  }

}
