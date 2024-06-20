import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfficerService {

  private apiUrl = '/api/officers'

  constructor(
    private http: HttpClient,
    private router: Router) { }

  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
  }

  getOfficerCount(): Observable<any> {
    return this.http.get<any>('/api/officers/count')
  }

 
  // update(id: number, data: any): Observable<any> {
  //   const url = `${this.apiUrl}/${id}`;
  //   return this.http.put(url, data);
  // }
  
  update(id: number, data: any): Observable<any> {
    const url = `${this.apiUrl}/editOfficer/${id}`;
    return this.http.patch(url, data);
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }


}
