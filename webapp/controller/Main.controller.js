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
        this._fetchLandingKpis();
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

      _fetchLandingKpis: function () {
        var oODataModel = this.getOwnerComponent().getModel();
        var oDashboardModel = this.getOwnerComponent().getModel("dashboard");
        if (!oODataModel) {
          return;
        }
        var oBinding = oODataModel.bindList("/LandingPageKPI(false)/Set");
        oBinding.requestContexts().then(function (aContexts) {
          if (!aContexts.length) {
            return;
          }
          var oData = aContexts[0].getObject();

          oDashboardModel.setProperty("/vendorKpis/0/value", String(oData.TotalRequests));
          oDashboardModel.setProperty("/vendorKpis/1/value", String(oData.ApprovedRequests));
          oDashboardModel.setProperty("/vendorKpis/2/title", "In Progress");
          oDashboardModel.setProperty("/vendorKpis/2/value", String(oData.InProgressRequests));

          var iTotalVisitors = (oData.totalBusinessReqs || 0) + (oData.totalTempStaffReqs || 0) +
            (oData.totalTempJobReqs || 0) + (oData.totalProjectReqs || 0) + (oData.totalSecurityRequests || 0);
          oDashboardModel.setProperty("/visitorChart/centerLabel", iTotalVisitors + " TODAY");
          oDashboardModel.setProperty("/visitorChart/data", [
            { Category: "Business", Count: oData.totalBusinessReqs || 0 },
            { Category: "Temporary Staff Access", Count: oData.totalTempStaffReqs || 0 },
            { Category: "Temporary Job", Count: oData.totalTempJobReqs || 0 },
            { Category: "Project", Count: oData.totalProjectReqs || 0 },
            { Category: "Security", Count: oData.totalSecurityRequests || 0 }
          ]);
        }).catch(function () {
          // backend unreachable — static mock data remains in place
        });
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
