'use strict';

require("../../resources/icon/iconfont.css");
var angular = require("angular");
var angular_animate = require('angular-animate');

require("moment").locale('zh-cn');
require('angular-moment');
var app = angular.module("hcm.common", [angular_animate, "angularMoment"]);
app.constant('moment', require('moment'));

module.exports = app.name;

