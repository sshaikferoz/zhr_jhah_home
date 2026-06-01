sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
  ],
  function (Controller, Fragment) {
    "use strict";

    var SHELL_FRAGMENTS = {
      EMPLOYEE: "com.jhah.zhrjhahhome.fragments.employee.EmployeeDashboardShell",
      COORDINATOR: "com.jhah.zhrjhahhome.fragments.coordinator.CoordinatorDashboardShell",
      SECURITY: "com.jhah.zhrjhahhome.fragments.security.SecurityDashboardShell",
      ADMIN: "com.jhah.zhrjhahhome.fragments.coordinator.CoordinatorDashboardShell"
    };

    return Controller.extend("com.jhah.zhrjhahhome.controller.Main", {
      onInit: function () {
        var sRole = this.getOwnerComponent().getModel("dashboard").getProperty("/role");
        this._loadDashboardForRole(sRole);
      },

      _loadDashboardForRole: function (sRole) {
        var sFragment = SHELL_FRAGMENTS[sRole] || SHELL_FRAGMENTS.EMPLOYEE;
        this._loadShellFragment(sFragment);
      },

      _loadShellFragment: function (sFragmentName) {
        var oContainer = this.byId("dashboardContent");
        oContainer.destroyItems();

        return Fragment.load({
          id: this.getView().getId(),
          name: sFragmentName,
          controller: this,
          type: "XML"
        }).then(
          function (oShell) {
            oContainer.addItem(oShell);
            this._configureVisitorChart();
          }.bind(this)
        );
      },

      _configureVisitorChart: function () {
        var oChart = this.byId("visitorCategoryChart");
        if (!oChart) {
          return;
        }
        oChart.setVizProperties({
          legend: { visible: true, position: "bottom" },
          title: { visible: false },
          plotArea: {
            dataLabel: { visible: true },
            colorPalette: ["#1d7db5", "#31a56e", "#d28c22", "#6d8fd7", "#9b59b6"]
          }
        });
      }
    });
  }
);
