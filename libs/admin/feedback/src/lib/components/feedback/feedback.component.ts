import {
  Component,
  OnInit,
  Compiler,
  Injector,
  ViewChild,
  ViewContainerRef,
  Type,
} from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;
  $subscription = new Subscription();
  trasactionalModuleLoad = false;

  constructor(
    private compiler: Compiler,
    private injector: Injector,
    private _globalFilterService: GlobalFilterService
  ) {}

  public ngOnInit() {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.trasactionalModuleLoad =
          data['filter'].value.feedback.feedbackType === 'Transactional';
        this.loadModules();
      })
    );
  }

  async loadModules() {
    if (this.trasactionalModuleLoad) {
      this.loadModule(
        await import(
          'libs/admin/transactional-feedback/src/lib/admin-transactional-feedback.module'
        ).then((m) => m.AdminTransactionalFeedbackModule)
      );
    } else {
      this.loadModule(
        await import(
          'libs/admin/stay-feedback/src/lib/admin-stay-feedback.module'
        ).then((m) => m.AdminStayFeedbackModule)
      );
    }
  }

  async loadModule(module: Type<any>) {
    let ref;
    try {
      this.container.clear();
      const moduleFactory = await this.compiler.compileModuleAsync(module);
      const moduleRef: any = moduleFactory.create(this.injector);
      const componentFactory = moduleRef.instance.resolveComponent(); // ASSERTION ERROR
      ref = this.container.createComponent(
        componentFactory,
        null,
        moduleRef.injector
      );
    } catch (e) {
      console.error(e);
    }
    return ref;
  }
}
