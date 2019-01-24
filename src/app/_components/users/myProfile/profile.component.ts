import { environment } from 'environments/environment';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { UserService, TranslationsService } from '@/_services';
import { User } from '@/_models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  baseUrl: string;
  user: User;
  userInitial: User;
  translations: Object;
  editForm: boolean;
  langs: string[];

  constructor(
    public translationsService: TranslationsService,
    private userService: UserService
  ) {
    this.baseUrl = environment.baseUrl;
  }

  ngOnInit() {
    this.langs = this.translationsService.translate.getLangs();
    this.translationsService.getTranslations([
      'PROFILECOMPONENT.PopUps.udpateUserTitle',
      'PROFILECOMPONENT.PopUps.udpateUserText',
      'PROFILECOMPONENT.PopUps.udpateUserSuccess',
      'PROFILECOMPONENT.PopUps.udpateUserError'
    ]).subscribe((translations: string[]) => {
      this.translations = translations;
    });
    this.getUserData();
    this.editForm = false;
  }

  getUserData(): void {
    this.userService.getProfile().subscribe(profile => {
      this.user = profile;
      this.userInitial = { ...this.user };
    });
  }

  onClickEdit(): void {
    this.editForm = true;
  }

  onClickCancelEdit(): void {
    this.editForm = false;
    this.user = this.userInitial;
  }

  onUpdateUserSubmit(): void {
    swal({
      title: this.translations['PROFILECOMPONENT.PopUps.udpateUserTitle'],
      text: this.translations['PROFILECOMPONENT.PopUps.udpateUserText'],
      type: 'question',
      showCancelButton: true,
      confirmButtonText: this.translationsService.globalTranslations['GLOBAL.PopUps.confirmButtonText'],
      cancelButtonText: this.translationsService.globalTranslations['GLOBAL.PopUps.cancelButtonText']
    }).then((result) => {
      if (result.value) {
        this.updateUser();
      }
    });
}

  updateUser(): void {
    this.userService.updateUser(this.user).subscribe(
      user => {
        this.user = user;
        this.userInitial = { ...this.user };
        this.editForm = false;
        swal({
          text: this.translations['PROFILECOMPONENT.PopUps.udpateUserSuccess'],
          type: 'success',
          timer: 6000,
          toast: true,
          showConfirmButton: false,
          position: 'bottom-end'
        });
      },
      error => {
        swal({
          text: this.translations['PROFILECOMPONENT.PopUps.udpateUserError'],
          type: 'error',
        });
      }
    );
  }


}
