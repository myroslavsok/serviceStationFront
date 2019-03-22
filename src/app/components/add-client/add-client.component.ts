import { crudDBService } from './../../shared/services/crudDB.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

// Imports for date
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
const moment = _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'uk-UR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})

export class AddClientComponent implements OnInit {

  constructor(private crudDBService: crudDBService,
              private snackBar: MatSnackBar) { }

  marqueControl = new FormControl();
  modelControl = new FormControl();

  filteredOptionsMarque: Observable<string[]>;
  filteredOptionsModel: Observable<string[]>;

  @ViewChild('carMarque') carMarque: ElementRef;
  @ViewChild('workCost') totalWorlCost: ElementRef;

  // Car's details
  carsDetails: Array<{
    id;
    name;
    cost;
  }> = [];

  totalDetailCost: number = 0;

  date = new FormControl(moment());

  ngOnInit() {
    this.crudDBService.getCarsArr(() => {
      this.filteredOptionsMarque = this.marqueControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterMarque(value))
        );
    });
  }

  private _filterMarque(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.filteredOptionsModel = this.modelControl.valueChanges
        .pipe(
          startWith(''),
          map(element => this._filterModel(element))
        );
    return this.crudDBService.cars
      .map(item => item.marque)
      .filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterModel(value: string): string[] {
    const filterValue = value.toLowerCase();
    const carMarque = this.carMarque.nativeElement.value;
    let carModelsArr = [];
    this.crudDBService.cars
      .forEach(item => {
        if (item.marque === carMarque) {
          carModelsArr = item.model;
        }
      });
    return carModelsArr
      .filter(option => option.toLowerCase().includes(filterValue));
  }

  // send(marque, model, carYear, vinCode, carNumber, clientName, clientPhoneNumber) {
  //   // working with cars
  //   if (!marque.value || !model.value) {
  //     return this.snackBar.open('Заповніть поля з маркою та моделлю авто', 'Зрозуміло', {
  //       duration: 2000,
  //     });
  //   }

  //   let isCarMarqueNew__key = '';
  //   let isCarModelNew = false;

  //   this.crudDBService.cars.forEach(item => {
  //     if (item.marque === marque.value) {
  //       isCarMarqueNew__key = item.key;
  //       item.model.forEach(elem => {
  //         if (elem === model.value) {
  //           isCarModelNew = true;
  //         }
  //       });
  //     }
  //   });
  //   if (isCarMarqueNew__key && isCarModelNew) {
  //     console.log('assign car to client');
  //   } else if (isCarMarqueNew__key && !isCarModelNew) {
  //     console.log('adding model to', isCarMarqueNew__key);
  //     let existingModels = [];
  //     this.crudDBService.cars
  //       .forEach(item => {
  //         if (item.key === isCarMarqueNew__key) {
  //           existingModels = item.model;
  //         }
  //       });
  //     existingModels.push(model.value);
  //     this.crudDBService.addModelToCar({
  //       key: isCarMarqueNew__key,
  //       model: existingModels
  //     });
  //   } else if (!isCarMarqueNew__key) {
  //     this.crudDBService.addCar({
  //       marque: marque.value,
  //       model: [model.value]
  //     });
  //   }
//
    // working with client
    // marque, model, carYear, vinCode, carNumber, clientName, clientPhoneNumber
  //   const client = {
  //     name: clientName.value,
  //     phone: clientPhoneNumber.value,
  //     car: {
  //       marque: marque.value,
  //       model: model.value,
  //       year: carYear.value,
  //       number: carNumber.value,
  //       vin: vinCode.value
  //     }
  //   }
  //   console.log('client', client);
  //   this.crudDBService.addClient(client);
  //   this.snackBar.open('Клієнт успішно доданий до бази', 'Зрозуміло', {
  //     duration: 2000,
  //   });
  // }

  addCarToDBIfNotExists(marque, model) {
    console.log('add car', `${marque}, ${model}`);
    if (!marque || !model) {
      return this.snackBar.open('Заповніть поля з маркою та моделлю авто', 'Зрозуміло', {
        duration: 2000,
      });
    }
    let isCarMarqueNew__key = '';
    let isCarModelNew = false;
    this.crudDBService.cars.forEach(item => {
      if (item.marque === marque) {
        isCarMarqueNew__key = item.key;
        item.model.forEach(elem => {
          if (elem === model) {
            isCarModelNew = true;
          }
        });
      }
    });
    if (isCarMarqueNew__key && isCarModelNew) {
      // console.log('assign car to client');
    } else if (isCarMarqueNew__key && !isCarModelNew) {
      // console.log('adding model to', isCarMarqueNew__key);
      let existingModels = [];
      this.crudDBService.cars
        .forEach(item => {
          if (item.key === isCarMarqueNew__key) {
            existingModels = item.model;
          }
        });
      existingModels.push(model);
      this.crudDBService.addModelToCar({
        key: isCarMarqueNew__key,
        model: existingModels
      });
    } else if (!isCarMarqueNew__key) {
      this.crudDBService.addCar({
        marque: marque,
        model: [model]
      });
    }
  }

  addClient(addClientForm) {
    let client = {
      clientInfo: addClientForm.value.clientInfo,
      carInfo: addClientForm.value.carInfo,
      workInfo: addClientForm.value.workInfo
    }
    client.clientInfo.date = this.date.value;
    client.carInfo.marque = this.marqueControl.value;
    client.carInfo.model = this.modelControl.value;
    client.carInfo.detais = this.carsDetails;
    client.workInfo.detailCost = this.totalDetailCost;
    let workCost = this.totalWorlCost.nativeElement.value;
    if (!workCost) {
      workCost = 0;
    }
    client.workInfo.totalCost = +workCost + this.totalDetailCost;
    this.addCarToDBIfNotExists(client.carInfo.marque, client.carInfo.model);
    console.log('Client', client);
  }

  getCars() {
    console.log('crud cars', this.crudDBService.cars);
  }


  addNewDetail(detailName, detailCost) {
    if (!detailName.value) {
      return this.snackBar.open('Вкажіть назву деталі', 'Зрозуміло', {
        duration: 2000,
      });
    }
    this.carsDetails.push({
      id: this.carsDetails.length + 1,
      name: detailName.value,
      cost: detailCost.value
    });
    this.calculateTotalDetailCost();
  }

  deleteDetail(carDetailId) {
    this.carsDetails = this.carsDetails.filter(detail => {
      return (detail.id === carDetailId) ? false : true;
    });
    this.calculateTotalDetailCost();
  }

  calculateTotalDetailCost() {
    let detailCost = 0;
    this.carsDetails.forEach(detail => {
      detailCost += parseInt(detail.cost);
    });
    this.totalDetailCost = detailCost;
  }


}
