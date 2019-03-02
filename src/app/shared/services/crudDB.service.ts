import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Injectable } from '@angular/core';

//Models
import { Car } from '../models/car';
import { CarNgListElem } from '../models/carNgListElem';

@Injectable()
export class crudDBService {

  private dbPathCars = '/cars';

  carsList: AngularFireList<any> = null;
  cars: Array<Car> = null;

  constructor(private firebase: AngularFireDatabase) {
              this.carsList = this.firebase.list(this.dbPathCars);
  }

  // CRUD with cars
  addCar(car: CarNgListElem): void {
    console.log('[Service] car add', car);
    this.carsList.push(car).catch(error => this.handleError(error));
  }

  addModelToCar(car: {key: string, model: Array<string>}): void {
    console.log('[Service] uppdating models', car);
    this.carsList.update(car.key, {
      model: car.model
    }).catch(error => this.handleError(error));
  }

  getCarsArr(callback) {
  //   // Use snapshotChanges().map() to store the key
  //   // this.crudDBService.getCarsList().snapshotChanges().pipe(
  //   //   map(changes =>
  //   //     changes.map(item => ({ key: item.payload.key, ...item.payload.val() }))
  //   //   )
  //   // ).subscribe(cars => {
  //   //   this.cars = cars;
  //   // });
    this.carsList.snapshotChanges().subscribe(
      list => {
        this.cars = list.map(item => {
          return {
            key: item.key,
            ...item.payload.val()
          };
        });
        callback();
      }
    );
  }

  clearCarList(): void {
    this.carsList.remove().catch(error => this.handleError(error));
  }


  // CRUD with clients


  private handleError(error) {
    console.log(error);
  }

}