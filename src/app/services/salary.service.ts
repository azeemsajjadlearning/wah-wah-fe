import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class SalaryService {
  constructor(private http: HttpClient) {}

  public getSalary(financialYear: string): Observable<any> {
    return this.http.get(environment.api_prefix + `salary/financial-year`, {
      params: { financialYear },
    });
  }

  public saveSalary(data: any): Observable<any> {
    return this.http.post(environment.api_prefix + 'salary', { data });
  }

  public deleteSalary(id: string): Observable<any> {
    return this.http.delete(
      environment.api_prefix + 'salary/delete-salary/' + id
    );
  }

  public getDeductions(year: string): Observable<any> {
    return this.http.get(environment.api_prefix + 'salary/deductions/' + year);
  }

  public saveDeductions(data: any): Observable<any> {
    return this.http.post(environment.api_prefix + 'salary/save-deductions', {
      data,
    });
  }
}
