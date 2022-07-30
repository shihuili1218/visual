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
            wait = function() { var self = this; model().controls.show(function() { player.play(); self.stop(); }); },
            subtitle = function(s, pause) { model().subtitle = s + model().controls.html(); layout.invalidate(); if (pause === undefined) { model().controls.show() }; };

        //------------------------------
        // Title
        //------------------------------
        frame.after(1, function () {
            model().clear();
            layout.invalidate();
        })
            .after(1000, function () {
                frame.model().title = '<h2 style="visibility:visible">Learn Phase</h1>'
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
                node("P")._proposalNo = 2;
                node("P")._log.push(new Proposal(model(), 0, 0, "α"));

                model().nodes.create("A");
                node("A")._state = "acceptor";
                node("A")._proposalNo = 2;
                node("A")._log.push(new Proposal(model(), 0, 0, "α"));

                model().nodes.create("B");
                node("B")._state = "acceptor";
                node("B")._proposalNo = 2;
                node("B")._log.push(new Proposal(model(), 0, 0, "α"));

                model().nodes.create("C");
                node("C")._state = "acceptor";
                node("C")._proposalNo = 2;
                node("C")._log.push(new Proposal(model(), 0, 0, "α"));

                frame.model().clients.create("X");
                client("X")._value = "α";
            })
            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>...Then, α We have reached a consensus.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(10, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>The Proposer broadcasts α to all Learners through the <em>Learn</em> message.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(500, function () {
                model().clients.remove(client("X"));
                model().nodes.remove(node("A"));
                model().nodes.remove(node("B"));
                model().nodes.remove(node("C"));
                layout.invalidate();
            })
            .after(1000, function () {
                model().nodes.create("L1");
                model().nodes.create("L2");
                node("L1")._proposalNoVisible = false;
                node("L2")._proposalNoVisible = false;
                node("L1")._state = "learner";
                node("L2")._state = "learner";
                layout.invalidate();
            })
            .after(1000, function () {
                model().send(node("P"), node("L1"), {type: "LNREQ"}, function () {
                    node("L1")._log.push(new Proposal(model(), 0, 0, "α"));
                    layout.invalidate();
                });
                model().send(node("P"), node("L2"), {type: "LNREQ"}, function () {
                    node("L2")._log.push(new Proposal(model(), 0, 0, "α"));
                    layout.invalidate();
                });
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>It is worth noting that any number of <em>Learn</em> messages can be lost without compromising security.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(300, function () {
                frame.model().clear();
                frame.model().title = '<h2 style="visibility:visible">In addition, the Learn phase can propagate proposals in any way, for example:</h2>'
                    + '<h3 id="gossip" style="visibility:hidden">Gossip</h3>'
                    + '<h3 id="mainLearner" style="visibility:hidden">Elect the master Learner to instead the Proposer broadcast Proposal</h3>'
                    + '<h3 id="etc" style="visibility:hidden">etc...</h3>'
                    + '<br/>' + frame.model().controls.html();
                layout.invalidate();
            })
            .after(1000, function () {
                layout.fadeIn($(".title #gossip"));
            })
            .after(1000, function () {
                layout.fadeIn($(".title #mainLearner"));
            })
            .after(1000, function () {
                layout.fadeIn($(".title #etc"));
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

        player.play();
    };
});
