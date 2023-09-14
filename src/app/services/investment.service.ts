import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class InvestmentService {
  constructor(private http: HttpClient) {}

  public getAllInvestment(schema_id?: string): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'investment' + (schema_id ? '/' + schema_id : '')
    );
  }

  public createNewInvestment(createInvestment: any): Observable<any> {
    return this.http.post(
      environment.api_prefix + 'investment/create-investment',
      {
        schema_code: createInvestment.schema_code,
        type: createInvestment.type,
        date: createInvestment.date,
        amount: createInvestment.amount,
      }
    );
  }

  public addInvestment(addInvestment: any): Observable<any> {
    return this.http.post(
      environment.api_prefix + 'investment/add-investment',
      {
        schema_code: addInvestment.schema_code,
        date: addInvestment.date,
        amount: addInvestment.amount,
      }
    );
  }

  public deleteAllInvestment(id: string): Observable<any> {
    return this.http.delete(
      environment.api_prefix + 'investment/delete-all-investment/' + id
    );
  }

  public deleteInvestment(id: string): Observable<any> {
    return this.http.delete(
      environment.api_prefix + 'investment/delete-investment/' + id
    );
  }

  public updateInvestment(editInvestment: any): Observable<any> {
    return this.http.post(
      environment.api_prefix + 'investment/edit-investment',
      {
        id: editInvestment.id,
        schema_code: editInvestment.schema_code,
        amount: editInvestment.amount,
        date: editInvestment.date,
      }
    );
  }
}
