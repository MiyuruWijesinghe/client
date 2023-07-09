import {Component, OnInit, ViewChild} from '@angular/core';
import {Sale} from '../../../../entities/sale';
import {Salepayment} from '../../../../entities/salepayment';
import {Inventory} from '../../../../entities/inventory';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SaleService} from '../../../../services/sale.service';
import {SalepaymentService} from '../../../../services/salepayment.service';
import {InventoryService} from '../../../../services/inventory.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {PageRequest} from '../../../../shared/page-request';
import {InventoryDataPage} from '../../../../entities/inventory-data-page';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../entities/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Saleitem} from '../../../../entities/saleitem';
import {SaleItemUpdateSubFormComponent} from './sale-item-update-sub-form/sale-item-update-sub-form.component';
import {SalePaymentUpdateSubFormComponent} from './sale-payment-update-sub-form/sale-payment-update-sub-form.component';
import {SaleitemService} from '../../../../services/saleitem.service';
import {SupplierService} from '../../../../services/supplier.service';
import {SupplierDataPage} from '../../../../entities/supplier-data-page';
import {CustomerService} from '../../../../services/customer.service';
import {CustomerDataPage} from '../../../../entities/customer-data-page';
import {Customer} from '../../../../entities/customer';
import {Branch} from '../../../../entities/branch';
import {BranchService} from '../../../../services/branch.service';
import {BranchDataPage} from '../../../../entities/branch-data-page';
import {Item} from '../../../../entities/item';
import {ItemDataPage} from '../../../../entities/item-data-page';
import {ItemService} from '../../../../services/item.service';
import {User, UserDataPage} from '../../../../entities/user';
import {NotificationService} from '../../../../services/notification.service';
import {UserService} from '../../../../services/user.service';
import {Notification} from '../../../../entities/notification';

@Component({
  selector: 'app-sale-update-form',
  templateUrl: './sale-update-form.component.html',
  styleUrls: ['./sale-update-form.component.scss']
})
export class SaleUpdateFormComponent extends AbstractComponent implements OnInit {
  @ViewChild(SaleItemUpdateSubFormComponent) saleitemupdateSubForm: SaleItemUpdateSubFormComponent;
  @ViewChild(SalePaymentUpdateSubFormComponent) salepaymentupdateSubForm: SalePaymentUpdateSubFormComponent;
    selectedId: number;

  sale: Sale = new Sale();
  inventories: Inventory[];
  customers: Customer[];
  branches: Branch[];
  branchInventories: Inventory[] = [];
  items: Item [] = [];
  systemUsers: User[] = [];


  form = new FormGroup({
    description: new FormControl('', [
      Validators.maxLength(65535),
    ]),
    amount: new FormControl('', [
      Validators.required
    ]),
    saleitems: new FormControl(),
    salepayments: new FormControl(),
    customer: new FormControl(),
    branch: new FormControl(),

  });

  notificationForm = new FormGroup({
    message: new FormControl('', [
      Validators.required
    ]),
    systemUser: new FormControl('', [
      Validators.required
    ]),
  });

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }
  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }

  get totalField(): FormControl{
    return this.form.controls.total as FormControl;
  }
  get discountField(): FormControl{
    return this.form.controls.discount as FormControl;
  }

  get saleitemsField(): FormControl{
    return this.form.controls.saleitems as FormControl;
  }
  /*get salepaymentsField(): FormControl{
    return this.form.controls.salepayments as FormControl;
  }*/
  get customerField(): FormControl{
    return this.form.controls.customer as FormControl;
  }
  get branchField(): FormControl{
    return this.form.controls.branch as FormControl;
  }

  get messageField(): FormControl{
    return this.notificationForm.controls.message as FormControl;
  }

  get systemUserField(): FormControl{
    return this.notificationForm.controls.systemUser as FormControl;
  }

  constructor(
    private saleService: SaleService,
    private customerService: CustomerService,
    private saleitemService: SaleitemService,
    private itemService: ItemService,
    // private salepaymentService: SalepaymentService,
    private inventoryService: InventoryService,
    private branchService: BranchService,
    private notificationService: NotificationService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {

    this.inventoryService.getAll(new PageRequest()).then((data: InventoryDataPage) => {
      this.inventories = data.content;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');


      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.update){ return; }
    if (!this.privilege.add){ return; }

    this.customerService.getAll(new PageRequest()).then((data: CustomerDataPage) => {
      this.customers = data.content;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.branchService.getAll(new PageRequest()).then((data: BranchDataPage) => {
      this.branches = data.content;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.itemService.getAll(new PageRequest()).then((data: ItemDataPage) => {
      this.items = data.content;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.sale = await this.saleService.get(this.selectedId);
    this.setValues();

    this.userService.getAll(new PageRequest()).then((data: UserDataPage) => {
      this.systemUsers = data.content;
    }).catch( e => {
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

  discardChanges(): void{
    this.saleitemupdateSubForm.resetForm();
    this.saleitemsField.markAsPristine();
   // this.salepaymentupdateSubForm.resetForm();
    // this.salepaymentsField.markAsPristine();
    this.form.patchValue(this.sale);
  }

  setValues(): void{
    if (this.amountField.pristine){ this.amountField.patchValue(this.sale.amount); }
    if (this.customerField.pristine){ this.customerField.patchValue(this.sale.customer.id); }
    if (this.descriptionField.pristine){ this.descriptionField.patchValue(this.sale.description); }
    if (this.saleitemsField.pristine){ this.saleitemsField.patchValue(this.sale.saleitemList); }
    if (this.branchField.pristine){ this.branchField.patchValue(this.sale.branch.id); }

    // if (this.salepaymentsField.pristine){ this.salepaymentsField.patchValue(this.sale.salepaymentList); }

  }

  async submit(): Promise<void> {

    this.saleitemupdateSubForm.resetForm();
    this.saleitemsField.markAsDirty();

    /*this.salepaymentupdateSubForm.resetForm();
    this.salepaymentsField.markAsDirty();*/
    if (this.form.invalid) { return; }

    const newSale: Sale = new Sale();
    newSale.amount = this.amountField.value;
  //  newSale.discount = this.discountField.value;
    newSale.description = this.descriptionField.value;
   // newSale.total = this.totalField.value;
    newSale.customer = this.customerField.value;
    newSale.branch = this.branchField.value;
    newSale.saleitemList = this.saleitemsField.value;
    // newSale.salepaymentList = this.salepaymentsField.value;



    try{
      const resourceLink: ResourceLink = await this.saleService.update(this.sale.id, newSale);
      await this.router.navigateByUrl('/sales/' + resourceLink.id);
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

  calculateAmount(): void{
    if (!this.saleitemsField.valid){
      return;
    }

    let totalAmount = 0;
    for (const item of this.saleitemsField.value){
      totalAmount += item.unitprice * item.qty;
    }
    if (!isNaN(totalAmount)){
      this.amountField.patchValue(totalAmount);
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
