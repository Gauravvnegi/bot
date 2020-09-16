import {
  Compiler,
  ComponentRef,
  Directive,
  Injector,
  Input,
  NgModuleFactory,
  OnChanges,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { Router, ActivatedRoute } from '@angular/router';

const templates = {
  temp000001: {
    module: 'Temp000001Module',
    component: 'Temp000001Component',
    modulePath: async () =>
      import('../../../../templates/temp000001/src/lib/temp000001.module'),
    componentPath: async () =>
      import(
        '../../../../templates/temp000001/src/lib/containers/temp000001/temp000001.component'
      ),
  },
  tempCovid000001: {
    module: 'TempCovid000001Module',
    component: 'TempCovid000001Component',
    modulePath: async () =>
      import(
        '../../../../templates/temp-covid000001/src/lib/temp-covid000001.module'
      ),
    componentPath: async () =>
      import(
        '../../../../templates/temp-covid000001/src/lib/containers/temp-covid000001/temp-covid000001.component'
      ),
  },
};

@Directive({ selector: '[template-renderer]' })
export class TemplateRendererDirective implements OnChanges {
  @Input() templateId: string;

  constructor(
    protected _container: ViewContainerRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnChanges() {
    if (this.templateId) {
      this.asyncLoadModule();
    }
  }

  private async asyncLoadModule() {
    const module = await templates[this.templateId].modulePath();
    const entity = this.route.snapshot.queryParamMap.get('entity');
    const id = this.route.snapshot.queryParamMap.get('id');

    const config = [
      {
        path: '',
        loadChildren: () => {
          return module[templates[this.templateId].module];
        },
      },
    ];

    this.router.resetConfig(config);

    if (entity && id) {
      this.router.navigate([`${entity}/${id}`], { preserveQueryParams: true });
    } else if (entity) {
      this.router.navigate([`${entity}`], { preserveQueryParams: true });
    } else {
      this.router.navigate([''], { preserveQueryParams: true });
    }
  }
}
