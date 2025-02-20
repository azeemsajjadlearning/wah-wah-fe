import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, finalize, forkJoin } from 'rxjs';
import { ConfirmationService } from 'src/app/common/confirmation/confirmation.service';
import { User } from 'src/app/models/auth';
import { City, Country, State } from 'src/app/models/third-party';
import { AuthService } from 'src/app/services/auth.service';
import { ThirdPartyService } from 'src/app/services/third-party.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: false
})
export class ProfileComponent {
  currentUser: User;
  allCountry: Country[];
  allState: State[];
  allCity: City[];

  userForm: FormGroup;

  constructor(
    private thirdPartyService: ThirdPartyService,
    private authService: AuthService,
    private _formbuilder: FormBuilder,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    let country = this.thirdPartyService.getCountry();
    let user = this.authService.getUser();

    forkJoin([country, user]).subscribe((resp) => {
      this.allCountry = resp[0].result.sort((ele1: Country, ele2: Country) => {
        return ele1.name.localeCompare(ele2.name);
      });
      this.currentUser = resp[1].result;

      this.userForm = this._formbuilder.group({
        user_id: this.currentUser.user_id,
        name: this.currentUser.name || null,
        email: { value: this.currentUser.email || null, disabled: true },
        phone: this.currentUser.phone || null,
        occupation: this.currentUser.occupation || null,
        gender: this.currentUser.gender || null,
        dob: this.currentUser.dob || null,
        country: this.currentUser.country || null,
        state: { value: this.currentUser.state || null, disabled: true },
        city: { value: this.currentUser.city || null, disabled: true },
        about: this.currentUser.about || null,
      });

      this.userForm
        .get('country')
        ?.valueChanges.subscribe((country: Country) => {
          this.thirdPartyService
            .getState(country.iso2)
            .pipe(
              finalize(() => {
                this.userForm.get('state')?.setValue(null);
                this.userForm.get('state')?.enable();
                this.userForm.get('city')?.setValue(null);
                this.userForm.get('city')?.disable();
              })
            )
            .subscribe((state) => {
              this.allState = state.result.sort((ele1: State, ele2: State) => {
                return ele1.name.localeCompare(ele2.name);
              });
            });
        });

      this.userForm.get('state')?.valueChanges.subscribe((state: State) => {
        if (state != null) {
          this.thirdPartyService
            .getCity(this.userForm.get('country')?.value.iso2, state.iso2)
            .pipe(
              finalize(() => {
                this.userForm.get('city')?.setValue(null);
                this.userForm.get('city')?.enable();
              })
            )
            .subscribe((city) => {
              this.allCity = city.result.sort((ele1: City, ele2: City) => {
                return ele1.name.localeCompare(ele2.name);
              });
            });
        }
      });
    });
  }

  userFormSubmit() {
    this.authService
      .updateUser(this.userForm.value)
      .pipe(
        catchError((err) => {
          this.confirmationService.open({
            title: 'ERROR!',
            message: 'something went wrong!',
            icon: {
              color: 'warn',
              name: 'error',
              show: true,
            },
            actions: {
              confirm: {
                show: true,
                color: 'primary',
                label: 'Ok!',
              },
              cancel: { show: false },
            },
          });
          throw new Error(err);
        })
      )
      .subscribe((res: any) => {
        if (res.success) {
          this.confirmationService.open({
            title: 'Success!',
            message: 'User have been updated!',
            icon: {
              color: 'success',
              name: 'thumb_up',
              show: true,
            },
            actions: {
              confirm: {
                show: true,
                color: 'primary',
                label: 'Ok!',
              },
              cancel: { show: false },
            },
          });
        }
      });
  }
}
