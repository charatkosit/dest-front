import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AutoReadIDCard } from '../interfaces/IDCardData';
@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  private apiUrl = '/api/visitors/'

  constructor(private http: HttpClient) { }

  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
  }

  getCount(): Observable<any> {
    return this.http.get<any>('/api/visitors/count')
  }

  checkout(token:string): Observable<any> {
    const headers = { 'Content-type': 'application/json' };
    const url = `/api/return-card/visitor`;
    const body = {token:token,
                  deviceNum:'900'
                 };
    
    return  this.http.post<any>(url,body, { headers: headers, responseType: 'text' as 'json' });
  }

  updateVisitor(token: string): Observable<any> {
    const headers = { 'Content-type': 'application/json' };
    const url = `/api/visitorCard/update/${token}`;
    const body = { occupied: false };
   
    return this.http.patch<any>(url, body, { 'headers': headers })
  }

  formatDateString(dateString: string): string {
    if (dateString.length !== 8) {
      throw new Error("Invalid date format");
    }

    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);

    return `${day}/${month}/${year}`;
  }
}
