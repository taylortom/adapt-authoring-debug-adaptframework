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
      'click button.install': 'installPlugin',
      'click button.cache': 'clearCache'
    },

    updateFramework: async function(e) {
      e.preventDefault();
      this.post('adapt/update', undefined, 'Framework update successful');
    },
    
    purgeFramework: async function(e) {
      e.preventDefault();
      this.post('adapt/purge', undefined, 'Framework purged successfully');
    },
    
    clearCache: async function(e) {
      e.preventDefault();
      this.post('adapt/clearcache', undefined, 'Build cache cleared');
    },
    
    installPlugin: async function(e) {
      e.preventDefault();
      await this.post('contentplugins/install', {
        name: this.$('input#name').val(),
        version: this.$('input#version').val(),
        force: this.$('input#force').is(':checked')
      }, 'Plugin installed successfully');
    },

    post: async function(endpoint, data, successText) {
      try {
        await $.post(`api/${endpoint}`, data);
        Origin.Notify.toast({ type: 'success', text: successText });
      } catch(e) {
        Origin.Notify.toast({ type: 'error', text: e.responseJSON.message });
      }
    }
  }, {
    template: 'framework'
  });

  return FrameworkView;
});
