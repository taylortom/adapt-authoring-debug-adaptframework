// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require){
  var Origin = require('core/origin');
  var OriginView = require('core/views/originView');

  var FrameworkView = OriginView.extend({
    tagName: 'div',
    className: 'framework',
    events: {
      'click button.update': 'updateFramework',
      'click button.purge': 'purgeFramework'
    },

    updateFramework: async function(e) {
      e.preventDefault();
      this.post('update');
    },
    
    purgeFramework: async function(e) {
      e.preventDefault();
      this.post('purge');
    },

    post: async function(endpoint) {
      try {
        await $.post(`api/adapt/${endpoint}`);
      } catch(e) {
        Origin.Notify.alert(e);
      }
    }
  }, {
    template: 'framework'
  });

  return FrameworkView;
});
