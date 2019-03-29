import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { crudDBService } from './../../shared/services/crudDB.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private crudDBService: crudDBService,
    private router: Router) { }

  ngOnInit() {
  }

  // login(loginName, loginPass) {
  //   console.log('name', loginName.value);
  //   console.log('pass', loginPass.value);
    // let credentials = {
    //   userName: loginName.value,
    //   password: loginPass.value
    // }
  //   // this.crudDBService
  //   //   .authenticate(credentials)
  //   //   .subscribe(resp => {
  //   //     console.log('key', resp.headers.keys);
  //   //   });
  //   this.crudDBService
  //     .login(loginName, loginPass)
  //     .subscribe(resp => console.log(resp));
  // }


  login(loginName, loginPass) {
    let credentials = {
      userName: loginName.value,
      password: loginPass.value
    }
    // fetch(`http://localhost:8080/login`, {
    //   method: "POST",
    //   body: JSON.stringify(credentials)
    // })
    // // .then(res => res.json())
    // .then(data => {
    //   console.log(JSON.stringify(data))
    //   console.dir(data.headers);
    // });
    console.log(this.crudDBService
      .login(credentials).subscribe());
    }

}
