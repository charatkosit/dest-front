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
