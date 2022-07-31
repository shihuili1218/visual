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
            model().nodeLabelVisible = false;
            model().clear();
            layout.invalidate();
        })
            .after(1000, function () {
                frame.model().title = '<h2 style="visibility:visible">Members of the role</h2>'
                    + '<br/>' + frame.model().controls.html();
                layout.invalidate();
            })
            .after(1000, function () {
                frame.model().controls.show();
            })
            .after(1, function () {
                model().title = "";
                layout.invalidate();
            })

            .after(500, function () {
                model().nodes.create("a");
                layout.invalidate();
            })

            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>Paxos defines three member roles:</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(100, function () {
                frame.snapshot();
                model().zoom([node("a")]);
                node("a")._state = "proposer";
                model().subtitle = '<h2>The <em>Proposer</em></h2>'
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
                node("a")._state = "acceptor";
                model().subtitle = '<h2>The <em>Acceptor</em></h2>'
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
                node("a")._state = "learner";
                model().subtitle = '<h2>or the <em>Learner</em></h2>'
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
                model().subtitle = '<h2>But here\'s the important thing, Learner did not participate in Paxos\' negotiation program.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(300, function () {
                frame.model().clear();
                frame.model().title = '<h2 style="visibility:visible">The negotiation program</h2>'
                    + '<br/>' + frame.model().controls.html();
                layout.invalidate();
            })

            .after(800, function () {
                frame.model().controls.show();
            })

            .after(1000, function () {
                frame.model().title = '<h2>Paxos\' negotiation program is divided into three stages.</h2>'
                    + '<h3 id="prepare" style="visibility:hidden;">Prepare Phase: Negotiate ProposalNo and obtain Proposal that may reach consensus in the previous round.</h3>'
                    + '<h3 id="accept" style="visibility:hidden;">Accept Phase: Really negotiate the Proposal and broadcast the Proposal to all Acceptors.</h3>'
                    + '<h3 id="accept" style="visibility:hidden;">Learn Phase: Learn reach consensus Proposal and input it into the state machine.</h3>'
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
