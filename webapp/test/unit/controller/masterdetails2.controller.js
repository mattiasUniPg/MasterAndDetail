/*global QUnit*/

sap.ui.define([
	"masterdetails2/controller/masterdetails2.controller"
], function (Controller) {
	"use strict";

	QUnit.module("masterdetails2 Controller");

	QUnit.test("I should test the masterdetails2 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
