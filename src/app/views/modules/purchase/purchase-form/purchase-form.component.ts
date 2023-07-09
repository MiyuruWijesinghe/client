import {Component, OnInit, ViewChild} from '@angular/core';
import {Purchase} from '../../../../entities/purchase';
import {Branch} from '../../../../entities/branch';
import {Supplier} from '../../../../entities/supplier';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PurchaseService} from '../../../../services/purchase.service';
import {BranchService} from '../../../../services/branch.service';
import {SupplierService} from '../../../../services/supplier.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {PageRequest} from '../../../../shared/page-request';
import {BranchDataPage} from '../../../../entities/branch-data-page';
import {SupplierDataPage} from '../../../../entities/supplier-data-page';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DateHelper} from '../../../../shared/date-helper';
import {ResourceLink} from '../../../../entities/resource-link';
import {Porder} from '../../../../entities/porder';
import {PorderService} from '../../../../services/porder.service';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PorderDataPage} from '../../../../entities/porder-data-page';
import {PorderItemSubFormComponent} from '../../porder/porder-form/porder-item-sub-form/porder-item-sub-form.component';
import {PurchaseItemSubFormComponent} from './purchase-item-sub-form/purchase-item-sub-form.component';
import {Item} from '../../../../entities/item';
import {ItemService} from '../../../../services/item.service';
import {ItemDataPage} from '../../../../entities/item-data-page';
import {Purchaseitem} from '../../../../entities/purchaseitem';
import {User, UserDataPage} from '../../../../entities/user';
import {NotificationService} from '../../../../services/notification.service';
import {UserService} from '../../../../services/user.service';
import {Notification} from '../../../../entities/notification';

@Component({
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss']
})
export class PurchaseFormComponent extends AbstractComponent implements OnInit {

  @ViewChild(PurchaseItemSubFormComponent) purchaseitemSubForm: PurchaseItemSubFormComponent;
  branches: Branch[] = [];
  porders: Porder[] = [];
  items: Item[] = [];
  systemUsers: User[] = [];

  form = new FormGroup({

    description: new FormControl('', [
      Validators.maxLength(65535),
    ]),
    branch: new FormControl('', [
      Validators.required
    ]),
    porder: new FormControl('', [
      Validators.required
    ]),
    amount: new FormControl('', [
      Validators.required
    ]),
    taxamount: new FormControl('', [
      Validators.required
    ]),
    totalamount: new FormControl('', [
      Validators.required
    ]),
    purchaseitem: new FormControl(),

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

  get porderField(): FormControl{
    return this.form.controls.porder as FormControl;
  }
  get branchField(): FormControl{
    return this.form.controls.branch as FormControl;
  }
  get amountField(): FormControl{
    return this.form.controls.amount as FormControl;
  }
  get taxAmountField(): FormControl{
    return this.form.controls.taxamount as FormControl;
  }
  get totalAmountField(): FormControl{
    return this.form.controls.totalamount as FormControl;
  }
  get purchaseitemField(): FormControl{
    return this.form.controls.purchaseitem as FormControl;
  }

  get messageField(): FormControl{
    return this.notificationForm.controls.message as FormControl;
  }

  get systemUserField(): FormControl{
    return this.notificationForm.controls.systemUser as FormControl;
  }

  constructor(
    private porderService: PorderService,
    private purchaseService: PurchaseService,
    private branchService: BranchService,
    private notificationService: NotificationService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private itemService: ItemService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {

    this.itemService.getAll(new PageRequest()).then((data: ItemDataPage) => {
      this.items = data.content;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.loadData();
    this.refreshData();
  }

  loadData(): any {
    this.updatePrivileges();
    if (!this.privilege.add){ return; }

    this.branchService.getAll(new PageRequest()).then((data: BranchDataPage) => {
      this.branches = data.content;
    }).catch( e => {
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

  getPurchaseOrders(): void{
    const pageRequest = new PageRequest();
    pageRequest.addSearchCriteria('branch', this.branchField.value);
    pageRequest.addSearchCriteria('porderstatus', '1');

    this.porderService.getAll(pageRequest).then((data: PorderDataPage) => {
      this.porders = data.content;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

    updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PURCHASE);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_PURCHASES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_PURCHASE);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PURCHASE);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PURCHASE);
  }

  async submit(): Promise<void> {
    this.purchaseitemSubForm.resetForm();
    this.purchaseitemField.markAsDirty();
    if (this.form.invalid) { return; }

    const purchase: Purchase = new Purchase();
    purchase.description = this.descriptionField.value;
    purchase.amount = this.amountField.value;
    purchase.totalamount = this.totalAmountField.value;
    purchase.taxamount = this.taxAmountField.value;
    purchase.branch = this.branchField.value;
    purchase.porder = this.porderField.value;
    purchase.purchaseitemList = this.purchaseitemField.value;


    try{
      const resourceLink: ResourceLink = await this.purchaseService.add(purchase);
      await this.router.navigateByUrl('/purchases/' + resourceLink.id);
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

  getOrderedItems(): void {
    let selectedPOrder: Porder = null;
    for (const item of this.porders){
      if (item.id === this.porderField.value){
        selectedPOrder = item;
      }
    }

    const purchaseItems: Purchaseitem[] = [];
    for (const item of selectedPOrder.porderitemList){
      const p = new Purchaseitem();
      p.item = item.item;
      p.qty = item.qty;
      purchaseItems.push(p);
    }
    this.purchaseitemField.patchValue(purchaseItems);

  }

  calculateAmount(): void{
    if (!this.porderField.valid){
      return;
    }

    let totalAmount = 0;
    let taxAmount = 0;
    let totalAmountandTax = 0;
    for (const item of this.purchaseitemField.value){
     totalAmount += item.unitprice * item.qty;
     taxAmount = totalAmount * 0.1;
     totalAmountandTax = totalAmount + taxAmount;
    }
    if (!isNaN(totalAmountandTax)){
      this.totalAmountField.patchValue(totalAmountandTax);
    }
    if (!isNaN(totalAmount)){
      this.amountField.patchValue(totalAmount);
    }
    if (!isNaN(taxAmount)){
      this.taxAmountField.patchValue(taxAmount);
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
