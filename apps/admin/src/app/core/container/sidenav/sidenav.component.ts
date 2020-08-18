import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'admin-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent {
  isExpanded = true;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  public color: string;
  public menuItems: object;
  public activeFontColor: string;
  public normalFontColor: string;
  public dividerBgColor: string;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.activeFontColor = 'rgba(0,0,0,.6)';
    this.normalFontColor = 'rgba(255,255,255,.8)';
    this.dividerBgColor = 'rgba(255, 255, 255, 0.5)';
  }
}
