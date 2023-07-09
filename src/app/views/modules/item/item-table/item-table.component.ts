import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {ItemDataPage} from '../../../../entities/item-data-page';
import {FormControl} from '@angular/forms';
import {ItemService} from '../../../../services/item.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {Item} from '../../../../entities/item';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {Itemtype} from '../../../../entities/itemtype';
import {Itemstatus} from '../../../../entities/itemstatus';
import {ItemtypeService} from '../../../../services/itemtype.service';
import {ItemstatusService} from '../../../../services/itemstatus.service';
import {Designation} from '../../../../entities/designation';

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.scss']
})
export class ItemTableComponent extends AbstractComponent implements OnInit {

  itemDataPage: ItemDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;
  itemtypes: Itemtype[] = [];
  itemstatuses: Itemstatus[] = [];


  nameField = new FormControl();
  itemtypeField = new FormControl();
  itemstatusField = new FormControl();


  constructor(
    private itemService: ItemService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private itemtypeService: ItemtypeService,
    private itemstatusService: ItemstatusService,

  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<void>{

    this.updatePrivileges();

    if (this.privilege.showAll){
      this.setDisplayedColumns();

      const pageRequest = new PageRequest();
      pageRequest.pageIndex  = this.pageIndex;
      pageRequest.pageSize  = this.pageSize;



      pageRequest.addSearchCriteria('name', this.nameField.value);
      pageRequest.addSearchCriteria('itemtype', this.itemtypeField.value);
      pageRequest.addSearchCriteria('itemstatus', this.itemstatusField.value);

      try{
        this.itemDataPage = await this.itemService.getAll(pageRequest);
      }catch (e) {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
      this.itemstatusService.getAll().then((data: Itemstatus[]) => {
        this.itemstatuses = data;
      }).catch( e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
      this.itemtypeService.getAll().then((data: Itemtype[]) => {
        this.itemtypes = data;
      }).catch( e => {
        console.log(e);
        this.snackBar.open('Something is wrong', null, {duration: 2000});
      });
    }
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_ITEM);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_ITEMS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_ITEM);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_ITEM);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_ITEM);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = [ 'name', 'itemtype', 'lastprice'];

    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(item: Item): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: item.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      await this.itemService.delete(item.id);
      this.loadData();
    });
  }

}
