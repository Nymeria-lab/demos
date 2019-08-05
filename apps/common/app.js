'use strict';
var angular = require("angular");
var app = angular.module("demos.common");
!window.app && (window.app = app);  //common组件继承crud,window.app未定义
window.moment = require("moment");
app.config(["$stateProvider", function ($stateProvider) {
    $stateProvider
        .state('role_error', {
            url: '/role_error?role_name&next',
            template: require("./template/role_error.html"),
            controller: 'RoleErrorCtrl'
        })
}]);

let module_json_loaders = require.context('./', true, /module\.json$/);
module_json_loaders.keys().forEach(function (_key) {
    app.config(["$stateProvider", module_json_loaders(_key)]);
});


module.exports = app;