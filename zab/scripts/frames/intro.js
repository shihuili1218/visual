"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define([], function () {
    return function (frame) {
        var player = frame.player(),
            layout = frame.layout(),
            wait = function() { var self = this; model().controls.show(function() { self.stop(); }); },
            model = function() { return frame.model(); };

        frame.after(1, function () {
            model().nodeLabelVisible = false;
            frame.snapshot();
            model().clear();
            layout.invalidate();
        })

        .after(500, function () {
            frame.model().title = '<h2 style="visibility:visible">What is ZAB?</h2>'
                        + '<p style="visibility:visible">ZAB (Zookeeper Atomic Broadcast) is a consensus protocol</p>'
                        + '<p style="visibility:visible">designed for distributed coordination services.</p>'
                        + '<br/>'
                        + '<p style="visibility:visible">ZAB provides:</p>'
                        + '<ul style="visibility:visible">'
                        + '<li>Total order of transactions</li>'
                        + '<li>Atomic broadcast guarantees</li>'
                        + '<li>Leader-based architecture</li>'
                        + '<li>Recovery mechanisms</li>'
                        + '</ul>'
                        + '<br/>' + frame.model().controls.html();
            layout.invalidate();
        })
        .after(1000, function () {
            frame.model().controls.show();
        })

         player.play();
    };
});