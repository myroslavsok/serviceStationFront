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

  filteredMakes: Observable<string[]>;
  filteredModels: Observable<string[]>;

  carMakes = [];

  @ViewChild('carmake') carmake: ElementRef;
  @ViewChild('partName') partName: ElementRef;
  @ViewChild('partsCost') partsCost: ElementRef;
  @ViewChild('orderDate') orderDate: ElementRef;


  // Car's parts
  carsparts: Array<{
    id;
    name;
    cost;
  }> = [];

  totalpartsCost: number = 0;

  date = new FormControl(moment());

  ngOnInit() {
    this.crudDBService
      .getModelsAndMakes()
      .subscribe(respMakes => {
        console.log('resp models', respMakes);
        this.carMakes = respMakes;
        this.filteredMakes = this.makeControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterMake(value))
        );
      });    
  }

  private _filterMake(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.filteredModels = this.modelControl.valueChanges
        .pipe(
          startWith(''),
          map(element => this._filterModel(element))
        );
    return this.carMakes
      .map(make => make.makeName)
      .filter(makeName => makeName.toLowerCase().includes(filterValue));
  }

  private _filterModel(value: string): string[] {
    const filterValue = value.toLowerCase();
    const carmake = this.carmake.nativeElement.value;
    let carModels = [];
    this.carMakes.forEach(carMake => {
      if (carMake.makeName === carmake) {
        carModels = carMake.models;
      }
    });
    return carModels
      .map(carModels => carModels.modelName)
      .filter(carModelName => carModelName.toLowerCase().includes(filterValue));
  }

  // New
  addNewpart(partName, partsCost) {
    if (!partName.value || !partsCost.value) {
      return this.snackBar.open('Вкажіть назву та ціну деталі', 'Зрозуміло', {
        duration: 2000,
      });
    }
    this.carsparts.push({
      id: this.carsparts.length + 1,
      name: partName.value,
      cost: partsCost.value
    });
    console.log('parts = ', this.carsparts);
    this.calculateTotalpartsCost();
    this.partName.nativeElement.value = '';
    this.partsCost.nativeElement.value = '';
  }

  deletepart(carpartId) {
    this.carsparts = this.carsparts.filter(part => {
      return (part.id === carpartId) ? false : true;
    });
    this.calculateTotalpartsCost();
  }

  calculateTotalpartsCost() {
    let partsCost = 0;
    this.carsparts.forEach(part => {
      partsCost += parseInt(part.cost);
    });
    this.totalpartsCost = partsCost;
  }

  createOrder(form) {
    let order = {
      clientInfo: form.value.clientInfo,
      carInfo: form.value.carInfo,
      workInfo: form.value.workInfo,
      date: this.date.value._d.toISOString().substring(0,10)
    }
    order.carInfo.make = this.makeControl.value;
    order.carInfo.model = this.modelControl.value;
    order.carInfo.parts = this.carsparts;
    order.workInfo.partsCost = this.totalpartsCost;
    if (!order.workInfo.workCost) {
      order.workInfo.workCost = 0;
    }
    order.workInfo.totalCost = +order.workInfo.workCost + +order.workInfo.partsCost;
    return order;
  }

  setDefaultValuesForEmptyFormFields(client) {
    for (let categoryKey in client) {
      for (let key in client[categoryKey]) {
        if (key != 'workCost' && key != 'partsCost' && key != 'totalCost' && key != 'parts') {
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
    this.partName.nativeElement.value = '';
    this.partsCost.nativeElement.value = '';
    this.carsparts = [];
    this.totalpartsCost = 0;
  }

  addOrder(addClientForm) {
    if (!addClientForm.valid) {
      return this.snackBar.open(`Поле "Vin-код" є обов'язковим`, 'Ок', {
        duration: 2000,
      }); 
    }
    let order = this.createOrder(addClientForm);
    order = this.setDefaultValuesForEmptyFormFields(order);
    this.clearFormAndFiledValues(addClientForm);
    console.log('Order', order);
    try {
      this.crudDBService.addOrder(order)
        .subscribe(resp => console.log('post order resp', resp));
    } catch (error) {
      console.log(error)
      return alert('Помилка при спробі додати інформацію про замовлення клієнта: ' + error + ' Спробуйте заповнити усі поля');
    }
    this.snackBar.open('Клієнт успішно доданий до бази', 'Ок', {
      duration: 2000,
    }); 
  }


}
