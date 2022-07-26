"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define(["../model/log_entry"], function (LogEntry) {
    return function (frame) {
        var player = frame.player(),
            layout = frame.layout(),
            model = function() { return frame.model(); },
            client = function(id) { return frame.model().clients.find(id); },
            node = function(id) { return frame.model().nodes.find(id); },
            wait = function() { var self = this; model().controls.show(function() { player.play(); self.stop(); }); };

        frame.after(1, function () {
            model().nodeLabelVisible = false;
            model().clear();
            model().nodes.create("a");
            layout.invalidate();
        })

            .after(800, function () {
                model().subtitle = '<h2><em>Paxos</em> is algorithm for implementing distributed consensus.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>Let\'s look at a high level overview of how it works.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                model().zoom([node("a")]);
                model().subtitle = '<h2>Paxos defines three member roles:</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(100, function () {
                frame.snapshot();
                node("a")._state = "leader";
                model().subtitle = '<h2>The <em>Proposer</em>,</h2>'
                    + '<h2 id="desc" style="visibility:hidden;">Proposer is used to make <em>Proposal</em> on behalf of clients.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(800, function () {
                layout.fadeIn($(".subtitle #desc"));
            })
            .after(100, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                node("a")._state = "follower";
                model().subtitle = '<h2>The <em>Acceptor</em>,</h2>'
                    + '<h2 id="desc" style="visibility:hidden;">Acceptors are used to decide on <em>Proposal</em>.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(800, function () {
                layout.fadeIn($(".subtitle #desc"));
            })
            .after(100, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                node("a")._state = "candidate";
                model().subtitle = '<h2>or the <em>Learner</em>,</h2>'
                    + '<h3 id="desc" style="visibility:hidden;">Learner is used to record <em>Proposal</em> on which consensus is reached, and input it into the state machine.</h3>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(800, function () {
                layout.fadeIn($(".subtitle #desc"));
            })
            .after(100, wait).indefinite()

            .after(300, function () {
                frame.snapshot();
                model().zoom(null);
                model().subtitle = '<h2>But here\'s the important thing, Leaner did not participate in Paxos\' negotiation process.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(300, function () {
                frame.model().clear();
                frame.model().title = '<h2 style="visibility:visible">The negotiation phase</h2>'
                    + '<br/>' + frame.model().controls.html();
                layout.invalidate();
            })

            .after(800, function () {
                frame.model().controls.show();
            })

            .after(1000, function () {
                frame.model().title = '<h2>Paxos\' negotiation process is divided into two stages.</h2>'
                    + '<h3 id="prepare" style="visibility:hidden;">Prepare: </h3>'
                    + '<h3 id="accept" style="visibility:hidden;">Accept: </h3>'
                    + '<br/>' + frame.model().controls.html();
                layout.invalidate();
            })
            .after(1000, function () {
                layout.fadeIn($(".title #prepare"));
            })
            .after(1000, function () {
                layout.fadeIn($(".title #accept"));
            })
            .after(800, function () {
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
