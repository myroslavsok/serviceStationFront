import { crudDBService } from './../../shared/services/crudDB.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})

export class AddClientComponent implements OnInit {

  constructor(private crudDBService: crudDBService,
              private snackBar: MatSnackBar) { }

  marqueControl = new FormControl();
  modelControl = new FormControl();

  filteredOptionsMarque: Observable<string[]>;
  filteredOptionsModel: Observable<string[]>;

  @ViewChild('carMarque') carMarque: ElementRef;

  ngOnInit() {
    this.crudDBService.getCarsArr(() => {
      this.filteredOptionsMarque = this.marqueControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterMarque(value))
        );
      this.filteredOptionsModel = this.modelControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterModel(value))
        );
    });
  }

  private _filterMarque(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.crudDBService.cars
      .map(item => item.marque)
      .filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterModel(value: string): string[] {
      console.log('works');
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

  send(marque, model) {
    if (!marque.value || !model.value) {
      return this.snackBar.open('Заповніть поля з маркою та моделлю авто', 'Зрозуміло', {
        duration: 2000,
      });
    }

    let isCarMarqueNew__key = '';
    let isCarModelNew = false;

    this.crudDBService.cars.forEach(item => {
      if (item.marque === marque.value) {
        isCarMarqueNew__key = item.key;
        item.model.forEach(elem => {
          if (elem === model.value) {
            isCarModelNew = true;
          }
        });
      }
    });
    if (isCarMarqueNew__key && isCarModelNew) {
      console.log('assign car to client');
    } else if (isCarMarqueNew__key && !isCarModelNew) {
      console.log('adding model to', isCarMarqueNew__key);
      let existingModels = [];
      this.crudDBService.cars
        .forEach(item => {
          if (item.key === isCarMarqueNew__key) {
            existingModels = item.model;
          }
        });
      existingModels.push(model.value);
      this.crudDBService.addModelToCar({
        key: isCarMarqueNew__key,
        model: existingModels
      });
    } else if (!isCarMarqueNew__key) {
      this.crudDBService.addCar({
        marque: marque.value,
        model: [model.value]
      });
    }
  }


  getCars() {
    console.log('crud cars', this.crudDBService.cars);
    console.log('crud angular cars', this.crudDBService.carsList);
  }




}
