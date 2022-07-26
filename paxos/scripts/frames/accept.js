"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define(["../model/log_entry"], function (Proposal) {
    return function (frame) {
        var player = frame.player(),
            layout = frame.layout(),
            model = function() { return frame.model(); },
            client = function(id) { return frame.model().clients.find(id); },
            node = function(id) { return frame.model().nodes.find(id); },
            cluster = function(value) { model().nodes.toArray().forEach(function(node) { node.cluster(value); }); },
            wait = function() { var self = this; model().controls.show(function() { player.play(); self.stop(); }); },
            subtitle = function(s, pause) { model().subtitle = s + model().controls.html(); layout.invalidate(); if (pause === undefined) { model().controls.show() }; };

        //------------------------------
        // Title
        //------------------------------
        frame.after(1, function () {
            model().clear();
            layout.invalidate();
        })
            .after(500, function () {
                frame.model().title = '<h2 style="visibility:visible">Accept Phase</h1>'
                    + '<br/>' + frame.model().controls.html();
                layout.invalidate();
            })
            .after(200, wait).indefinite()
            .after(500, function () {
                model().title = "";
                layout.invalidate();
            })

            //------------------------------
            // Initialization
            //------------------------------
            .after(10, function () {
                model().nodes.create("P");
                node("P")._state = "proposer";
                node("P")._proposalNo += 1;
                node("P")._log.push(new Proposal(model(), 0, 0, "SET 5"));

                model().nodes.create("A");
                node("A")._state = "acceptor";
                node("A")._proposalNo += 1;

                model().nodes.create("B");
                node("B")._state = "acceptor";
                node("B")._proposalNo += 1;

                model().nodes.create("C");
                node("C")._state = "acceptor";
                node("C")._proposalNo += 1;

                frame.model().clients.create("X");
                client("X")._value = "5";
            })
            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>...The Accept phase is the real negotiation phase of command.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(10, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>The Proposer broadcasts the command to all Acceptors through the <em>Accept</em> message in the phase.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(1000, function () {
                model().send(node("P"), node("A"), {type:"AEREQ"}, function () {
                    layout.invalidate();
                });
                model().send(node("P"), node("B"), {type:"AEREQ"}, function () {
                    layout.invalidate();
                });
                model().send(node("P"), node("C"), {type:"AEREQ"}, function () {
                    layout.invalidate();
                });
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>The acceptor judges whether to approve the <em>Accept</em> message according to the ProposalNo.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>If local.ProposalNo ≤ msg.ProposalNo, the Acceptor approves the <em>Accept</em> message.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, function () {
                node("A")._log.push(new Proposal(model(), 0, 0, "SET 5"));
                node("B")._log.push(new Proposal(model(), 0, 0, "SET 5"));
                node("C")._log.push(new Proposal(model(), 0, 0, "SET 5"));
                layout.invalidate();
            })
            .after(800, function () {
                model().send(node("A"), node("P"), {type:"RERSP"}, function () {
                    layout.invalidate();
                });
                model().send(node("B"), node("P"), {type:"RERSP"}, function () {
                    layout.invalidate();
                });
                model().send(node("C"), node("P"), {type:"RERSP"}, function () {
                    layout.invalidate();
                });
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>Once the Proposer has <span style="color:green">majority</span> supporters, the command has reached a consensus.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(50, wait).indefinite()


            .after(300, function () {
                frame.model().clear();
                frame.model().title = '<h2 style="visibility:visible">The end.</h2>';
                layout.invalidate();
            })



        player.play();
    };
});
