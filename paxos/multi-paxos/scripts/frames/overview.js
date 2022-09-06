"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define(["../../../core/model/log_entry"], function (Proposal) {
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

                model().nodes.create("L");
                node("L")._state = "learner";
                node("L")._proposalNoVisible = false;
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
                client("X")._value = "X";
            })
            .after(10, function () {
                model().subtitle = '<h2>Like Paxos, Proposer initiated the Prepare phase</h2>' +
                    '<h3 style="visibility: hidden;">and obtained the support of the majority Acceptor.</h3>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                frame.snapshot();
                model().send(client("X"), node("P1"), null, function () {
                    node("P1")._proposalNo += 1;
                    var proposal = new Proposal(this, node("P1")._proposalNo, node("P1")._proposalNo, "δεζ");
                    node("P1")._log.push(proposal);
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
                });
            })
            .after(3000, function () {
                layout.fadeIn($(".subtitle h3"));
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                frame.snapshot();
                model().subtitle = '<h2>Like Paxos, Proposer initiated the Accept phase</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(10, function () {
                frame.snapshot();
                var proposal = new Proposal(this, node("P1")._proposalNo, node("P1")._proposalNo, "δεζ");

                model().send(node("P1"), node("A"), {type: "AEREQ"}, function () {
                    node("A")._log.push(proposal);
                    model().send(node("A"), node("P1"), {type: "AERSP"}, function () {
                    });
                    layout.invalidate();
                });
                model().send(node("P1"), node("B"), {type: "AEREQ"}, function () {
                    node("B")._log.push(proposal);
                    model().send(node("B"), node("P1"), {type: "AERSP"}, function () {
                    });
                    layout.invalidate();
                });
                model().send(node("P1"), node("C"), {type: "AEREQ"}, function () {
                    node("C")._log.push(proposal);
                    model().send(node("C"), node("P1"), {type: "AERSP"}, function () {
                    });
                    layout.invalidate();
                });
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                frame.snapshot();
                model().subtitle = '<h2>Next, Proposer can proceed directly to the Accept phase and skip the Prepare phase</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(10, function () {
                model().loopRunMultiPaxos(client("X"), node("P1"), [node("A"), node("B"), node("C")], [node("L")])
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                frame.snapshot();
                model().subtitle = '<h2>Until a Proposer fails to get a majority, <br/>e.g. another Proposer launches the Prepare phase</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                frame.snapshot();
                model().subtitle = '<h2>Let\'s pause Multi-Paxos first</h2>'
                    + model().controls.html();
                layout.invalidate();
                model().stopRunPaxos();
            })
            .after(1500, function () {
                node("P1")._log = [];
                node("A")._log = [];
                node("B")._log = [];
                node("C")._log = [];
                node("L")._log = [];
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                frame.snapshot();
                model().subtitle = '<h2>A new Proposer P2 is added, and P2.ProposalNo=P1.ProposalNo</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(800, function () {
                model().nodes.create("P2");
                node("P2")._state = "proposer";
                node("P2")._proposalNo = node("P1")._proposalNo;

                frame.model().clients.create("Y");
                client("Y")._value = "Y";
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(10, function () {
                frame.snapshot();
                model().subtitle = '<h2>Client Y makes a request to P2, which interrupts the Accept phase of P1</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(800, function () {
                model().send(client("Y"), node("P2"), null, function () {
                    node("P2")._proposalNo += 1;
                    var proposal = new Proposal(this, node("P2")._proposalNo, node("P2")._proposalNo, "λακ");
                    node("P2")._log.push(proposal);
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
                });
                layout.invalidate();
            })
            .after(100, wait).indefinite()


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
