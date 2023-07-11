import {Component, OnInit} from '@angular/core';
import {Supplier} from '../../../../entities/supplier';
import {SupplierService} from '../../../../services/supplier.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';

@Component({
  selector: 'app-supplier-detail',
  templateUrl: './supplier-detail.component.html',
  styleUrls: ['./supplier-detail.component.scss']
})
export class SupplierDetailComponent extends AbstractComponent implements OnInit {
  supplier: Supplier;
  selectedId: number;

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      this.selectedId = +params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async delete(): Promise<void> {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: this.supplier.name}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (!result) {
        return;
      }

      await this.supplierService.delete(this.supplier.id);
      await this.router.navigateByUrl('/suppliers');
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.supplier = await this.supplierService.get(this.selectedId);
    console.log(this.supplier.tocreation);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_SUPPLIER);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_SUPPLIERS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_SUPPLIER);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_SUPPLIER);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_SUPPLIER);
  }

}
