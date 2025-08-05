"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define([], function () {
    return function (frame) {
        var player = frame.player(),
            layout = frame.layout();

        frame.after(1, function () {
            frame.model().clear();
            layout.invalidate();
        })

        .after(500, function () {
            frame.model().title = '<h1 style="visibility:visible">ZAB Protocol</h1>'
                        + '<h2 style="visibility:visible">Zookeeper Atomic Broadcast</h2>'
                        + '<br/>' + frame.model().controls.html();
            layout.invalidate();
        })

        .after(500, function () {
            frame.model().subtitle = '<p style="visibility:visible"><em>ZAB ensures total order and atomic broadcast in distributed systems</em></p>';
            layout.invalidate();
            frame.model().controls.show();
        })

        .after(100, function () {
            player.next();
        });

        frame.player().play();
    };
});