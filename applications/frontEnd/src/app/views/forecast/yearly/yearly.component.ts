import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-yearly',
  templateUrl: './yearly.component.html',
  styleUrls: ['./yearly.component.scss']
})
export class YearlyComponent implements OnInit {

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.getForecast(id).then( () => {
        
      })
    })
  }

  getForecast(id) {
    return new Promise((resolve, reject) => {
      this.httpService.getForecast(id).subscribe((res) => {
        this.forecast = res;
        console.log(res);
        resolve(res);
      })
    })
  }

  forecast;



}
