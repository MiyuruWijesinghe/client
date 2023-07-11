import {Component, OnInit, ViewChild} from '@angular/core';
import {Purchase} from '../../../../entities/purchase';
import {Branch} from '../../../../entities/branch';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PurchaseService} from '../../../../services/purchase.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../entities/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Porder} from '../../../../entities/porder';
import {BranchService} from '../../../../services/branch.service';
import {PorderService} from '../../../../services/porder.service';
import {PageRequest} from '../../../../shared/page-request';
import {BranchDataPage} from '../../../../entities/branch-data-page';
import {PorderDataPage} from '../../../../entities/porder-data-page';
import {Item} from '../../../../entities/item';
import {ItemService} from '../../../../services/item.service';
import {ItemDataPage} from '../../../../entities/item-data-page';
import {PurchaseItemUpdateSubFormComponent} from './purchase-item-update-sub-form/purchase-item-update-sub-form.component';
import {Purchaseitem} from '../../../../entities/purchaseitem';
import {User, UserDataPage} from '../../../../entities/user';
import {NotificationService} from '../../../../services/notification.service';
import {UserService} from '../../../../services/user.service';
import {Notification} from '../../../../entities/notification';

@Component({
  selector: 'app-purchase-update-form',
  templateUrl: './purchase-update-form.component.html',
  styleUrls: ['./purchase-update-form.component.scss']
})
export class PurchaseUpdateFormComponent extends AbstractComponent implements OnInit {

  @ViewChild(PurchaseItemUpdateSubFormComponent) purchaseitemSubForm: PurchaseItemUpdateSubFormComponent;

  selectedId: number;
  purchase: Purchase;

  items: Item[] = [];
  branches: Branch[] = [];
  porders: Porder[] = [];
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
    amount: new FormControl({value: '', disabled: true}, [
      Validators.required
    ]),
    purchaseitem: new FormControl()
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
    private purchaseService: PurchaseService,
    private itemService: ItemService,
    private branchService: BranchService,
    private porderService: PorderService,
    private notificationService: NotificationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  get descriptionField(): FormControl {
    return this.form.controls.description as FormControl;
  }

  get porderField(): FormControl {
    return this.form.controls.porder as FormControl;
  }

  get branchField(): FormControl {
    return this.form.controls.branch as FormControl;
  }

  get amountField(): FormControl {
    return this.form.controls.amount as FormControl;
  }

  get purchaseitemField(): FormControl {
    return this.form.controls.purchaseitem as FormControl;
  }

  get messageField(): FormControl {
    return this.notificationForm.controls.message as FormControl;
  }

  get systemUserField(): FormControl {
    return this.notificationForm.controls.systemUser as FormControl;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      this.selectedId = +params.get('id');

      this.itemService.getAll(new PageRequest()).then((data: ItemDataPage) => {
        this.items = data.content;
      }).catch(e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });

      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.update) {
      return;
    }

    this.branchService.getAll(new PageRequest()).then((data: BranchDataPage) => {
      this.branches = data.content;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.porderService.getAll(new PageRequest()).then((data: PorderDataPage) => {
      this.porders = data.content;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.purchase = await this.purchaseService.get(this.selectedId);
    this.setValues();

    this.userService.getAll(new PageRequest()).then((data: UserDataPage) => {
      this.systemUsers = data.content;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  getPurchaseOrders(): void {
    const pageRequest = new PageRequest();
    pageRequest.addSearchCriteria('branch', this.branchField.value);
    pageRequest.addSearchCriteria('porderstatus', '1');

    this.porderService.getAll(pageRequest).then((data: PorderDataPage) => {
      this.porders = data.content;
    }).catch(e => {
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

  discardChanges(): void {
    this.purchaseitemSubForm.resetForm();
    this.purchaseitemField.markAsPristine();
    this.form.patchValue(this.purchase);
  }

  setValues(): void {
    if (this.descriptionField.pristine) {
      this.descriptionField.patchValue(this.purchase.description);
    }
    if (this.branchField.pristine) {
      this.branchField.patchValue(this.purchase.branch.id);
    }
    if (this.porderField.pristine) {
      this.porderField.patchValue(this.purchase.porder.id);
    }
    if (this.amountField.pristine) {
      this.amountField.patchValue(this.purchase.amount);
    }
    if (this.purchaseitemField.pristine) {
      this.purchaseitemField.patchValue(this.purchase.purchaseitemList);
    }
  }

  async submit(): Promise<void> {
    this.purchaseitemSubForm.resetForm();
    this.purchaseitemField.markAsDirty();
    if (this.form.invalid) {
      return;
    }
    const newPurchase: Purchase = new Purchase();

    newPurchase.description = this.descriptionField.value;
    newPurchase.branch = this.branchField.value;
    newPurchase.porder = this.porderField.value;
    newPurchase.amount = this.amountField.value;
    newPurchase.purchaseitemList = this.purchaseitemField.value;

    try {
      const resourceLink: ResourceLink = await this.purchaseService.update(this.purchase.id, newPurchase);
      await this.router.navigateByUrl('/purchases/' + resourceLink.id);
    } catch (e) {
      switch (e.status) {
        case 401:
          break;
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

  getOrderedItems(): void {
    let selectedPOrder: Porder = null;
    for (const item of this.porders) {
      if (item.id === this.porderField.value) {
        selectedPOrder = item;
      }
    }

    const purchaseItems: Purchaseitem[] = [];
    for (const item of selectedPOrder.porderitemList) {
      const p = new Purchaseitem();
      p.item = item.item;
      p.qty = item.qty;
      purchaseItems.push(p);
    }
    this.purchaseitemField.patchValue(purchaseItems);

  }

  calculateAmount(): void {
    if (!this.porderField.valid) {
      return;
    }

    let totalAmount = 0;
    for (const item of this.purchaseitemField.value) {
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
    this.notificationForm.reset({ value: '', disabled: false }, { emitEvent: false });
  }
}
