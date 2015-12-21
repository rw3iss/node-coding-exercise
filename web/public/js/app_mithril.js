var cl = function() {
  if(typeof console != 'undefined') {
    console.log.apply(console, arguments);
  }
}

var app = app || {};
app.rootScope = {};
app.pages = {};


app.pages.sitePage = {

  controller: function() {
    var _isEditing = false;
    //grab model from root scope:
    var _site = app.rootScope.site

    return { 
      site: function() {
        return _site;
      },

      isEditing: function() { 
        return _isEditing; 
      },

      editSiteInfo: function() { 
        _isEditing = true; 
      },

      saveSiteInfo: function() { 
        _isEditing = false; 
        _site.name = document.getElementById('name').value;
        _site.timezone = document.getElementById('timezone').value;
        _site.useDaylightSavings = document.getElementById('useDaylightSavings').value;
        console.log("Site", _site);
      },

      goToSchedule: function() { m.route("/schedule"); }
    };
  },

  view: function(controller) {
    var site = controller.site;

    return m("div", { class: 'site-info' }, [

        m('div', { class: 'item' }, [
          m('label', "Site Name:"),
          (function() {
            if(controller.isEditing()) {
              return m('input', { id: 'name', type: 'text', value: site().name});
            } 
            else {
              return m('span', site().name);
            }
          })()
          ]),

        (function() {
          if(!controller.isEditing()) {
            return m("button", { onclick: controller.editSiteInfo }, "Edit Site Info");
          } else {
            return m("button", { onclick: controller.saveSiteInfo }, "Save Site Info");
          }
        })(),

        m("button", { onclick: controller.goToSchedule }, "View Schedule")
      ]);
  }
};

function initApp(siteData) {
  app.rootScope.site = siteData;

  m.route(document.body, "/", {
      "/": app.pages.sitePage,
      "/schedule": app.pages.sitePage
  });
}