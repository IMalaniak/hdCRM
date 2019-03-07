import { environment } from 'environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { UsersComponentDialogComponent } from '../../users/users.component';
import { StagesComponentDialogComponent } from '../../stages/stages.component';
import { Plan, User, Stage, StageDetails } from '@/_models';
import { AuthenticationService, PlanService, PrivilegeService, StageService, TranslationsService } from '@/_services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit, OnDestroy {
  appUser: User;
  baseUrl: string;
  plan: Plan;
  planInitial: Plan;
  initialStages: Stage[];
  editForm: boolean;
  configPlanStages: boolean;
  editPlanPrivilege: boolean;
  configStagesPrivilege: boolean;
  translations: object;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    public translationsService: TranslationsService,
    private route: ActivatedRoute,
    private planService: PlanService,
    private privilegeService: PrivilegeService,
    private stageService: StageService,
    private dialog: MatDialog,
    private authService: AuthenticationService
  ) {
    this.baseUrl = environment.baseUrl;
    this.editForm = false;
    this.configPlanStages = false;
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
    this.authService.currentUser.subscribe(user => {
      this.appUser = user;
      this.editPlanPrivilege = this.privilegeService.isPrivileged(user, 'editPlan');
      this.configStagesPrivilege = this.privilegeService.isPrivileged(user, 'configStages');
    });
    this.getPlanData();
  }

  canEditPlan(): boolean {
    return (this.editPlanPrivilege && this.configStagesPrivilege) || (this.appUser.id === this.plan.CreatorId);
  }

  getPlanData(): void {
    const id = +this.route.snapshot.paramMap.get('id');

    this.planService.getPlan(id).pipe(takeUntil(this.unsubscribe)).subscribe(plan => {
      this.plan = plan;
      this.planInitial = { ...plan };
      this.initialStages = [ ...plan.Stages ];
    });

  }

  goToNextStage(): void {
    this.planService.toNextStage(this.plan.id).pipe(takeUntil(this.unsubscribe)).subscribe(planStages => {
      this.plan.activeStage = planStages.activeStage;
      this.plan.activeStageId = planStages.activeStage.id;
      planStages.Stages.sort((a, b) => {
        return a.Details.order - b.Details.order;
      });
      planStages.Stages.forEach((stage, i) => {
        this.plan.Stages[i].Details.completed = stage.Details.completed;
      });
      this.planInitial = { ...this.plan };
    });
  }

  onClickEdit(): void {
    this.editForm = true;
  }

  onClickConfigureStages(): void {
    this.configPlanStages = true;
  }

  onClickCancelEditStages(): void {
    this.configPlanStages = false;
    this.plan.Stages = [ ...this.initialStages ];
  }

  onClickCancelEdit(): void {
    this.editForm = false;
    this.plan = { ...this.planInitial };
  }

  updatePlanStages(): void {
    this.planService.updatePlanStages(this.plan).pipe(takeUntil(this.unsubscribe)).subscribe(
      success => {
        // this.plan = plan;
        // this.planInitial = { ...this.plan };
        this.configPlanStages = false;
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

  updatePlan(): void {
    if (this.plan.Participants && this.plan.Participants.length > 0) {
      this.plan.Participants = this.plan.Participants.map(user => {
        return<User> {
          id: user.id
        };
      });
    }
    // Update plan
    this.planService.updatePlan(this.plan).pipe(takeUntil(this.unsubscribe)).subscribe(
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

  addStageDialog(): void {
    const dialogRef = this.dialog.open(StagesComponentDialogComponent, {
      height: '80vh',
      data: {
        title: this.translations['PLANCOMPONENT.PopUps.selectStagesTitle'],
      }
    });

    const stagesC = dialogRef.componentInstance.stagesComponent;

    dialogRef.afterOpened().pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      stagesC.checkIfDataIsLoaded().then(() => {
        for (const stage of this.plan.Stages) {
          stagesC.stages.find((user, i) => {
              if (user.id === stage.id) {
                stagesC.stages[i].selected = true;
                  return true; // stop searching
              }
          });
        }
        stagesC.resetSelected(false);
      });
    });

    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe((result: Stage[]) => {
      // remove unchecked
      const removeUnchecked = new Promise((resolve, reject) => {
        this.plan.Stages.forEach((stage, i) => {
          const tmp = result.filter(el => {
            return stage.id === el.id;
          });
          if (tmp.length === 0) {
            this.plan.Stages.splice(i, 1);
          }
          if (i === this.plan.Stages.length - 1) {
            resolve();
          }
        });
      });

      removeUnchecked.then(res => {
        // add checked if no such
        result.forEach((el, i) => {
          const tmp = this.plan.Stages.filter(stage => {
            return stage.id === el.id;
          });
          if (tmp.length === 0) {
            el.Details = new StageDetails(i);
            this.plan.Stages.push(el);
          }
        });
      });

    });
  }

  dragDropStages(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.plan.Stages, event.previousIndex, event.currentIndex);
    this.plan.Stages.forEach((el, i) => {
      el.Details.order = i;
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

    dialogRef.afterOpened().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
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

    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
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
        this.planService.deleteDoc(req).pipe(takeUntil(this.unsubscribe)).subscribe(plan => {
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

  ngOnDestroy() {
    console.log('plan component ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
