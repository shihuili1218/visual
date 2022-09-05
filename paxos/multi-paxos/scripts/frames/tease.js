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
            // Livelock
            //------------------------------
            .after(500, function () {
                frame.snapshot();
                frame.model().clear();
                frame.model().title = '<h2 style="visibility:visible">Livelock</h2>'
                    + '<br/>' + frame.model().controls.html();
                layout.invalidate();
            })
            .after(800, function () {
                frame.model().controls.show();
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
                model().subtitle = '<h3>Livelock means that when multiple proposers negotiate proposals at the same time, they interfere with each other, so that no consensus can be reached on any proposal.</h3>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                frame.snapshot();
                model().nodes.create("P1");
                node("P1")._state = "proposer";
                node("P1")._proposalNo = 0;

                model().nodes.create("P2");
                node("P2")._state = "proposer";
                node("P2")._proposalNo = 0;
            })
            .after(10, function () {
                model().subtitle = '<h2>There are two proposers here.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                frame.snapshot();
                model().subtitle = '<h2>P1 initiates the Prepare phase, and ProposalNo is equal to 1.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(10, function () {
                node("P1")._proposalNo += 1;
                model().send(node("P1"), node("A"), {type: "RVREQ"}, function () {
                    node("A")._proposalNo += 1;
                    model().send(node("A"), node("P1"), {type: "RVRSP"}, function () {
                    });
                    layout.invalidate();
                });
                model().send(node("P1"), node("B"), {type: "RVREQ"}, function () {
                    node("B")._proposalNo += 1;
                    model().send(node("B"), node("P1"), {type: "RVRSP"}, function () {
                    });
                    layout.invalidate();
                });
                model().send(node("P1"), node("C"), {type: "RVREQ"}, function () {
                    node("C")._proposalNo += 1;
                    model().send(node("C"), node("P1"), {type: "RVRSP"}, function () {
                    });
                    layout.invalidate();
                });
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                frame.snapshot();
                model().subtitle = '<h2>However, before P1 enters the Accept phase, P2 initiates the Prepare phase.</h2>'
                    + '<h3 style="visibility:hidden; color: #a94442">But those Acceptors will reject the Prepare phase of P2 because P2.ProposalNo is not greater than 1</h3>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(300, function () {
                node("P2")._proposalNo += 1;
                model().send(node("P2"), node("A"), {type: "RVREQ"}, function () {
                });
                model().send(node("P2"), node("B"), {type: "RVREQ"}, function () {
                });
                model().send(node("P2"), node("C"), {type: "RVREQ"}, function () {
                });
                layout.invalidate();
            })
            .after(800, function () {
                layout.fadeIn($(".subtitle h3"));
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                frame.snapshot();
                model().subtitle = '<h2>P2 will restart the Prepare phase and get the support of all Acceptors, and ProposalNo is equal to 2.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(500, function () {
                node("P2")._proposalNo += 1;
                model().send(node("P2"), node("A"), {type: "RVREQ"}, function () {
                    node("A")._proposalNo += 1;
                    model().send(node("A"), node("P2"), {type: "RVRSP"}, function () {
                    });
                    layout.invalidate();
                });
                model().send(node("P2"), node("B"), {type: "RVREQ"}, function () {
                    node("B")._proposalNo += 1;
                    model().send(node("B"), node("P2"), {type: "RVRSP"}, function () {
                    });
                    layout.invalidate();
                });
                model().send(node("P2"), node("C"), {type: "RVREQ"}, function () {
                    node("C")._proposalNo += 1;
                    model().send(node("C"), node("P2"), {type: "RVRSP"}, function () {
                    });
                    layout.invalidate();
                });
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                frame.snapshot();
                model().subtitle = '<h2>Next, P1 enters the Accept phase, but because the ProposalNo of these Acceptors is equal to 2, P1 will be rejected.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(500, function () {
                model().send(node("P1"), node("A"), {type: "AEREQ"}, function () {
                });
                model().send(node("P1"), node("B"), {type: "AEREQ"}, function () {
                });
                model().send(node("P1"), node("C"), {type: "AEREQ"}, function () {
                });
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                frame.snapshot();
                model().subtitle = '<h2>So, P1 will restart the Prepare phase.</h2>' +
                    '<h3 style="visibility:hidden;">Get the support of all Acceptors, and ProposalNo is equal to 3.</h3>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(500, function () {
                node("P1")._proposalNo += 1;
                model().send(node("P1"), node("A"), {type: "RVREQ"}, function () {
                });
                model().send(node("P1"), node("B"), {type: "RVREQ"}, function () {
                });
                model().send(node("P1"), node("C"), {type: "RVREQ"}, function () {
                });
                layout.invalidate();
            })
            .after(1500, function () {
                node("P1")._proposalNo += 1;
                model().send(node("P1"), node("A"), {type: "RVREQ"}, function () {
                    node("A")._proposalNo += 1;
                    model().send(node("A"), node("P1"), {type: "RVRSP"}, function () {
                    });
                    layout.invalidate();
                });
                model().send(node("P1"), node("B"), {type: "RVREQ"}, function () {
                    node("B")._proposalNo += 1;
                    model().send(node("B"), node("P1"), {type: "RVRSP"}, function () {
                    });
                    layout.invalidate();
                });
                model().send(node("P1"), node("C"), {type: "RVREQ"}, function () {
                    node("C")._proposalNo += 1;
                    model().send(node("C"), node("P1"), {type: "RVRSP"}, function () {
                    });
                    layout.invalidate();
                });
                layout.invalidate();
            })
            .after(1000, function () {
                layout.fadeIn($(".subtitle h3"));
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                frame.snapshot();
                model().subtitle = '<h2>Then, P2 enters the Accept phase, and P2 will be rejected by all acceptors like P1.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(50, function () {
                model().send(node("P2"), node("A"), {type: "AEREQ"}, function () {
                });
                model().send(node("P2"), node("B"), {type: "AEREQ"}, function () {
                });
                model().send(node("P2"), node("C"), {type: "AEREQ"}, function () {
                });
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                frame.snapshot();
                model().subtitle = '<h2>So P2 needs to restart the Prepare phase, which will lead to the rejection of P1\'s Accept phase.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                frame.snapshot();
                model().subtitle = '<h2>Move in circles<br/>In the end, there was no consensus on any proposal, as shown in the figure.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(200, function () {
                frame.model().clients.removeAll();
                frame.model().nodes.removeAll();
                frame.model().title = '<image src="resources/livelock.png"/>';
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            //------------------------------
            // Too many message interactions
            //------------------------------
            .after(500, function () {
                frame.snapshot();
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
                frame.snapshot();
                model().subtitle = '<h2>To address this issue, we restate the meaning of the Prepare phase.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                frame.snapshot();
                model().subtitle = '<h2>It can be found that ProposalNo is incremented every time a round of Prepare phase is performed.</h2>'
                    + '<h3 style="visibility:hidden; color: #a94442">In the case of no Proposal conflict, proposalNo is incremented continuously.</h3>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(10, function () {
                layout.fadeIn($(".subtitle h3"));
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                frame.snapshot();
                model().subtitle = '<h3>In other words, if ProposalNo is not incremented in the Prepare phase, the ProposalNo promised by the Acceptor will not change, and the Accept phase can still be approved by the Acceptor.</h3>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()
            .after(10, function () {
                model().stopRunPaxos();
                frame.model().clear();
                model().subtitle = '<h2>Then we imagine that after a round of Prepare, subsequent negotiations can directly enter the Accept phase.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(200, function () {
                frame.model().title = '<image src="resources/direct-accept.png"/>';
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .then(function () {
                player.next();
            })

        player.play();
    };
});
