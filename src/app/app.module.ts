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
import { WeatherService } from './services/weather.service';
import { StockService } from './services/stock.service';
import { QuranComponent } from './routes/modules/quran/quran.component';
import { QuranService } from './services/quran.service';
import { ChapterComponent } from './routes/modules/quran/chapter/chapter.component';
import { PermissionComponent } from './routes/modules/permission/permission.component';
import { MenuService } from './services/menu.service';
import { TranslateComponent } from './routes/modules/quran/translate/translate.component';
import { MyInvestmentComponent } from './routes/modules/my-investment/my-investment.component';
import { WebScrapingComponent } from './routes/modules/web-scraping/web-scraping.component';
import { WebScrapingService } from './services/web-scarping.service';
import { TrainComponent } from './routes/modules/train/train.component';
import { TrainService } from './services/train.service';
import { CoachComponent } from './routes/modules/train/chart/coach/coach.component';
import { ChartComponent } from './routes/modules/train/chart/chart.component';
import { AvailabilityComponent } from './routes/modules/train/availability/availability.component';
import { DurationPipe } from './pipes/duration.pipe';
import { PNRComponent } from './routes/modules/train/pnr/pnr.component';
import { RunningStatusComponent } from './routes/modules/train/running-status/running-status.component';
import { ScheduleDialogComponent } from './routes/modules/train/availability/schedule/schedule-dialog.component';
import { SeatMapComponent } from './routes/modules/train/chart/seat-map/seat-map.component';
import { StockComponent } from './routes/modules/stock/stock.component';
import { SearchListComponent } from './routes/modules/stock/search-list/search-list.component';
import { FundDetailsComponent } from './routes/modules/stock/fund-details/fund-details.component';
import { InvestmentService } from './services/investment.service';
import { AddInvestment } from './routes/modules/my-investment/add-investment/add-investment';
import { CricketService } from './services/cricket.service';
import { AllInvestment } from './routes/modules/my-investment/all-investment/all-investment';

@NgModule({
  declarations: [
    DurationPipe,
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
    QuranComponent,
    ChapterComponent,
    PermissionComponent,
    TranslateComponent,
    MyInvestmentComponent,
    WebScrapingComponent,
    TrainComponent,
    ChartComponent,
    CoachComponent,
    AvailabilityComponent,
    PNRComponent,
    RunningStatusComponent,
    ScheduleDialogComponent,
    SeatMapComponent,
    StockComponent,
    SearchListComponent,
    FundDetailsComponent,
    AddInvestment,
    AllInvestment,
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
    WeatherService,
    StockService,
    QuranService,
    MenuService,
    WebScrapingService,
    TrainService,
    InvestmentService,
    CricketService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ReviewsComponent,
    TranslateComponent,
    ScheduleDialogComponent,
    SeatMapComponent,
    AddInvestment,
    AllInvestment,
  ],
})
export class AppModule {}
