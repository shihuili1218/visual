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
                frame.model().title = '<h2 style="visibility:visible">Prepare Phase</h1>'
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

                model().nodes.create("A");
                node("A")._state = "acceptor";

                model().nodes.create("B");
                node("B")._state = "acceptor";

                model().nodes.create("C");
                node("C")._state = "acceptor";
            })
            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>Now, We have three Acceptors and one Proposer.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                frame.model().clients.create("X");
                model().subtitle = '<h2>The client sends a proposal to the Proposer.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(1000, function () {
                client("X")._value = "5";
                layout.invalidate();
            })
            .after(500, function () {
                model().send(client("X"), node("P"), null, function () {
                    node("P")._log.push(new Proposal(model(), 0, 0, "SET 5"));
                    layout.invalidate();
                });
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>The Proposer will negotiate the ProposalNo with all Acceptors through the <em>Prepare</em> message.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>It is worth noting that <em>Prepare</em> messages only carry ProposalNo, not command.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>Proposer increments ProposalNo and broadcasts <em>Prepare</em> message.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })

            .after(500, function () {
                node("P")._proposalNo += 1;
                layout.invalidate();
            })
            .after(500, function () {
                model().send(node("P"), node("A"), {type:"RVREQ"}, function () {
                    layout.invalidate();
                });
                model().send(node("P"), node("B"), {type:"RVREQ"}, function () {
                    layout.invalidate();
                });
                model().send(node("P"), node("C"), {type:"RVREQ"}, function () {
                    layout.invalidate();
                });
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>The acceptor judges whether to approve the <em>Prepare</em> message according to the ProposalNo.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>If local.ProposalNo < msg.ProposalNo, the Acceptor approves the <em>Prepare</em> message.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, function () {
                node("A")._proposalNo += 1
                node("B")._proposalNo += 1
                node("C")._proposalNo += 1
                layout.invalidate();
            })
            .after(800, function () {
                model().send(node("A"), node("P"), {type:"RVRSP"}, function () {
                    layout.invalidate();
                });
                model().send(node("B"), node("P"), {type:"RVRSP"}, function () {
                    layout.invalidate();
                });
                model().send(node("C"), node("P"), {type:"RVRSP"}, function () {
                    layout.invalidate();
                });
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>Once the Proposer has <span style="color:green">majority</span> supporters, it can enter the Accept Phase.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(50, wait).indefinite()

            .then(function () {
                player.next();
            })

        player.play();
    };
});
