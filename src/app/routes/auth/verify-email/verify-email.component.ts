import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  templateUrl: 'verify-email.component.html',
  standalone: false,
})
export class VerifyEmailComponent implements OnInit {
  state: 'loading' | 'success' | 'error' = 'loading';

  constructor(private route: ActivatedRoute, private authService: AuthService) {
    this.route.queryParamMap.subscribe((params) => {
      console.log(params.get('token'));
      this.authService
        .verfiyEmail(params.get('token'))
        .pipe(
          catchError((err) => {
            this.state = 'error';
            console.error(err);
            throw err;
          })
        )
        .subscribe((resp) => {
          if (resp.success) {
            this.state = 'success';
          } else {
            this.state = 'error';
          }
        });
    });
  }

  ngOnInit() {}
}
