"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define([], function () {
    return function (frame) {
        var player = frame.player(),
            layout = frame.layout(),
            model = function () { return frame.model();},
            client = function (id) { return frame.model().clients.find(id);  },
            node = function (id) { return frame.model().nodes.find(id); },
            subtitle = function(s, pause) { model().subtitle = s + model().controls.html(); layout.invalidate(); if (pause === undefined) { model().controls.show() }; },
            wait = function () {
                var self = this;
                model().controls.show(function () {
                    self.stop();
                });
            };


        frame.after(1, function () {
            frame.snapshot();
            frame.model().clear();
            layout.invalidate();
        })
            .after(1000, function () {
                frame.model().title = '<h2 style="visibility:visible">Demonstration</h1>'
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

                model().nodes.create("L1");
                node("L1")._state = "learner";
                node("L1")._proposalNo = 0;
                node("L1")._proposalNoVisible = false;

                model().nodes.create("L2");
                node("L2")._state = "learner";
                node("L2")._proposalNo = 0;
                node("L2")._proposalNoVisible = false;

                model().nodes.create("P");
                node("P")._state = "proposer";
                node("P")._proposalNo = 0;

                model().nodes.create("A");
                node("A")._state = "acceptor";
                node("A")._proposalNo = 0;

                model().nodes.create("B");
                node("B")._state = "acceptor";
                node("B")._proposalNo = 0;

                model().nodes.create("C");
                node("C")._state = "acceptor";
                node("C")._proposalNo = 0;

                frame.model().clients.create("X");
                layout.invalidate();
            })
            .after(800, function () {
                model().loopRunPaxos(client("X"), node("P"), [node("A"), node("B"), node("C")], [node("L1"), node("L2")])
            })
            .then(function () {
                frame.snapshot();
                model().subtitle = '<h2>Do you want stop Paxos.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(10, function (){
                model().stopRunPaxos();
            })

            .after(300, function () {
                frame.model().clear();
                frame.model().title = '<h2 style="visibility:visible">The end.</h2>';
                layout.invalidate();
            });
        player.play();
    };
});
