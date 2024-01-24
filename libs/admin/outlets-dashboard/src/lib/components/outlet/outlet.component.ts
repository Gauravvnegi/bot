import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  NavRouteOptions,
  EntityTabFilterResponse,
} from '@hospitality-bot/admin/shared';
import { GuestListComponent } from '../guest-list/guest-list.component';
import { OutletFormService } from '../../services/outlet-form.service';

@Component({
  selector: 'hospitality-bot-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.scss'],
})
export class OutletComponent implements OnInit {
  welcomeMessage = 'Welcome to your dashboard';
  navRoutes: NavRouteOptions = [{ label: 'Outlet Dashboard', link: './' }];

  sidebarVisible = false;
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private formService: OutletFormService
  ) {}

  ngOnInit(): void {}


  onEntityTabFilterChanges(event: EntityTabFilterResponse): void {
    this.formService.entityId = event.entityId[0];
  }

  openGuestList() {
    this.sidebarVisible = true;
    this.createDynamicComponent();
  }

  createDynamicComponent() {
    // Dynamically create an instance of DynamicComponent
    this.sidebarSlide.clear();
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      GuestListComponent
    );
    const componentRef = this.sidebarSlide.createComponent(factory);
    const instance: GuestListComponent = componentRef.instance;

    const closeSubscription = instance.onClose.subscribe((res: any) => {
      componentRef.destroy();
      closeSubscription.unsubscribe();
      this.sidebarVisible = false;
    });
  }

  clearDynamicComponent() {
    // Clear the dynamic component container
    this.sidebarVisible = false;
  }
}
