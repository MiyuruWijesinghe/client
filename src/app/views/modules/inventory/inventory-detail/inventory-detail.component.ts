import { Component, OnInit } from '@angular/core';
import {Inventory} from '../../../../entities/inventory';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {InventoryService} from '../../../../services/inventory.service';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss']
})
export class InventoryDetailComponent extends AbstractComponent implements OnInit {


  inventory: Inventory;
  selectedId: number;

  constructor(
    private inventoryService: InventoryService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId = + params.get('id');
      try{
        await this.loadData();
      } finally {
        this.initialLoaded();
        this.refreshData();
      }
    });
  }

  async delete(): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: this.inventory.code}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      await this.inventoryService.delete(this.inventory.id);
      await this.router.navigateByUrl('/inventories');
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.inventory = await this.inventoryService.get(this.selectedId);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_INVENTORY);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_INVENTORIES);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_INVENTORY);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_INVENTORY);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_INVENTORY);
  }

}
