import { crudDBService } from './../../shared/services/crudDB.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

// Imports for date
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
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

  makeControl = new FormControl();
  modelControl = new FormControl();

  @ViewChild('carmake') carmake: ElementRef;
  @ViewChild('detailName') detailName: ElementRef;
  @ViewChild('detailCost') detailCost: ElementRef;
  @ViewChild('orderDate') orderDate: ElementRef;


  // Car's details
  carsDetails: Array<{
    id;
    name;
    cost;
  }> = [];

  totalDetailCost: number = 0;

  date = new FormControl(moment());

  ngOnInit() {
    // this.crudDBService.getCarsArr(() => {
    //   this.filteredOptionsmake = this.makeControl.valueChanges
    //     .pipe(
    //       startWith(''),
    //       map(value => this._filtermake(value))
    //     );
    // });
  }

  // private _filtermake(value: string): string[] {
    // const filterValue = value.toLowerCase();
    // this.filteredOptionsModel = this.modelControl.valueChanges
    //     .pipe(
    //       startWith(''),
    //       map(element => this._filterModel(element))
    //     );
    // return this.crudDBService.cars
    //   .map(item => item.make)
    //   .filter(option => option.toLowerCase().includes(filterValue));
  // }

  private _filterModel(value: string): string[] {
    const filterValue = value.toLowerCase();
    const carmake = this.carmake.nativeElement.value;
    let carModelsArr = [];
    // this.crudDBService.cars
    //   .forEach(item => {
    //     if (item.make === carmake) {
    //       carModelsArr = item.model;
    //     }
    //   });
    return carModelsArr
      .filter(option => option.toLowerCase().includes(filterValue));
  }

  addCarToDBIfNotExists(make, model) {
    if (!make || !model) {
      // return this.snackBar.open('Заповніть поля з маркою та моделлю авто', 'Зрозуміло', {
      //   duration: 2000,
      // });
      return;
    }
    let isCarmakeNew__key = '';
    let isCarModelNew = false;
    // this.crudDBService.cars.forEach(item => {
    //   if (item.make === make) {
    //     isCarmakeNew__key = item.key;
    //     item.model.forEach(elem => {
    //       if (elem === model) {
    //         isCarModelNew = true;
    //       }
    //     });
    //   }
    // });
    if (isCarmakeNew__key && isCarModelNew) {
      // console.log('assign car to client');
    } else if (isCarmakeNew__key && !isCarModelNew) {
      // console.log('adding model to', isCarmakeNew__key);
      let existingModels = [];
      // this.crudDBService.cars
      //   .forEach(item => {
      //     if (item.key === isCarmakeNew__key) {
      //       existingModels = item.model;
      //     }
      //   });
      existingModels.push(model);
      // this.crudDBService.addModelToCar({
      //   key: isCarmakeNew__key,
      //   model: existingModels
      // });
    } else if (!isCarmakeNew__key) {
      // this.crudDBService.addCar({
      //   make: make,
      //   model: [model]
      // });
    }
  }

  createClient(form) {
    let client = {
      clientInfo: form.value.clientInfo,
      carInfo: form.value.carInfo,
      workInfo: form.value.workInfo
    }
    client.clientInfo.date = this.orderDate.nativeElement.value;
    client.carInfo.make = this.makeControl.value;
    client.carInfo.model = this.modelControl.value;
    client.carInfo.details = this.carsDetails;
    client.workInfo.detailCost = this.totalDetailCost;
    if (!client.workInfo.workCost) {
      client.workInfo.workCost = 0;
    }
    client.workInfo.totalCost = +client.workInfo.workCost + +client.workInfo.detailCost;
    return client;
  }

  addClient(addClientForm) {
    if (!addClientForm.valid) {
      return this.snackBar.open(`Поле "Vin-код" є обов'язковим`, 'Ок', {
        duration: 2000,
      }); 
    }
    let client = this.createClient(addClientForm);
    this.addCarToDBIfNotExists(client.carInfo.make, client.carInfo.model);
    client = this.setDefaultValuesForEmptyFormFields(client);
    this.clearFormAndFiledValues(addClientForm);
    console.log('Client', client);
    try {
      // this.crudDBService.addClient(client);
      this.snackBar.open('Клієнт успішно доданий до бази', 'Ок', {
        duration: 2000,
      }); 
    } catch (error) {
      console.log(error)
      return alert('Помилка при спробі додати інформацію про замовлення клієнта: ' + error + ' Спробуйте заповнити усі поля');
    }
  }

  addNewDetail(detailName, detailCost) {
    if (!detailName.value || !detailCost.value) {
      return this.snackBar.open('Вкажіть назву та ціну деталі', 'Зрозуміло', {
        duration: 2000,
      });
    }
    this.carsDetails.push({
      id: this.carsDetails.length + 1,
      name: detailName.value,
      cost: detailCost.value
    });
    this.calculateTotalDetailCost();
    this.detailName.nativeElement.value = '';
    this.detailCost.nativeElement.value = '';
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

  // New

  createOrder(form) {
    let order = {
      clientInfo: form.value.clientInfo,
      carInfo: form.value.carInfo,
      workInfo: form.value.workInfo,
      date: this.orderDate.nativeElement.value,
    }
    order.carInfo.make = this.makeControl.value;
    order.carInfo.model = this.modelControl.value;
    order.carInfo.details = this.carsDetails;
    order.workInfo.detailCost = this.totalDetailCost;
    if (!order.workInfo.workCost) {
      order.workInfo.workCost = 0;
    }
    order.workInfo.totalCost = +order.workInfo.workCost + +order.workInfo.detailCost;
    return order;
  }

  setDefaultValuesForEmptyFormFields(client) {
    for (let categoryKey in client) {
      for (let key in client[categoryKey]) {
        if (key != 'workCost' && key != 'detailCost' && key != 'totalCost' && key != 'details') {
          if(!client[categoryKey][key]) {
            client[categoryKey][key] = 'Не вказано';
          }
        }
      }
    }
    return client;
  }

  clearFormAndFiledValues(form) {
    form.reset();
    this.makeControl.setValue('');
    this.modelControl.setValue('');
    this.detailName.nativeElement.value = '';
    this.detailCost.nativeElement.value = '';
    this.carsDetails = [];
    this.totalDetailCost = 0;
  }

  addOrder(addClientForm) {
    if (!addClientForm.valid) {
      return this.snackBar.open(`Поле "Vin-код" є обов'язковим`, 'Ок', {
        duration: 2000,
      }); 
    }
    let order = this.createOrder(addClientForm);
    // this.addCarToDBIfNotExists(client.carInfo.make, client.carInfo.model);
    order = this.setDefaultValuesForEmptyFormFields(order);
    this.clearFormAndFiledValues(addClientForm);
    console.log('Order', order);
    try {
      // console.log('order.clientInfo', order.clientInfo);
      // this.crudDBService.addClient(order.clientInfo)
      //   .subscribe(resp => console.log(resp));
      this.crudDBService.addOrder(order)
        .subscribe(resp => console.log('post order resp', resp));
      this.snackBar.open('Клієнт успішно доданий до бази', 'Ок', {
        duration: 2000,
      }); 
    } catch (error) {
      console.log(error)
      return alert('Помилка при спробі додати інформацію про замовлення клієнта: ' + error + ' Спробуйте заповнити усі поля');
    }
  }


}
