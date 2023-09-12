import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { CreateInvestment } from '../models/investment';

@Injectable()
export class InvestmentService {
  constructor(private http: HttpClient) {}

  public getAllInvestment(schema_id?: string): Observable<any> {
    return this.http.get(
      environment.api_prefix + 'investment' + (schema_id ? '/' + schema_id : '')
    );
  }

  public createNewInvestment(
    createInvestment: CreateInvestment
  ): Observable<any> {
    return this.http.post(environment.api_prefix + 'investment', {
      schema_id: createInvestment.schema_id,
      type: createInvestment.type,
      date: createInvestment.date,
      amount: createInvestment.amount,
    });
  }
}
