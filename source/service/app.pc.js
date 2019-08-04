import "es6-promise/auto"
import angular from "angular"
import uiRouter from "angular-ui-router"
import ocLazyLoad from "oclazyload"
import ngFileUpload from "ng-file-upload"

window.app = angular.module("myApp", [uiRouter, ocLazyLoad, ngFileUpload]); // jshint ignore:line

require("./index/module.json");
let module_json_loaders = require.context('./', true, /module\.json$/);
console.log(module_json_loaders)

module_json_loaders.keys().forEach(function (_key) {
    window.app.config(["$stateProvider", module_json_loaders(_key)]);
});


export default window.app.name;
