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

            .after(1000, function () {
                frame.model().title = '<h1 style="visibility:visible">Multi Paxos</h1>'
                    + '<h2 style="visibility:visible">A round of negotiation led to consensus on multiple Proposal</h2>'
                    + '<br/>' + frame.model().controls.html();
                layout.invalidate();
            })
            .after(500, function () {
                frame.model().subtitle = '<p style="visibility:visible"><em><a href="https://github.com/shihuili1218/visual/issues/2" target="_blank">Please note: discussion on Multi Paxos visualization. Click here to provide feedback.</a></em></h1>';
                layout.invalidate();
            })

            .after(800, function () {
                frame.model().controls.show();
            })

            .after(50, function () {
                frame.model().title = frame.model().subtitle = "";
                layout.invalidate();
            })

            .after(100, function () {
                frame.snapshot();
                player.next();
            })

        player.play();
    };
});
