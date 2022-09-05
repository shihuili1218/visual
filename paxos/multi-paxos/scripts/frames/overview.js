"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define(["../../../core/model/log_entry"], function (LogEntry) {
    return function (frame) {
        var player = frame.player(),
            layout = frame.layout(),
            model = function() { return frame.model(); },
            client = function(id) { return frame.model().clients.find(id); },
            node = function(id) { return frame.model().nodes.find(id); },
            wait = function() { var self = this; model().controls.show(function() { player.play(); self.stop(); }); };

        frame.after(1, function () {
            model().clear();
            layout.invalidate();
        })
            .after(1000, function () {
                frame.model().title = '<h2 style="visibility:visible">Algorithm Overview</h2>'
                    + '<br/>' + frame.model().controls.html();
                layout.invalidate();
            })
            .after(500, function () {
                frame.model().controls.show();
            })
            .after(1, function () {
                model().title = "";
                layout.invalidate();
            })

            .after(10, function () {
                frame.snapshot();
                frame.model().clear();

                model().nodes.create("A");
                node("A")._state = "acceptor";
                node("A")._proposalNo = 0;

                model().nodes.create("B");
                node("B")._state = "acceptor";
                node("B")._proposalNo = 0;

                model().nodes.create("C");
                node("C")._state = "acceptor";
                node("C")._proposalNo = 0;
            })
            .after(10, function () {
                model().subtitle = '<h3>As we imagine, after running a round of Prepare phase, subsequent negotiations can directly enter the Accept phase.</h3>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                frame.snapshot();
                model().nodes.create("P1");
                node("P1")._state = "proposer";
                node("P1")._proposalNo = 0;

                frame.model().clients.create("X");
            })
            .after(10, function () {
                model().subtitle = '<h2>zzzzzzzzzzzzzzzzzzz.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()


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
