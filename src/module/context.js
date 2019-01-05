const isBrowser = process.browser;const isProduction = process.env.NODE_ENV === 'production';// Frameworkimport startUI from '@jmaguirrei/ui';import createStore from '@jmaguirrei/store';// Definitionsimport StoreDefinition from './store';import componentsMaker from './ui/components';import fragmentsMaker from './ui/fragments';import * as uiLib from './ui/lib';import { routes } from './routes';// Initializationconst uiFramework = startUI(isBrowser);// Store is created and used to create hoc afterwardsexport const Store = createStore(StoreDefinition, uiFramework.render);if (isBrowser && !isProduction) window.Store = Store;/*  ui is an object that has:  hoc, framework (html, repeat...) and lib for all kind of components  + (standard) components for fragments components  + (also) fragments components for pages components*/const hoc = uiFramework.createHoc(Store);const components = componentsMaker({ hoc, ...uiFramework, lib: uiLib });const fragments = fragmentsMaker({ hoc, ...uiFramework, lib: uiLib, components });// Main (pages) hierarchyexport const ui = {  hoc,  html: uiFramework.html, // for convenience can be accessed directly  framework: uiFramework,  lib: uiLib,  components,  fragments,};// Start application: ConnectToServer, First Render, Service workers, ...export default {  start() {    window.onload = () => {      Store.methods.startApp({        appData: window.__APP_DATA__,        routes,      });    };  },};