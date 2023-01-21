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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ConfirmationModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    AuthGaurd,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
    ConfirmationService,
    TaskService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
