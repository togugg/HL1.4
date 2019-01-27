/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable()
export class DataService<Type> {
    private resolveSuffix = '?resolve=true';
    private actionUrl: string;
    private headers: Headers;

    constructor(private http: Http) {
        this.actionUrl = 'http://localhost:3000/api/';
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }

    public getAll(ns: string): Observable<Type[]> {
        console.log('GetAll ' + ns + ' to ' + this.actionUrl + ns);
        return this.http.get(`${this.actionUrl}${ns}`).pipe(
            map(this.extractData),
            catchError(this.handleError)
        )
    }

    public getSingle(ns: string, id: string): Observable<Type> {
        console.log('GetSingle ' + ns);

        return this.http.get(this.actionUrl + ns + '/' + id + this.resolveSuffix).pipe(
            map(this.extractData),
            catchError(this.handleError)
        )
    }


    public add(ns: string, asset: Type) {
        console.log('Entered DataService add');
        console.log('Add ' + ns);
        console.log('asset', asset);
        return this.http.post(this.actionUrl + ns, asset).pipe(
            map(this.extractData),
            catchError(this.handleError))
    }


    public update(ns: string, id: string, itemToUpdate: Type): Observable<Type> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        console.log('Update ' + ns);
        console.log('what is the id?', id);
        console.log('what is the updated item?', itemToUpdate);
        console.log('what is the updated item?', JSON.stringify(itemToUpdate));
        return this.http.put(`${this.actionUrl}${ns}/${id}`, itemToUpdate, {headers: headers}).pipe(
            map(this.extractData),
            catchError(this.handleError)
        )
    }

    public delete(ns: string, id: string): Observable<Type> {
        console.log('Delete ' + ns);

        return this.http.delete(this.actionUrl + ns + '/' + id).pipe(
            map(this.extractData),
            catchError(this.handleError)
        )
    }


    /*     public delete(ns: string, id: string): Observable<Type> {
            console.log('Delete ' + ns);
    
            return this.http.delete(this.actionUrl + ns + '/' + id).pipe(
                map(this.extractData),
                catchError(this.handleError)
            )
        }
     */
    private handleError(error: any): Observable<string> {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return throwError(errMsg);
    }

    private extractData(res: Response): any {
        return res.json();
    }

}
