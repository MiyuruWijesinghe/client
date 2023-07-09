import { Component, OnInit } from '@angular/core';
import {Customer} from '../../../../entities/customer';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomerService} from '../../../../services/customer.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {ResourceLink} from '../../../../entities/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Employee} from '../../../../entities/employee';
import {Itembranch} from '../../../../entities/itembranch';
import {error} from '@angular/compiler/src/util';
import {CustomertypeService} from '../../../../services/customertype.service';
import {Customertype} from '../../../../entities/customertype';
import {Item} from '../../../../entities/item';
import {User, UserDataPage} from '../../../../entities/user';
import {NotificationService} from '../../../../services/notification.service';
import {UserService} from '../../../../services/user.service';
import {PageRequest} from '../../../../shared/page-request';
import {Notification} from '../../../../entities/notification';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent extends AbstractComponent implements OnInit {

  customertypes: Customertype[] = [];
  systemUsers: User[] = [];

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ]),
    nic: new FormControl('', [
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
    passport: new FormControl('', [
      Validators.minLength(12),
      Validators.maxLength(12),
    ]),
    fax: new FormControl('', [
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    customertype: new FormControl('', [
      Validators.required,
    ]),
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

  get nicField(): FormControl{
    return this.form.controls.nic as FormControl;
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

  get passportField(): FormControl{
    return this.form.controls.passport as FormControl;
  }
  get faxField(): FormControl{
    return this.form.controls.fax as FormControl;
  }
  get customertypeField(): FormControl{
    return this.form.controls.customertype as FormControl;
  }

  get messageField(): FormControl{
    return this.notificationForm.controls.message as FormControl;
  }

  get systemUserField(): FormControl{
    return this.notificationForm.controls.systemUser as FormControl;
  }

  constructor(
    private customerService: CustomerService,
    private customertypeService: CustomertypeService,
    private notificationService: NotificationService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
  }

  loadData(): any {
    this.updatePrivileges();
    if (!this.privilege.add){ return; }

    this.customertypeService.getAll().then((data: Customertype[]) => {
      this.customertypes = data;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.userService.getAll(new PageRequest()).then((data: UserDataPage) => {
      this.systemUsers = data.content;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_CUSTOMER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_CUSTOMERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_CUSTOMER);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_CUSTOMER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_CUSTOMER);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) { return; }

    const customer: Customer = new Customer();
    customer.name = this.nameField.value;
    customer.nic = this.nicField.value;
    customer.contact1 = this.contact1Field.value;
    customer.contact2 = (this.contact2Field.value === '') ? null : this.contact2Field.value;
    customer.email = this.emailField.value;
    customer.address = this.addressField.value;
    customer.description = this.descriptionField.value;
    customer.customertype = this.customertypeField.value;
    customer.passport = (this.passportField.value === '') ? null : this.passportField.value;
    customer.fax = (this.faxField.value === '') ? null : this.faxField.value;
    try{
      const resourceLink: ResourceLink = await this.customerService.add(customer);
      await this.router.navigateByUrl('/customers/' + resourceLink.id);
    }catch (c) {
      switch (c.status) {
        case 401: break;
        case 403: this.snackBar.open(c.error.message, null, {duration: 2000}); break;
        case 400:
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }
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

