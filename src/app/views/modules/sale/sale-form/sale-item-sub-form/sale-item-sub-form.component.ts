import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {AbstractSubFormComponent} from '../../../../../shared/ui-components/abstract-sub-form/abstract-sub-form.component';
import {Saleitem} from '../../../../../entities/saleitem';
import {Inventory} from '../../../../../entities/inventory';
import {Item} from '../../../../../entities/item';
import {Branch} from '../../../../../entities/branch';
import {stringify} from '@angular/compiler/src/util';

@Component({
  selector: 'app-sale-item-sub-form',
  templateUrl: './sale-item-sub-form.component.html',
  styleUrls: ['./sale-item-sub-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SaleItemSubFormComponent),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SaleItemSubFormComponent),
      multi: true,
    }
  ]
})
export class SaleItemSubFormComponent extends AbstractSubFormComponent <Saleitem> {


  @Input()
  inventories: Inventory[] = [];

  @Input()
  items: Item[] = [];

  @Input()
  units: Item[] = [];

  @Input()
  selectedItems: Item[] = [];

  @Input()
  inventory: Inventory[] = [];


  constructor(protected dialog: MatDialog) {
    super();
  }

  // Form related variables and functions

  fieldValidations = {
    qty: [],
    item: [],
    inventory: [],
    unitprice: [],
  };

  form = new FormGroup({
    id: new FormControl(null),
    qty: new FormControl('', this.fieldValidations.qty),
    item: new FormControl('', this.fieldValidations.item),
   // inventory: new FormControl('', this.fieldValidations.inventory),
    unitprice: new FormControl('', this.fieldValidations.unitprice),
  });

  get idField(): FormControl{
    return this.form.controls.id as FormControl;
  }
  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }

  get inventoryField(): FormControl{
    return this.form.controls.item as FormControl;
  }
 /* get inventoryinventoryField(): FormControl{
    return this.form.controls.inventory as FormControl;
  }*/
  get unitpriceField(): FormControl{
    return this.form.controls.unitprice as FormControl;
  }

  get isFormEmpty(): boolean{
    return this.isEmptyField(this.idField)
      &&   this.isEmptyField(this.qtyField)
      &&   this.isEmptyField(this.inventoryField);

  }

  setValidations(): void{
    this.fieldValidations.qty = [ Validators.required ];
    this.fieldValidations.item = [ Validators.required ];
   // this.fieldValidations.inventory = [ Validators.required ];
    this.fieldValidations.unitprice = [ Validators.required ];
  }

  removeValidations(): void{
    this.fieldValidations.qty = [];
    this.fieldValidations.item = [];
    // this.fieldValidations.inventory = [];
    this.fieldValidations.unitprice = [];

  }

  fillForm(dataItem: Saleitem): void {
    this.idField.patchValue(dataItem.id);
    this.qtyField.patchValue(dataItem.qty);
    this.inventoryField.patchValue(dataItem.item);
    this.unitpriceField.patchValue(dataItem.unitprice);
   // this.inventoryinventoryField.patchValue(splitted);



    for (const item of this.items){
      if (JSON.stringify(dataItem.item) === JSON.stringify(item)){
        this.inventoryField.patchValue(item);

      }
    }
      }
 /* setItem(): void{
    for (const inventory of this.inventories){
      if (JSON.stringify(inventory.item) === JSON.stringify(this.items)){
         console.log(this.items); }
    }
  }*/

  resetForm(): void{
    this.form.reset();
    this.removeValidations();
  }



  // Operations related functions


  getDeleteConfirmMessage(dataItem: Saleitem): string {
    return `Are you sure to remove \u201C ${dataItem.qty} \u201D from allowance list ?`;
  }

  getUpdateConfirmMessage(dataItem: Saleitem): string {
    if (this.isFormEmpty){
      return `Are you sure to update \u201C\u00A0${dataItem.qty}\u00A0\u201D\u00A0?`;
    }

    return `Are you sure to update \u201C\u00A0${dataItem.qty}\u00A0\u201D and discard existing form data\u00A0?`;
  }

  addData(): void{
    if (this.form.invalid) { return; }

    const dataItem: Saleitem = new Saleitem();
    dataItem.id = this.idField.value;
    dataItem.qty = this.qtyField.value;
    dataItem.item = this.inventoryField.value;
   // dataItem.inventory = this.inventoryinventoryField.value;
    dataItem.unitprice = this.unitpriceField.value;
   /* const splitted = stringify(this.inventoryField).split('.');
    this.inventory = JSON.stringify(splitted);
*/

    this.addToTop(dataItem);
    this.resetForm();
  }

  customValidations(): object {
    return null;
  }


    /*  setItem(): void{
        for (const inventory of this.inventories) {
          let items = Object.assign({}, inventory.item);
        }
        for (const inventory of this.inventories){
          if (JSON.stringify(dataItem.inventory) === JSON.stringify(inventory)){
            let items = Object.assign({}, inventory.item);
          }
        }
      }*/

    /* if (this.inventoryField ){
       this.inventoryField.patchValue(this.inventories);
     }*/

}
