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
  EntityType,
  EntitySubType,
} from '@hospitality-bot/admin/shared';
import { OutletTableService } from '../../services/outlet-table.service';
import { GuestListComponent } from '../guest-list/guest-list.component';

@Component({
  selector: 'hospitality-bot-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.scss'],
})
export class OutletComponent implements OnInit {
  welcomeMessage = 'Welcome to your dashboard';
  navRoutes: NavRouteOptions = [{ label: 'Outlet Dashboard', link: './' }];

  selectedInterval: string;
  entityId: string;

  sidebarVisible = false;
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;

  constructor(
    private outletTableService: OutletTableService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // TODO: remove
    this.openGuestList();
  }

  getFormServiceEntity(item: EntityTabFilterResponse) {
    return {
      id: item.entityId[0],
      label: item.label,
      type: item.outletType ? EntityType.OUTLET : EntityType.HOTEL,
      subType: item.outletType ? item.outletType : EntitySubType.ROOM_TYPE,
      value: item.entityId[0],
    };
  }

  onEntityTabFilterChanges(event: EntityTabFilterResponse): void {
    this.outletTableService.selectedEntity.next(
      this.getFormServiceEntity(event)
    );
  }

  openGuestList() {
    this.sidebarVisible = true;
    this.createDynamicComponent();
  }

  createDynamicComponent() {
    // Dynamically create an instance of DynamicComponent
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      GuestListComponent
    );
    const componentRef = this.sidebarSlide.createComponent(factory);

    // Optionally, you can interact with the created component
    const instance: GuestListComponent = componentRef.instance;

    instance.onClose.subscribe((res) => {
      this.sidebarVisible = false;
      componentRef.destroy();
    });
    // ...

    // You can also destroy the component when it's no longer needed
    // componentRef.destroy();
  }

  clearDynamicComponent() {
    // Clear the dynamic component container
    this.sidebarVisible = false;
    this.sidebarSlide.clear();
  }
}
