import { Component, OnInit } from '@angular/core';

// import { crudDBService } from './services/crudDB.service';
import { crudDBService } from './shared/services/crudDB.service';
// import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(private crudDBService: crudDBService) { }

  cars: any;

  ngOnInit() {
    this.getCarsList();
    console.log('getting data', this.crudDBService.carsList);
  }

  getCarsList() {
    // Use snapshotChanges().map() to store the key
    // this.crudDBService.getCarsList().snapshotChanges().pipe(
    //   map(changes =>
    //     changes.map(item => ({ key: item.payload.key, ...item.payload.val() }))
    //   )
    // ).subscribe(cars => {
    //   this.cars = cars;
    // });

    this.crudDBService.getCarsList().snapshotChanges().subscribe(
      list => {
        this.cars = list.map(item => {
          return {
            key: item.key,
            ...item.payload.val()
          };
        });
      }
    );
  }

  addCar(name, year) {
    this.crudDBService.addCar({
      name: name.value,
      year: year.value
    });
    name.value = '';
    year.value = '';
  }

  getCars() {
    console.log('crud', this.cars);
  }

  deleteCars() {
    this.crudDBService.clearCarList();
  }


  //TEST



}
