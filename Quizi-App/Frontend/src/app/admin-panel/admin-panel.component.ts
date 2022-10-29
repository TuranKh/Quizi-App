import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent implements OnInit {
  constructor(
    private _adminService: AdminService,
    private snackBar: SnackbarService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.router.navigateByUrl('/admin/statistics');
    this.checkActiveTab(1)
  }

  activeMenu: number = 0;

  checkActiveTab(tab: number) {
    this.activeMenu = tab;
  }
}
