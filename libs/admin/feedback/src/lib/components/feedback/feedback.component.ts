import {
  Component,
  OnInit,
  Compiler,
  Injector,
  ViewChild,
  ViewContainerRef,
  Type,
} from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import { globalFeedback } from '../../constants/feedback';

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
  loadedModule = '';

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
          data['filter'].value.feedback.feedbackType ===
          globalFeedback.types.transactional;
        this.handleModuleLoad();
      })
    );
  }

  /**
   * @function handleModuleLoad To handle loading of module based on the global filter data.
   */
  async handleModuleLoad() {
    if (this.trasactionalModuleLoad) {
      this.loadedModule !== globalFeedback.types.transactional &&
        this.loadModule(
          await import(
            'libs/admin/transactional-feedback/src/lib/admin-transactional-feedback.module'
          ).then((m) => m.AdminTransactionalFeedbackModule)
        );
      this.loadedModule = globalFeedback.types.transactional;
    } else {
      this.loadedModule !== globalFeedback.types.stay &&
        this.loadModule(
          await import(
            'libs/admin/stay-feedback/src/lib/admin-stay-feedback.module'
          ).then((m) => m.AdminStayFeedbackModule)
        );
      this.loadedModule = globalFeedback.types.stay;
    }
  }

  /**
   * @function loadModule To load a module.
   * @param module The module import statement.
   */
  async loadModule(module: Type<any>) {
    let containerRef;
    try {
      this.container.clear();
      const moduleFactory = await this.compiler.compileModuleAsync(module);
      const moduleRef: any = moduleFactory.create(this.injector);
      const componentFactory = moduleRef.instance.resolveComponent();
      containerRef = this.container.createComponent(
        componentFactory,
        null,
        moduleRef.injector
      );
    } catch (e) {
      console.error(e);
    }
  }
}
