import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  apiServer: string = "http://localhost:8080"

  constructor(
    private http: HttpClient
  ) { }

  signIn(user): Observable<any> {
    return this.http.get(this.apiServer + '/signin', { params: { userName: user }, withCredentials: true })
  }


  signOut(): Observable<any> {
    return this.http.get(this.apiServer + '/signout', { withCredentials: true })
  }

  getStockHistory(id): Observable<any> {
    return this.http.get(this.apiServer + '/stocks/history/' + id, { headers: { 'accept': 'text' }, withCredentials: true })
  }

  getAssetsByQuery(queryString): Observable<any> {
    return this.http.get(this.apiServer + '/assets/byquery/' + queryString, { headers: { 'accept': 'text' }, withCredentials: true })
  }

  getShippings(): Observable<any> {
    return this.http.get(this.apiServer + '/shippings/', { headers: { 'accept': 'text' }, withCredentials: true })
  }

  createShipping(data): Observable<any> {
    return this.http.post(this.apiServer + '/shippings/', data, { withCredentials: true })
  }

  getForecast(id): Observable<any> {
    return this.http.get(this.apiServer + '/forecasts/' + id, { headers: { 'accept': 'text' }, withCredentials: true })
  }

  getMaterialIds(supplierId): Observable<any> {
    return this.http.get(this.apiServer + '/stocks/materials/' + supplierId, { headers: { 'accept': 'text' }, withCredentials: true })
  }

}
