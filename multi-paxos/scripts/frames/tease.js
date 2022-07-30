"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define(["../model/log_entry"], function (Proposal) {
    return function (frame) {
        var player = frame.player(),
            layout = frame.layout(),
            model = function () {
                return frame.model();
            },
            client = function (id) {
                return frame.model().clients.find(id);
            },
            node = function (id) {
                return frame.model().nodes.find(id);
            },
            wait = function () {
                var self = this;
                model().controls.show(function () {
                    player.play();
                    self.stop();
                });
            };

        //------------------------------
        // Title
        //------------------------------
        frame.after(1, function () {
            frame.snapshot();
            model().clear();
            layout.invalidate();
        })
            .after(1000, function () {
                frame.model().title = '<h2 style="visibility:visible">Paxos Disadvantages</h2>'
                    + '<h2 style="visibility:visible">So, We started teasing with Paxos...</h2>'
                    + '<br/>' + frame.model().controls.html();
                layout.invalidate();
            })
            .after(200, wait).indefinite()
            .after(500, function () {
                model().title = "";
                layout.invalidate();
            })

            .after(10, function () {
            })



            //------------------------------
            // Too many message interactions
            //------------------------------
            .after(500, function () {
                frame.model().title = '<h2 style="visibility:visible">Too many message interactions</h2>'
                    + '<h3 style="visibility:hidden">In Paxos, it always takes two phases to reach a consensus on a proposal</h3>'
                    + frame.model().controls.html();
                layout.invalidate();
            })
            .after(800, function () {
                layout.fadeIn($(".title h3"));
            })
            .after(800, function () {
                frame.model().controls.show();
            })


            //------------------------------
            // Livelock
            //------------------------------
            .after(500, function () {
                frame.model().title = '<h2 style="visibility:visible">Livelock</h2>'
                    + '<br/>' + frame.model().controls.html();
                layout.invalidate();
            })


            .after(100, wait).indefinite()
            .then(function () {
                player.next();
            })

        player.play();
    };
});
