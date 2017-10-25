import { Aurelia, PLATFORM } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';

export class App {
    router: Router;

    configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'Mortgage App';
        config.map([{
            route: [ '', 'home' ],
            name: 'home',
            settings: { icon: 'home' },
            moduleId: PLATFORM.moduleName('../home/home'),
            nav: true,
            title: 'Home'
        },
        {
            route: ['mortgage', 'mortgage/:id'],
            name: 'mortgage',
            settings: { icon: 'home' },
            moduleId: PLATFORM.moduleName('../mortgage/mortgage'),
            nav: false,
            title: 'Mortgage'
        },
        {
            route: ['compare'],
            name: 'compare',
            settings: { icon: 'usd' },
            moduleId: PLATFORM.moduleName('../compare/compare'),
            nav: true,
            title: 'Compare'
        }
        ]);

        this.router = router;
    }
}
