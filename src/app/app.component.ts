import { Component, OnInit } from '@angular/core';

// import { crudDBService } from './services/crudDB.service';
import { crudDBService } from './shared/services/crudDB.service';
// import { map } from 'rxjs/operators';

//models
// import { Car } from './shared/models/car';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(private crudDBService: crudDBService) { }

  // cars: Array<Car>;


  ngOnInit() {
    // this.getCarsList();

    //to delete
    // this.addCars();
  }


  // addCars(): void {
  //   this.crudDBService.addCar({
  //     marque: 'Acura',
  //     model: ['CL', 'EL', 'Integra', 'DX', 'NSX', 'RDX', 'RL', 'RSX', 'TL', 'TSX' ]
  //   });
  //   this.crudDBService.addCar({
  //     marque: 'Alfa Romeo',
  //     model: ['33', '75', '145', '146', '147', '155', '156', '159', '164', '166', 'Alfetta', 'Brera', 'GT', 'GTV', 'Giulietta', 'Spider']
  //   });
  // }

  // addCar(name, year) {
  //   this.crudDBService.addCar({
  //     name: name.value,
  //     year: year.value
  //   });
  //   name.value = '';
  //   year.value = '';
  // }

  // getCars() {
  //   console.log('crud', this.cars);
  // }

  // deleteCars() {
  //   this.crudDBService.clearCarList();
  // }


  //TEST



}


