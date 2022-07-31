"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define(["../../../core/model/log_entry"], function (Proposal) {
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
            }
        ;

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

            //------------------------------
            // Too many message interactions
            //------------------------------
            .after(500, function () {
                frame.model().clear();
                frame.model().title = '<h2 style="visibility:visible">Too many message interactions</h2>'
                    + '<br/>' + frame.model().controls.html();
                layout.invalidate();
            })
            .after(800, function () {
                frame.model().controls.show();
            })
            .after(500, function () {
                model().title = "";
                layout.invalidate();
            })

            //------------------------------
            // Looking back at Paxos
            //------------------------------
            .after(10, function () {
                frame.snapshot();

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
                model().subtitle = '<h2>Looking back at Paxos, a proposal to reach consensus always requires performing the Prepare and Accept phases, which are very inefficient.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                model().stopRunPaxos();
            })
            .after(10, function () {
                model().subtitle = '<h2>To address this issue, we restate the meaning of the Prepare phase.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(10, function () {
                document.getElementById("commentary").innerHTML = "<div id=\"intro0\" class=\"svg intro\" style=\"height: 160px\"></div>";
                model().subtitle = '<h2>sssss.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })

            .after(100, wait).indefinite()




            //------------------------------
            // Livelock
            //------------------------------
            .after(500, function () {
                frame.model().clear();
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
