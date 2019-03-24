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

  marqueControl = new FormControl();
  modelControl = new FormControl();

  filteredOptionsMarque: Observable<string[]>;
  filteredOptionsModel: Observable<string[]>;

  @ViewChild('carMarque') carMarque: ElementRef;
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

  addCarToDBIfNotExists(marque, model) {
    if (!marque || !model) {
      // return this.snackBar.open('Заповніть поля з маркою та моделлю авто', 'Зрозуміло', {
      //   duration: 2000,
      // });
      return;
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

  clearFormAndFiledValues(form) {
    form.reset();
    this.marqueControl.setValue('');
    this.modelControl.setValue('');
    this.detailName.nativeElement.value = '';
    this.detailCost.nativeElement.value = '';
    this.carsDetails = [];
    this.totalDetailCost = 0;
  }

  createClient(form) {
    let client = {
      clientInfo: form.value.clientInfo,
      carInfo: form.value.carInfo,
      workInfo: form.value.workInfo
    }
    client.clientInfo.date = this.orderDate.nativeElement.value;
    client.carInfo.marque = this.marqueControl.value;
    client.carInfo.model = this.modelControl.value;
    client.carInfo.details = this.carsDetails;
    client.workInfo.detailCost = this.totalDetailCost;
    if (!client.workInfo.workCost) {
      client.workInfo.workCost = 0;
    }
    client.workInfo.totalCost = +client.workInfo.workCost + +client.workInfo.detailCost;
    return client;
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
    console.log('Set defaults client', client);
    return client;
  }

  addClient(addClientForm) {
    if (!addClientForm.valid) {
      return this.snackBar.open(`Поле "Vin-код" є обов'язковим`, 'Ок', {
        duration: 2000,
      }); 
    }
    let client = this.createClient(addClientForm);
    this.addCarToDBIfNotExists(client.carInfo.marque, client.carInfo.model);
    client = this.setDefaultValuesForEmptyFormFields(client);
    this.clearFormAndFiledValues(addClientForm);
    console.log('Client', client);
    try {
      this.crudDBService.addClient(client);
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


}
