import { environment } from 'environments/environment';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { UsersComponentDialogComponent } from '@/_components';
import { Plan, User, Stage } from '@/_models';
import { PlanService, PrivilegeService, StageService, TranslationsService } from '@/_services';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
  baseUrl: string;
  plan: Plan;
  planInitial: Plan;
  stages: Stage[];
  editForm: boolean;
  editPlanPrivilege: boolean;
  translations: object;

  constructor(
    private translationsService: TranslationsService,
    private route: ActivatedRoute,
    private planService: PlanService,
    private privilegeService: PrivilegeService,
    private stageService: StageService,
    private dialog: MatDialog
  ) {
    this.baseUrl = environment.baseUrl;
  }

  ngOnInit() {
    this.translationsService.getTranslations([
      'PLANCOMPONENT.PopUps.udpatePlanTitle',
      'PLANCOMPONENT.PopUps.udpatePlanText',
      'PLANCOMPONENT.PopUps.udpatePlanSuccess',
      'PLANCOMPONENT.PopUps.udpatePlanError',
      'PLANCOMPONENT.PopUps.deletePlanDocumentTitle',
      'PLANCOMPONENT.PopUps.deletePlanDocumentText',
      'PLANCOMPONENT.PopUps.deletePlanDocumentSuccess',
      'PLANCOMPONENT.PopUps.SelectParticipantsTitle'
    ]).subscribe((translations: string[]) => {
      this.translations = translations;
    });

    this.canEditPlan();
    this.getPlanData();
    this.editForm = false;
  }

  canEditPlan(): void {
    this.editPlanPrivilege = this.privilegeService.checkUserPrivilege('editPlan');
  }

  getPlanData(): void {
    const id = +this.route.snapshot.paramMap.get('id');

    this.stageService.getStagesList().subscribe(stages => {
      this.stages = stages;
    });

    this.planService.getPlan(id).subscribe(plan => {
      this.plan = plan;
      this.planInitial = { ...this.plan };
    });

  }

  onClickEdit(): void {
    this.editForm = true;
  }

  onClickCancelEdit(): void {
    this.editForm = false;
    this.plan = this.planInitial;
  }

  onUpdatePlanSubmit(): void {
    swal({
      title: this.translations['PLANCOMPONENT.PopUps.udpatePlanTitle'],
      text: this.translations['PLANCOMPONENT.PopUps.udpatePlanText'],
      type: 'question',
      showCancelButton: true,
      confirmButtonText: this.translationsService.globalTranslations['GLOBAL.PopUps.confirmButtonText'],
      cancelButtonText: this.translationsService.globalTranslations['GLOBAL.PopUps.cancelButtonText']
    }).then((result) => {
      if (result.value) {
        this.updatePlan();
      }
    });
  }

  updatePlan(): void {
    this.plan.Participants = this.plan.Participants.map(user => {
        return<User> {
          id: user.id
        };
    });
    // Update plan
    this.planService.updatePlan(this.plan).subscribe(
      plan => {
        this.plan = plan;
        this.planInitial = { ...this.plan };
        this.editForm = false;
        swal({
          text: this.translations['PLANCOMPONENT.PopUps.udpatePlanSuccess'],
          type: 'success',
          timer: 6000,
          toast: true,
          showConfirmButton: false,
          position: 'bottom-end'
        });
      },
      error => {
        swal({
          text: this.translations['PLANCOMPONENT.PopUps.udpatePlanError'],
          type: 'error',
        });
    });
  }

  addParticipantDialog(): void {
    const dialogRef = this.dialog.open(UsersComponentDialogComponent, {
      height: '80vh',
      data: {
        title: this.translations['PLANCOMPONENT.PopUps.SelectParticipantsTitle'],
      }
    });

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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.plan.Participants = result;
      }
    });
  }

  deleteDoc(docId: number): void {
    swal({
      title: this.translations['PLANCOMPONENT.PopUps.deletePlanDocumentTitle'],
      text: this.translations['PLANCOMPONENT.PopUps.deletePlanDocumentText'],
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translationsService.globalTranslations['GLOBAL.PopUps.confirmButtonText'],
      cancelButtonText: this.translationsService.globalTranslations['GLOBAL.PopUps.cancelButtonText']
    }).then((result) => {
      if (result.value) {
        const req = {
          planId: this.plan.id,
          docId: docId
        };
        this.planService.deleteDoc(req).subscribe(plan => {
          console.log(plan);
          if (plan) {
            this.plan = plan;
            this.planInitial = { ...this.plan };
            swal({
              text: this.translations['PLANCOMPONENT.PopUps.deletePlanDocumentSuccess'],
              type: 'success',
              timer: 6000,
              toast: true,
              showConfirmButton: false,
              position: 'bottom-end'
            });
          } else {
            swal({
              text: this.translations['PLANCOMPONENT.PopUps.udpatePlanError'],
              type: 'error',
            });
          }
        });
      }
    });
  }

}
