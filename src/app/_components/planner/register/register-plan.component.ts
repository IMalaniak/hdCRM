import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { UsersComponentDialogComponent } from '../../users/users.component';
import { PlanService, TranslationsService, AuthenticationService } from '@/_services';
import { User, Plan, Asset } from '@/_models';
import swal from 'sweetalert2';
import { error } from 'util';

@Component({
  selector: 'app-register-plan',
  templateUrl: './register-plan.component.html',
  styleUrls: ['./register-plan.component.scss']
})
export class RegisterPlanComponent implements OnInit {
  plan = new Plan();
  translations: object;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private translationsService: TranslationsService,
    private planService: PlanService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.translationsService.getTranslations([
      'REGISTERPLANCOMPONENT.Alerts.planAdded',
      'REGISTERPLANCOMPONENT.PopUps.SelectParticipantsTitle'
    ]).subscribe((translations: string[]) => {
      this.translations = translations;
    });
  }

  addParticipantDialog(): void {
    const dialogRef = this.dialog.open(UsersComponentDialogComponent, {
      height: '80vh',
      data: {
        title: this.translations['REGISTERPLANCOMPONENT.PopUps.SelectParticipantsTitle'],
      }
    });

    if (this.plan.Participants) {
      const usersC = dialogRef.componentInstance.usersComponent;

      dialogRef.afterOpen().subscribe(result => {
        usersC.checkIfDataIsLoaded().then(() => {
          for (const participant of this.plan.Participants) {
            usersC.sortedData.find((user, i) => {
                if (user.id === participant.id) {
                    usersC.sortedData[i].selected = true;
                    return true; // stop searching
                }
            });
          }
          usersC.resetSelected(false);
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
    this.plan.Participants = this.plan.Participants.map(user => {
        return<User> {
          id: user.id
        };
    });

    this.plan.CreatorId = this.authService.currentUserValue.id;

    // Register plan
    this.planService.createPlan(this.plan).subscribe(
      data => {
        swal({
          title: this.translations['REGISTERPLANCOMPONENT.Alerts.planAdded'],
          type: 'success',
          timer: 1500
        });
        this.router.navigate(['/planner']);
      },
      error => {
        swal({
          title: this.translationsService.globalTranslations['GLOBAL.PopUps.serverError'],
          type: 'error',
          timer: 1500
        });
        this.router.navigate(['/register/plan']);
    });
  }

}
