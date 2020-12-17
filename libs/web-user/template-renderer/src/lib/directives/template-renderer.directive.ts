import { Directive, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { TemplateCodes } from 'libs/web-user/shared/src/lib/types/template';
import { templateConfig as templates } from '../constants/template-config';

@Directive({ selector: '[template-renderer]' })
export class TemplateRendererDirective implements OnChanges {
  @Input() templateId: TemplateCodes;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnChanges() {
    if (this.templateId) {
      this.asyncLoadModule();
    }
  }

  async asyncLoadModule() {
    const module = await templates[this.templateId].modulePath();
    const entity = this.route.snapshot.queryParamMap.get('entity');
    const id = this.route.snapshot.queryParamMap.get('id');

    const config: Route[] = [
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
