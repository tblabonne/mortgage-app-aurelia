import { HttpClient } from "aurelia-fetch-client";
import { Aurelia, PLATFORM } from "aurelia-framework";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "isomorphic-fetch";
declare const IS_DEV_BUILD: boolean; // The value is supplied by Webpack during the build

export function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration()
        .plugin(PLATFORM.moduleName("aurelia-computed"), { enableLogging: IS_DEV_BUILD })
        .plugin(PLATFORM.moduleName("aurelia-dialog"))
        .globalResources([ PLATFORM.moduleName("app/converters/currency-format") ]);

    if (IS_DEV_BUILD) {
        aurelia.use.developmentLogging();
    }

    new HttpClient().configure((config) => {
        const baseUrl = document.getElementsByTagName("base")[0].href;
        config.withBaseUrl(baseUrl);
    });

    aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName("app/components/app/app")));
}
