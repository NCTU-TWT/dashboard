(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

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

  require(['jquery', 'io', 'underscore', 'backbone', 'hogan'], function($, io, _, Backbone, hogan, Project) {
    var Server, ServerCollection, ServerView, Stream, StreamCollection, StreamView, socket;
    socket = io.connect();
    Server = (function(_super) {

      __extends(Server, _super);

      function Server() {
        Server.__super__.constructor.apply(this, arguments);
      }

      Server.prototype["default"] = {
        name: 'anonymous',
        status: false
      };

      return Server;

    })(Backbone.Model);
    ServerCollection = (function(_super) {

      __extends(ServerCollection, _super);

      function ServerCollection() {
        ServerCollection.__super__.constructor.apply(this, arguments);
      }

      ServerCollection.prototype.model = Server;

      return ServerCollection;

    })(Backbone.Collection);
    ServerView = (function(_super) {

      __extends(ServerView, _super);

      function ServerView() {
        ServerView.__super__.constructor.apply(this, arguments);
      }

      ServerView.prototype.tagName = 'li';

      ServerView.prototype.template = hogan.compile($('#server-template').html());

      ServerView.prototype.events = {
        'click .switch': 'switch',
        'click .restart': 'restart'
      };

      ServerView.prototype.initialize = function() {
        return this.render();
      };

      ServerView.prototype.render = function() {
        this.$el.html(this.template.render({
          name: this.model.get('name'),
          status: this.model.get('status')
        }));
        return $('#server').append(this.$el);
      };

      ServerView.prototype["switch"] = function() {
        var name, status;
        status = this.model.get('status');
        name = this.model.get('name');
        this.model.set('status', !status);
        this.$el.html(this.template.render({
          name: this.model.get('name'),
          status: this.model.get('status')
        }));
        return console.log("" + name + " switched");
      };

      ServerView.prototype.restart = function() {
        var name;
        name = this.model.get('name');
        socket.emit('restart', name);
        return console.log("" + name + " restart");
      };

      return ServerView;

    })(Backbone.View);
    Stream = (function(_super) {

      __extends(Stream, _super);

      function Stream() {
        Stream.__super__.constructor.apply(this, arguments);
      }

      Stream.prototype["default"] = {
        name: 'anonymous',
        status: false
      };

      return Stream;

    })(Backbone.Model);
    StreamCollection = (function(_super) {

      __extends(StreamCollection, _super);

      function StreamCollection() {
        StreamCollection.__super__.constructor.apply(this, arguments);
      }

      StreamCollection.prototype.model = Stream;

      return StreamCollection;

    })(Backbone.Collection);
    StreamView = (function(_super) {

      __extends(StreamView, _super);

      function StreamView() {
        StreamView.__super__.constructor.apply(this, arguments);
      }

      StreamView.prototype.tagName = 'li';

      StreamView.prototype.template = hogan.compile($('#stream-template').html());

      StreamView.prototype.events = {
        'click .pipe': 'pipe',
        'click .hiccup': 'hiccup'
      };

      StreamView.prototype.initialize = function() {
        return this.render();
      };

      StreamView.prototype.render = function() {
        this.$el.html(this.template.render({
          name: this.model.get('name'),
          status: this.model.get('status')
        }));
        return $('#stream').append(this.$el);
      };

      StreamView.prototype.pipe = function() {
        var name, status;
        status = this.model.get('status');
        name = this.model.get('name');
        if (status) {
          console.log("" + name + " stop");
          this.model.set('status', false);
          return $('.pipe', this.el).removeClass('selected');
        } else {
          console.log("" + name + " start");
          this.model.set('status', true);
          return $('.pipe', this.el).addClass('selected');
        }
      };

      StreamView.prototype.hiccup = function() {
        var name;
        name = this.model.get('name');
        console.log("" + name + " hiccup");
        return socket.emit('hiccup', name);
      };

      return StreamView;

    })(Backbone.View);
    return $(function() {
      var serverCollection, streamCollection;
      streamCollection = new StreamCollection;
      serverCollection = new ServerCollection;
      socket.on('stream-init', function(streamStatus) {
        var key, model, value, view, _results;
        _results = [];
        for (key in streamStatus) {
          value = streamStatus[key];
          model = new Stream({
            name: key,
            status: value.status
          });
          model.on('change:status', function(m) {
            var name, status;
            status = m.get('status');
            name = m.get('name');
            if (status) {
              return socket.emit('start', name);
            } else {
              return socket.emit('stop', name);
            }
          });
          streamCollection.add(model);
          _results.push(view = new StreamView({
            model: model
          }));
        }
        return _results;
      });
      return socket.on('server-init', function(serverStatus) {
        var key, model, value, view, _results;
        _results = [];
        for (key in serverStatus) {
          value = serverStatus[key];
          console.log(key);
          model = new Server({
            name: key,
            status: value.status
          });
          model.on('change:status', function(m) {
            var name, status;
            status = m.get('status');
            name = m.get('name');
            if (status) {
              return socket.emit('on', name);
            } else {
              return socket.emit('off', name);
            }
          });
          serverCollection.add(model);
          _results.push(view = new ServerView({
            model: model
          }));
        }
        return _results;
      });
    });
  });

}).call(this);
