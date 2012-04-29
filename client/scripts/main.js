(function() {

  require.config({
    paths: {
      jquery: 'lib/jquery-1.7.1.min',
      io: 'lib/socket.io.min.amd',
      raphael: 'lib/raphael-min',
      underscore: 'lib/underscore-min.amd',
      backbone: 'lib/backbone-min.amd',
      hogan: 'lib/hogan-1.0.5.min.amd'
    }
  });

  require(['jquery', 'io', 'underscore', 'backbone', 'hogan', 'model/project', 'view/project', 'view/function'], function($, io, _, Backbone, hogan, Project, ProjectView, FunctionView) {
    var EE, projects, socket;
    EE = _.extend({}, Backbone.Events);
    socket = io.connect();
    socket.on('project-list', function(data) {
      return EE.trigger('project-list', data);
    });
    projects = new Project.Collection(EE);
    return $(function() {
      var functionView, projectView;
      projectView = new ProjectView({
        collection: projects
      });
      return functionView = new FunctionView({
        collection: projects
      });
    });
  });

}).call(this);
