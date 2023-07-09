import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Supplier} from '../../../../entities/supplier';
import {ActivatedRoute, Router} from '@angular/router';
import {SupplierService} from '../../../../services/supplier.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../entities/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {SuppliertypeService} from '../../../../services/suppliertype.service';
import {Employee} from '../../../../entities/employee';
import {Civilstatus} from '../../../../entities/civilstatus';
import {Suppliertype} from '../../../../entities/suppliertype';
import {Designation} from '../../../../entities/designation';
import {Supplierstatus} from '../../../../entities/supplierstatus';
import {SupplierstatusService} from '../../../../services/supplierstatus.service';
import {Item} from '../../../../entities/item';
import {ItemService} from '../../../../services/item.service';
import {PageRequest} from '../../../../shared/page-request';
import {ItemDataPage} from '../../../../entities/item-data-page';
import {User, UserDataPage} from "../../../../entities/user";
import {NotificationService} from "../../../../services/notification.service";
import {UserService} from "../../../../services/user.service";
import {Notification} from "../../../../entities/notification";

@Component({
  selector: 'app-supplier-update-form',
  templateUrl: './supplier-update-form.component.html',
  styleUrls: ['./supplier-update-form.component.scss']
})
export class SupplierUpdateFormComponent extends AbstractComponent implements OnInit {
  selectedId: number;
  supplier: Supplier;


  suppliertypes: Suppliertype[] = [];
  supplierstatuses: Supplierstatus[] = [];
  items: Item[] = [];
  systemUsers: User[] = [];

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ]),
    contact1: new FormControl('', [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(10),
      Validators.pattern('^([0]?[0-9]{9})$'),
    ]),
    contact2: new FormControl('', [
      Validators.minLength(9),
      Validators.maxLength(10),
      Validators.pattern('^([0]?[0-9]{9})$'),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(255),
      Validators.email,
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(65535),
    ]),
    description: new FormControl('', [
      Validators.maxLength(65535),
    ]),
    fax: new FormControl('', [
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    suppliertype: new FormControl('', [
      Validators.required,
    ]),
    supplierstatus: new FormControl('', [
      Validators.required,
    ]),
    item: new FormControl(),
  });

  notificationForm = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ]),
    systemUser: new FormControl('', [
      Validators.required
    ]),
  });

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }

  get contact1Field(): FormControl{
    return this.form.controls.contact1 as FormControl;
  }

  get contact2Field(): FormControl{
    return this.form.controls.contact2 as FormControl;
  }

  get emailField(): FormControl{
    return this.form.controls.email as FormControl;
  }

  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  get faxField(): FormControl{
    return this.form.controls.fax as FormControl;
  }

  get suppliertypeField(): FormControl{
    return this.form.controls.suppliertype as FormControl;
  }
  get supplierstatusField(): FormControl{
    return this.form.controls.supplierstatus as FormControl;
  }
  get itemField(): FormControl{
    return this.form.controls.item as FormControl;
  }

  get messageField(): FormControl{
    return this.notificationForm.controls.message as FormControl;
  }

  get systemUserField(): FormControl{
    return this.notificationForm.controls.systemUser as FormControl;
  }

  constructor(
    private route: ActivatedRoute,
    private supplierService: SupplierService,
    private supplierstatusService: SupplierstatusService,
    private suppliertypeService: SuppliertypeService,
    private itemService: ItemService,
    private notificationService: NotificationService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');

      this.itemService.getAll(new PageRequest()).then((data: ItemDataPage) => {
        this.items = data.content;
      }).catch( e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.update){ return; }

    if (this.suppliertypeField.pristine) {
      this.suppliertypeService.getAll().then((data: Suppliertype[]) => {
        this.suppliertypes = data;
      }).catch( e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }
    if (this.supplierstatusField.pristine) {
      this.supplierstatusService.getAll().then((data: Supplierstatus[]) => {
        this.supplierstatuses = data;
      }).catch( e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }

    this.supplier = await this.supplierService.get(this.selectedId);
    this.setValues();

    this.userService.getAll(new PageRequest()).then((data: UserDataPage) => {
      this.systemUsers = data.content;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_SUPPLIERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_SUPPLIER);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIER);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }
    const newSupplier: Supplier = new Supplier();
    newSupplier.name = this.nameField.value;
    newSupplier.contact1 = this.contact1Field.value;
    newSupplier.contact2 = (this.contact2Field.value === '') ? null : this.contact2Field.value;
    newSupplier.email = this.emailField.value;
    newSupplier.fax = (this.faxField.value === '') ? null : this.faxField.value;
    newSupplier.address = this.addressField.value;
    newSupplier.description = this.descriptionField.value;
    newSupplier.suppliertype = this.suppliertypeField.value;
    newSupplier.supplierstatus = this.supplierstatusField.value;
    newSupplier.itemList = this.itemField.value;




    try{
      const resourceLink: ResourceLink = await this.supplierService.update(this.supplier.id, newSupplier);
      await this.router.navigateByUrl('/suppliers/' + resourceLink.id);
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403:
          this.snackBar.open(e.error.message, null, {duration: 2000});
          setTimeout(() => {
            this.router.navigateByUrl('/');
          }, 500);
          break;
        case 400:
          this.snackBar.open('Validation Error', null, {duration: 2000});
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }

  discardChanges(): void{
    this.form.patchValue(this.supplier);
  }

  setValues(): void{
    if (this.nameField.pristine){ this.nameField.patchValue(this.supplier.name); }
    if (this.contact1Field.pristine){ this.contact1Field.patchValue(this.supplier.contact1); }
    if (this.contact2Field.pristine){ this.contact2Field.patchValue(this.supplier.contact2); }
    if (this.emailField.pristine){ this.emailField.patchValue(this.supplier.email); }
    if (this.faxField.pristine){ this.faxField.patchValue(this.supplier.fax); }
    if (this.suppliertypeField.pristine){ this.suppliertypeField.patchValue(this.supplier.suppliertype); }
    if (this.supplierstatusField.pristine){ this.supplierstatusField.patchValue(this.supplier.supplierstatus.id); }
    if (this.addressField.pristine){ this.addressField.patchValue(this.supplier.address); }
    if (this.descriptionField.pristine){ this.descriptionField.patchValue(this.supplier.description); }
    if (this.itemField.pristine){ this.itemField.patchValue(this.supplier.itemList); }
  }

  async sendMessage(): Promise<void> {
    if (this.notificationForm.invalid) { return; }
    const notification: Notification = new Notification();
    notification.message = this.messageField.value;
    try{
      await this.notificationService.add(this.systemUserField.value, notification);
      console.log(notification);
      this.notificationForm.reset();
      this.snackBar.open('Message sent', null, {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          this.snackBar.open('Validation Error', null, {duration: 2000});
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }
  }

}
