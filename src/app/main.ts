// JiT.
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app.module';

// AoT.
//import {platformBrowser}    from '@angular/platform-browser';
//import {AppModuleNgFactory} from '../../aot/src/app/app.module.ngfactory';

/**
 * IMPORTANT: Do not remove the following comment!!! 
 *
 * Because when building a production build, the comment:
 *
 * // PRODUCTION_MODE_PLACEHOLDER
 *
 * is replaced with:
 *
 * var myCore_1 = require('@angular/core'); 
 * myCore_1.enableProdMode();
 */

// PRODUCTION_MODE_PLACEHOLDER

// JiT.
platformBrowserDynamic().bootstrapModule(AppModule);

// AoT.
//platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
