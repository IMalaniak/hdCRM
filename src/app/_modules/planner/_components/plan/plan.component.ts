import { environment } from 'environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { StagesDialogComponent } from '../../_components/stages/dialog/stages-dialog.component';
import { Plan, Stage, StageDetails } from '../../_models';
import { PlanService, StageService } from '../../_services';
import { UsersDialogComponent, User } from '@/_modules/users';
import { AuthenticationService, LoaderService, PrivilegeService } from '@/_shared/services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit, OnDestroy {
  showDataLoader: boolean;
  appUser: User;
  baseUrl: string;
  plan: Plan;
  planInitial: Plan;
  initialStages: Stage[];
  editForm: boolean;
  configPlanStages: boolean;
  editPlanPrivilege: boolean;
  configStagesPrivilege: boolean;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private privilegeService: PrivilegeService,
    private loaderService: LoaderService,
    private dialog: MatDialog,
    private authService: AuthenticationService
  ) {
    this.baseUrl = environment.baseUrl;
    this.editForm = false;
    this.configPlanStages = false;
    this.showDataLoader = true;
  }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.appUser = user;
      this.editPlanPrivilege = this.privilegeService.isPrivileged(user, 'editPlan');
      this.configStagesPrivilege = this.privilegeService.isPrivileged(user, 'configStages');
    });
    this.getPlanData();
  }

  get canEditPlan(): boolean {
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
          text: 'Stages updated!',
          type: 'success',
          timer: 6000,
          toast: true,
          showConfirmButton: false,
          position: 'bottom-end'
        });
      },
      error => {
        swal({
          text: 'Ooops, something went wrong!',
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
          text: 'Plan updated!',
          type: 'success',
          timer: 6000,
          toast: true,
          showConfirmButton: false,
          position: 'bottom-end'
        });
      },
      error => {
        swal({
          text: 'Ooops, something went wrong!',
          type: 'error',
        });
    });
  }

  addStageDialog(): void {
    this.showDataLoader = false;
    const dialogRef = this.dialog.open(StagesDialogComponent, {
      height: '80vh',
      data: {
        title: 'Select stages',
      }
    });

    const stagesC = dialogRef.componentInstance.stagesComponent;

    dialogRef.afterOpened().pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.loaderService.isLoaded.subscribe(isLoaded => {
        if (isLoaded) {
          for (const stage of this.plan.Stages) {
            stagesC.stages.find((user, i) => {
                if (user.id === stage.id) {
                  stagesC.stages[i].selected = true;
                    return true; // stop searching
                }
            });
          }
          stagesC.resetSelected(false);
        }
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
    this.showDataLoader = false;
    const dialogRef = this.dialog.open(UsersDialogComponent, {
      height: '80vh',
      data: {
        title: 'Select participants',
      }
    });

    const usersC = dialogRef.componentInstance.usersComponent;

    dialogRef.afterOpened().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
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

    dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
      if (result) {
        this.plan.Participants = result;
      }
    });
  }

  deleteDoc(docId: number): void {
    swal({
      title: 'You are going to delete document',
      text: 'Are you sure you want to delete document from plan, changes cannot be undone?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
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
              text: 'You have successfully removed a document from plan',
              type: 'success',
              timer: 6000,
              toast: true,
              showConfirmButton: false,
              position: 'bottom-end'
            });
          } else {
            swal({
              text: 'Ooops, something went wrong!',
              type: 'error',
            });
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
