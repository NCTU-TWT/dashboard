require.config
    paths:
        jquery: 'lib/jquery-1.7.1.min'
        io: 'lib/socket.io.min.amd'
        raphael: 'lib/raphael-min'
        underscore: 'lib/underscore-min.amd'
        backbone: 'lib/backbone-min.amd'
        hogan: 'lib/hogan-1.0.5.min.amd'
        
require [
    'jquery'    
    'io'
    'underscore'
    'backbone'
    'hogan'
], ($, io, _, Backbone, hogan, Project) ->

    socket = io.connect();
    
    class Server extends Backbone.Model
        default:
            name: 'anonymous'
            status: false
    
    class ServerCollection extends Backbone.Collection
        model: Server
        
    class ServerView extends Backbone.View
        
        tagName :   'li'
        template:   hogan.compile $('#server-template').html()
    
        events:
            'click .switch': 'switch'
            'click .restart': 'restart'
    
    
        initialize: ->
            @render()
            
        render: ->
            @$el.html @template.render
                name: @model.get 'name'
                status: @model.get 'status'
            $('#server').append @$el
            
        switch: ->
            status = @model.get 'status'   
            name = @model.get 'name'
            
            @model.set 'status', !status
            
            @$el.html @template.render
                name: @model.get 'name'
                status: @model.get 'status'
                
            console.log "#{name} switched"
                        
            
        restart: ->
            name = @model.get 'name'
            socket.emit('restart', name);
            console.log "#{name} restart"
            
            
            
    
    class Stream extends Backbone.Model
        default:
            name: 'anonymous'
            status: false
            
    class StreamCollection extends Backbone.Collection
        model: Stream
            
    class StreamView extends Backbone.View
    
        
        tagName :   'li'
        template:   hogan.compile $('#stream-template').html()
    
        events:
            'click .pipe': 'pipe'
            'click .hiccup': 'hiccup'
    
        initialize: ->
            @render()
    
        render: ->
            @$el.html @template.render
                name: @model.get 'name'
                status: @model.get 'status'
            $('#stream').append @$el
            
        pipe: ->
            
            status = @model.get 'status'
            name = @model.get 'name'
            
            if status
                console.log "#{name} stop"
                @model.set 'status', false
                $('.pipe', @el).removeClass 'selected'
                
            else
                console.log "#{name} start"
                @model.set 'status', true
                $('.pipe', @el).addClass 'selected'
    
        hiccup: ->
            name = @model.get 'name'
            console.log "#{name} hiccup"
            socket.emit 'hiccup', name
    
    $ ->
        streamCollection = new StreamCollection
        serverCollection = new ServerCollection
    
        socket.on 'stream-init', (streamStatus) ->
            for key, value of streamStatus
                model = new Stream
                    name: key
                    status: value.status
                    
                model.on 'change:status', (m) ->
                    status = m.get 'status'
                    name = m.get 'name'
                    
                    if status
                        socket.emit 'start', name
                    else
                        socket.emit 'stop', name
                        
                    
                streamCollection.add model
                view = new StreamView
                    model: model
                    
        socket.on 'server-init', (serverStatus) ->
            for key, value of serverStatus
                console.log key
            
                model = new Server
                    name: key
                    status: value.status
                    
                model.on 'change:status', (m) ->
                    status = m.get 'status'
                    name = m.get 'name'
                    
                    if status
                        socket.emit 'on', name
                    else
                        socket.emit 'off', name
                        
                    
                serverCollection.add model
                view = new ServerView
                    model: model
                    
