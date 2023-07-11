import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../entities/resource-link';
import {Saleitem} from '../../../../entities/saleitem';
import {Salepayment} from '../../../../entities/salepayment';
import {Sale} from '../../../../entities/sale';
import {SaleService} from '../../../../services/sale.service';
import {SaleitemService} from '../../../../services/saleitem.service';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {SaleItemSubFormComponent} from './sale-item-sub-form/sale-item-sub-form.component';
import {SalePaymentSubFormComponent} from './sale-payment-sub-form/sale-payment-sub-form.component';
import {PageRequest} from '../../../../shared/page-request';
import {BranchDataPage} from '../../../../entities/branch-data-page';
import {InventoryService} from '../../../../services/inventory.service';
import {InventoryDataPage} from '../../../../entities/inventory-data-page';
import {Inventory} from '../../../../entities/inventory';
import {Customer} from '../../../../entities/customer';
import {CustomerService} from '../../../../services/customer.service';
import {CustomerDataPage} from '../../../../entities/customer-data-page';
import {Branch} from '../../../../entities/branch';
import {BranchService} from '../../../../services/branch.service';
import {Item} from '../../../../entities/item';
import {ItemService} from '../../../../services/item.service';
import {ItemDataPage} from '../../../../entities/item-data-page';
import {User, UserDataPage} from '../../../../entities/user';
import {NotificationService} from '../../../../services/notification.service';
import {UserService} from '../../../../services/user.service';
import {Notification} from '../../../../entities/notification';

@Component({
  selector: 'app-sale-form',
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.scss']
})
export class SaleFormComponent extends AbstractComponent implements OnInit {

  @ViewChild(SaleItemSubFormComponent) saleitemSubForm: SaleItemSubFormComponent;
  @ViewChild(SalePaymentSubFormComponent) salepaymentSubForm: SalePaymentSubFormComponent;


  sale: Sale = new Sale();
  saleitems: Saleitem[] = [];
  salepayments: Salepayment[] = [];
  inventories: Inventory[] = [];
  branchInventories: Inventory[] = [];
  customers: Customer[] = [];
  branches: Branch[] = [];
  items: Item[] = [];
  systemUsers: User[] = [];

  form = new FormGroup({
    description: new FormControl('', [
      Validators.maxLength(65535),
    ]),
    amount: new FormControl('', [
      Validators.required
    ]),
    saleitems: new FormControl(),
    //  salepayments: new FormControl(),
    customer: new FormControl(),
    branch: new FormControl()

  });

  notificationForm = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ]),
    systemUser: new FormControl('', [
      Validators.required
    ]),
  });

  constructor(
    private saleService: SaleService,
    private customerService: CustomerService,
    private branchService: BranchService,
    private saleitemService: SaleitemService,
    private itemService: ItemService,
    // private salepaymentService: SalepaymentService,
    private inventoryService: InventoryService,
    private notificationService: NotificationService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  get descriptionField(): FormControl {
    return this.form.controls.description as FormControl;
  }

  get amountField(): FormControl {
    return this.form.controls.amount as FormControl;
  }

  get saleitemsField(): FormControl {
    return this.form.controls.saleitems as FormControl;
  }

  get customerField(): FormControl {
    return this.form.controls.customer as FormControl;
  }

  get branchField(): FormControl {
    return this.form.controls.branch as FormControl;
  }

  get messageField(): FormControl {
    return this.notificationForm.controls.message as FormControl;
  }

  get systemUserField(): FormControl {
    return this.notificationForm.controls.systemUser as FormControl;
  }

  ngOnInit(): void {
    this.inventoryService.getAll(new PageRequest()).then((data: InventoryDataPage) => {
      this.inventories = data.content;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.itemService.getAll(new PageRequest()).then((data: ItemDataPage) => {
      this.items = data.content;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.loadData();
    this.refreshData();
  }

  loadData(): any {
    this.updatePrivileges();

    if (!this.privilege.add) {
      return;
    }

    this.customerService.getAll(new PageRequest()).then((data: CustomerDataPage) => {
      this.customers = data.content;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.branchService.getAll(new PageRequest()).then((data: BranchDataPage) => {
      this.branches = data.content;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.userService.getAll(new PageRequest()).then((data: UserDataPage) => {
      this.systemUsers = data.content;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SALE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_SALES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_SALE);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SALE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SALE);
  }

  async submit(): Promise<void> {

    this.saleitemSubForm.resetForm();
    this.saleitemsField.markAsDirty();

    // this.salepaymentSubForm.resetForm();
    // this.salepaymentsField.markAsDirty();
    if (this.form.invalid) {
      return;
    }

    const sale: Sale = new Sale();
    // sale.contact2 = (this.contact2Field.value === '') ? null : this.contact2Field.value;
    sale.description = this.descriptionField.value;
    /*sale.total = this.totalField.value;
    sale.discount = this.discountField.value;*/
    sale.amount = this.amountField.value;
    // sale.salepaymentList = this.salepaymentsField.value;
    sale.saleitemList = this.saleitemsField.value;
    sale.customer = this.customerField.value;
    sale.branch = this.branchField.value;

    try {
      const resourceLink: ResourceLink = await this.saleService.add(sale);
      await this.router.navigateByUrl('/sales/' + resourceLink.id);
    } catch (e) {
      switch (e.status) {
        case 401:
          break;
        case 403:
          this.snackBar.open(e.error.message, null, {duration: 2000});
          break;
        case 400:
          this.snackBar.open('Validation Error', null, {duration: 2000});
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }
  }

  getInventoryItems(): void {
    let selectedBranch: Branch = null;
    for (const item of this.branches) {
      if (item.id === this.branchField.value) {
        selectedBranch = item;
      }
    }
    this.branchInventories = [];
    for (const inventory of this.inventories) {
      if (inventory.branch.id === selectedBranch.id) {
        this.branchInventories.push(inventory);
      }

    }
  }

  calculateAmount(): void {
    if (!this.saleitemsField.valid) {
      return;
    }

    let totalAmount = 0;
    for (const item of this.saleitemsField.value) {
      totalAmount += item.unitprice * item.qty;
    }
    if (!isNaN(totalAmount)) {
      this.amountField.patchValue(totalAmount);
    }
  }

  async sendMessage(): Promise<void> {
    if (this.notificationForm.invalid) {
      return;
    }
    const notification: Notification = new Notification();
    notification.message = this.messageField.value;
    try {
      await this.notificationService.add(this.systemUserField.value, notification);
      console.log(notification);
      this.snackBar.open('Message sent', null, {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
    } catch (e) {
      switch (e.status) {
        case 401:
          break;
        case 403:
          this.snackBar.open(e.error.message, null, {duration: 2000});
          break;
        case 400:
          this.snackBar.open('Validation Error', null, {duration: 2000});
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }
  }

  resetNotificationForm(): void {
    this.notificationForm.reset({value: '', disabled: false}, {emitEvent: false});
  }

}
