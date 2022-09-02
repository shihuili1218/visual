
"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define([], function () {
    return function (frame) {
        var player = frame.player(),
            layout = frame.layout();

        frame.after(1, function() {
            frame.model().clear();
            layout.invalidate();
        })

        .after(1000, function () {
            frame.model().title = '<h1 style="visibility:visible">Paxos</h1>'
                        + '<h2 style="visibility:visible">The ancestor of consensus algorithm</h2>'
                        + '<br/>' + frame.model().controls.html();
            layout.invalidate();
        })
        .after(500, function () {
            frame.model().subtitle = '<p style="visibility:visible"><em><a href="https://github.com/shihuili1218/visual/issues/1" target="_blank">Please note: discussion on Paxos visualization. Click here to provide feedback.</a></em></h1>';
            layout.invalidate();
            frame.model().controls.show();
        })


        .after(100, function () {
            player.next();
        })
        
        player.play();
    };
});
