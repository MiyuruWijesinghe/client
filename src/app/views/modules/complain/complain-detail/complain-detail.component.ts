import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Complain} from '../../../../entities/complain';
import {ComplainService} from '../../../../services/complain.service';
import {MatDialog} from '@angular/material/dialog';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-complain-detail',
  templateUrl: './complain-detail.component.html',
  styleUrls: ['./complain-detail.component.scss']
})
export class ComplainDetailComponent extends AbstractComponent implements OnInit {

  complain: Complain;
  selectedId: number;

  constructor(
    private complainService: ComplainService,
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
      data: {message: this.complain.name}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (!result) {
        return;
      }

      await this.complainService.delete(this.complain.id);
      await this.router.navigateByUrl('/complains');
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.complain = await this.complainService.get(this.selectedId);
    console.log(this.complain.tocreation);
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_COMPLAIN);
    this.privilege.showAll = LoggedUser.can(UsecaseList.GET_ALL_COMPLAINS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.GET_COMPLAIN);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_COMPLAIN);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_COMPLAIN);
  }
}
