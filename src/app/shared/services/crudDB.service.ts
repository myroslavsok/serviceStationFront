import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class crudDBService {

  carsList: AngularFireList<any> = null;

  private dbPath = '/cars';

  constructor(private firebase: AngularFireDatabase) {
    this.carsList = this.firebase.list(this.dbPath);
  }

  getCarsList(): AngularFireList<any> {
    return this.carsList;
  }

  addCar(car: any): void {
    this.carsList.push(car);
  }

  clearCarList(): void {
    this.carsList.remove().catch(error => this.handleError(error));
  }

  private handleError(error) {
    console.log(error);
  }

}
