
"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define([], function () {
    return function (frame) {
        var player = frame.player(),
            layout = frame.layout(),
            model = function() { return frame.model(); },
            client = function(id) { return frame.model().clients.find(id); },
            node = function(id) { return frame.model().nodes.find(id); },
            wait = function() { var self = this; model().controls.show(function() { self.stop(); }); };

        frame.after(1, function() {
            model().nodeLabelVisible = false;
            frame.snapshot();
            frame.model().clear();
            layout.invalidate();
        })

        .after(1000, function () {
            frame.model().title = '<h2 style="visibility:visible">So What is Paxos Algorithm?</h2>'
                        + '<br/>' + frame.model().controls.html();
            layout.invalidate();
        })
        .after(1000, function () {
            frame.model().controls.show();
        })
	
	
	   .after(1000, function () {
            frame.model().title = '<h2>Paxos is a algorithm for implementing distributed consensus.</h2>'
                        + '<h3 id="paxos-desc" style="visibility:hidden;">Paxos is often used to implement distributed state machines.</h3>'
                        + '<h3 id="sm-desc" style="visibility:hidden;">State machine can be database, configuration center, naming service, or any business program.</h3>'
                        + '<br/>' + frame.model().controls.html();
            layout.invalidate();
        })
        .after(1000, function () {
            layout.fadeIn($(".title #paxos-desc"));
        })
        .after(1000, function () {
            layout.fadeIn($(".title #sm-desc"));
        })
		.after(1000, function () {
            frame.model().controls.show();
        })
		.after(50, function () {
            frame.model().title = frame.model().subtitle = "";
            layout.invalidate();
        })


        .after(300, function () {
            frame.snapshot();
            player.next();
        })


        frame.addEventListener("end", function () {
            frame.model().title = frame.model().subtitle = "";
            layout.invalidate();
        });

        player.play();
    };
});
