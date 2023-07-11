import {Component, OnInit} from '@angular/core';
import {InventoryDataPage} from '../../../../entities/inventory-data-page';
import {Branch} from '../../../../entities/branch';
import {FormControl} from '@angular/forms';
import {InventoryService} from '../../../../services/inventory.service';
import {BranchService} from '../../../../services/branch.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {BranchDataPage} from '../../../../entities/branch-data-page';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Inventory} from '../../../../entities/inventory';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {Item} from '../../../../entities/item';
import {ItemService} from '../../../../services/item.service';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {ItemDataPage} from '../../../../entities/item-data-page';

@Component({
  selector: 'app-inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss']
})
export class InventoryTableComponent extends AbstractComponent implements OnInit {

  inventoryDataPage: InventoryDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;
  branches: Branch[] = [];
  items: Item[] = [];

  branchField = new FormControl();
  itemField = new FormControl();

  constructor(
    private inventoryService: InventoryService,
    private branchService: BranchService,
    private itemService: ItemService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.showAll) {
      return;
    }

    this.setDisplayedColumns();

    const pageRequest = new PageRequest();
    pageRequest.pageIndex = this.pageIndex;
    pageRequest.pageSize = this.pageSize;

    pageRequest.addSearchCriteria('branch', this.branchField.value);
    pageRequest.addSearchCriteria('item', this.itemField.value);

    this.inventoryService.getAll(pageRequest).then((page: InventoryDataPage) => {
      this.inventoryDataPage = page;
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

    this.branchService.getAll(new PageRequest()).then((data: BranchDataPage) => {
      this.branches = data.content;
    }).catch(e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_INVENTORY);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_INVENTORIES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_INVENTORY);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_INVENTORY);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_INVENTORY);
  }

  setDisplayedColumns(): void {
    this.displayedColumns = ['branch', 'item', 'qty'];

    if (this.privilege.showOne) {
      this.displayedColumns.push('more-col');
    }
    if (this.privilege.update) {
      this.displayedColumns.push('update-col');
    }
    if (this.privilege.delete) {
      this.displayedColumns.push('delete-col');
    }
  }

  paginate(e): void {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(inventory: Inventory): Promise<void> {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: inventory.id}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (!result) {
        return;
      }

      await this.inventoryService.delete(inventory.id);
      this.loadData();
    });
  }
}
