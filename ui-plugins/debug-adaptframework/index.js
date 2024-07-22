// LICENCE https://github.com/adaptlearning/adapt_authoring/blob/master/LICENSE
define(function(require) {
  const Origin = require('core/origin');
  const FrameworkView = require('./views/frameworkView');

  Origin.trigger(`debug:addView`, { 
    name: 'adaptframework', 
    icon: 'toolbox', 
    title: Origin.l10n.t('app.adaptframework'), 
    view: FrameworkView
  })
});
