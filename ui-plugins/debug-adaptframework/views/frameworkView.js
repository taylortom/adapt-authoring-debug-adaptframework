// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require){
  var Origin = require('core/origin');
  var OriginView = require('core/views/originView');

  var FrameworkView = OriginView.extend({
    tagName: 'div',
    className: 'framework',
    events: {
      'click button.update': 'updateFramework',
      'click button.purge': 'purgeFramework',
      'click button.install': 'installPlugin'
    },

    updateFramework: async function(e) {
      e.preventDefault();
      this.post('update');
    },
    
    purgeFramework: async function(e) {
      e.preventDefault();
      this.post('purge');
    },
    
    installPlugin: async function(e) {
      e.preventDefault();
      try {
        await $.post('api/contentplugins/install', {
          name: this.$('input#name').val(),
          version: this.$('input#version').val(),
          force: this.$('input#force').is(':checked')
        });
        Origin.Notify.alert({ type: 'success', text: 'Plugin installed successfully' });
      } catch(e) {
        Origin.Notify.alert({ type: 'error', text: e.responseJSON.message });
      }
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
