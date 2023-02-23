import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { SignUpComponent } from './routes/auth/signup/signup.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfirmationModule } from './common/confirmation/confirmation.module';
import { ConfirmationService } from './common/confirmation/confirmation.service';
import { SignInComponent } from './routes/auth/signin/signin.component';
import { DashboardComponent } from './routes/modules/dashboard/dashboard.component';
import { LayoutComponent } from './common/layout/layout.component';
import { MenuComponent } from './common/menu/menu.component';
import { TaskComponent } from './routes/modules/task/task.component';
import { AuthGaurd } from './auth.guard';
import { RequestInterceptor } from './services/request.interceptor';
import { TaskService } from './services/task.service';
import { ResetPasswordComponent } from './routes/auth/reset-password/reset-password.component';
import { LoadingBarModule } from './common/loading-bar/loading-bar.module';
import { LoadingBarService } from './common/loading-bar/loading-bar.service';
import { ProfileComponent } from './routes/profile/profile.component';
import { AuthService } from './services/auth.service';
import { ThirdPartyService } from './services/third-party.service';
import { IMDbComponent } from './routes/modules/imdb/imdb.component';
import { IMDbService } from './services/imdb.service';
import { MovieComponent } from './routes/modules/imdb/movie/movie.component';
import { TvComponent } from './routes/modules/imdb/tv/tv.component';
import { SearchResultsComponent } from './routes/modules/imdb/search-results/search-results.component';
import { ReviewsComponent } from './routes/modules/imdb/reviews/reviews.component';
import { CastCrewComponent } from './routes/modules/imdb/cast-crew/cast-crew.component';
import { PersonComponent } from './routes/modules/imdb/person/person.component';
import { ListComponent } from './routes/modules/task/list/list.component';
import { DetailComponent } from './routes/modules/task/detail/detail.component';
import { MobileComponent } from './routes/modules/mobile/mobile.component';
import { MobileService } from './services/mobile.service';
import { BrandsComponent } from './routes/modules/mobile/brands/brands.component';
import { MobileDetailComponent } from './routes/modules/mobile/detail/detail.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    MenuComponent,
    SignUpComponent,
    SignInComponent,
    ResetPasswordComponent,
    DashboardComponent,
    TaskComponent,
    ProfileComponent,
    IMDbComponent,
    MovieComponent,
    TvComponent,
    SearchResultsComponent,
    ReviewsComponent,
    CastCrewComponent,
    PersonComponent,
    ListComponent,
    DetailComponent,
    MobileComponent,
    BrandsComponent,
    MobileDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ConfirmationModule,
    LoadingBarModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    AuthGaurd,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
    ConfirmationService,
    LoadingBarService,
    TaskService,
    ThirdPartyService,
    IMDbService,
    MobileService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [ReviewsComponent],
})
export class AppModule {}
