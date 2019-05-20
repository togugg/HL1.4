import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  apiServer: string = "http://195.128.101.122:8080"

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

  getShipments(): Observable<any> {
    return this.http.get(this.apiServer + '/shipments/', { headers: { 'accept': 'text' }, withCredentials: true })
  }

  createShipment(data): Observable<any> {
    return this.http.post(this.apiServer + '/shipments/', data, { withCredentials: true })
  }

  getForecast(id): Observable<any> {
    return this.http.get(this.apiServer + '/forecasts/' + id, { headers: { 'accept': 'text' }, withCredentials: true })
  }

  getMaterialIds(supplierId): Observable<any> {
    return this.http.get(this.apiServer + '/stocks/materials/' + supplierId, { headers: { 'accept': 'text' }, withCredentials: true })
  }

  sendShipment(data): Observable<any> {
    return this.http.put(this.apiServer + '/sendShipment/', data, { withCredentials: true })
  }

  receiveShipment(data): Observable<any> {
    return this.http.put(this.apiServer + '/receiveShipment/', data, { withCredentials: true })
  }

  getInvoice(id, collection): Observable<any> {
    return this.http.get(this.apiServer + '/invoices/' + id + '?collection=' + collection, { headers: { 'accept': 'text' }, withCredentials: true })
  }

  getCreditNote(id, collection): Observable<any> {
    return this.http.get(this.apiServer + '/creditNotes/' + id + '?collection=' + collection, { headers: { 'accept': 'text' }, withCredentials: true })
  }

  createStock(data): Observable<any> {
    return this.http.post(this.apiServer + '/stocks/', data, { withCredentials: true })
  }

  updateStock(data): Observable<any> {
    return this.http.put(this.apiServer + '/stocks/', data, { withCredentials: true })
  }

  adjustLimits(data): Observable<any> {
    return this.http.put(this.apiServer + '/adjustLimits/', data, { withCredentials: true })
  }

  withdrawStock(data): Observable<any> {
    return this.http.put(this.apiServer + '/withdrawStock/', data, { withCredentials: true })
  }

  createCreditNote(data): Observable<any> {
    return this.http.put(this.apiServer + '/createCreditNote/', data, { withCredentials: true })
  }

  approveForecast(data): Observable<any> {
    return this.http.put(this.apiServer + '/approveMonthlyForecast/', data, { withCredentials: true })
  }

  declineForecast(data): Observable<any> {
    return this.http.put(this.apiServer + '/declineMonthlyForecast/', data, { withCredentials: true })
  }

  addForecast(data): Observable<any> {
    return this.http.put(this.apiServer + '/addMonthlyForecast/', data, { withCredentials: true })
  }

}
