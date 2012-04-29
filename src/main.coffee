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
    
        socket.on 'init', (streamStatus) ->
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
                    
