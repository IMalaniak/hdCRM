import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { PlanService } from '../../_services';
import { Plan } from '../../_models';
import { UsersDialogComponent, User } from '@/_modules/users';
import { AuthenticationService, LoaderService } from '@/_shared/services';
import { Asset } from '@/_modules/attachments';
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.scss']
})
export class AddPlanComponent implements OnInit {
  plan = new Plan();
  baseUrl: string;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private planService: PlanService,
    private loaderService: LoaderService,
    private dialog: MatDialog
  ) {
    this.baseUrl = environment.baseUrl;
   }

  ngOnInit() {}

  addParticipantDialog(): void {
    const dialogRef = this.dialog.open(UsersDialogComponent, {
      height: '80vh',
      data: {
        title: 'Select participants',
      }
    });

    if (this.plan.Participants) {
      const usersC = dialogRef.componentInstance.usersComponent;

      dialogRef.afterOpened().subscribe(result => {
        this.loaderService.isLoaded.subscribe(isLoaded => {
          if (isLoaded) {
            for (const participant of this.plan.Participants) {
              usersC.sortedData.find((user, i) => {
                  if (user.id === participant.id) {
                      usersC.sortedData[i].selected = true;
                      return true; // stop searching
                  }
              });
            }
            usersC.resetSelected(false);
          }
        });
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.plan.Participants = result;
      }
    });
  }

  onClickSubmit() {
    if (this.plan.Participants && this.plan.Participants.length > 0) {
      this.plan.Participants = this.plan.Participants.map(user => {
          return<User> {
            id: user.id
          };
      });
    }

    this.plan.CreatorId = this.authService.currentUserValue.id;

    // Register plan
    this.planService.createPlan(this.plan).subscribe(
      data => {
        swal({
          title: 'Plan created!',
          type: 'success',
          timer: 1500
        });
        this.router.navigate(['/planner']);
      },
      error => {
        swal({
          title: 'Ooops, something went wrong!',
          type: 'error',
          timer: 1500
        });
        this.router.navigate(['/register/plan']);
    });
  }

}
