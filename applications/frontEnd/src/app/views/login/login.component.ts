import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {

  constructor(
    private httpService: HttpService,
    private router: Router) { }

  ngOnInit() {
  }

  loginForm = new FormGroup({
    name: new FormControl('User1@org1.example.com'),
    password: new FormControl('xyz1234'),
  });

  submitLogin() {
    this.httpService.signIn(this.loginForm.value.name).subscribe(() => {this.router.navigate(['/'])},console.log)
  }

}
