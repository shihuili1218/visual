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
                client("X")._value = "β";
                layout.invalidate();
            })
            .after(500, function () {
                model().send(client("X"), node("P"), null, function () {
                    node("P")._log.push(new Proposal(model(), 0, 0, "β"));
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
                model().send(node("P"), node("A"), {type: "RVREQ"}, function () {
                    layout.invalidate();
                });
                model().send(node("P"), node("B"), {type: "RVREQ"}, function () {
                    layout.invalidate();
                });
                model().send(node("P"), node("C"), {type: "RVREQ"}, function () {
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
                node("A")._proposalNo += 1;
                node("B")._proposalNo += 1;
                node("C")._proposalNo += 1;
                layout.invalidate();
            })
            .after(800, function () {
                model().send(node("A"), node("P"), {type: "RVRSP"}, function () {
                    layout.invalidate();
                });
                model().send(node("B"), node("P"), {type: "RVRSP"}, function () {
                    layout.invalidate();
                });
                model().send(node("C"), node("P"), {type: "RVRSP"}, function () {
                    layout.invalidate();
                });
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>Once the Proposer has <span style="color:green">majority</span> supporters, the Prepare phase is completed.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(50, wait).indefinite()

            // ----------------------------------------------------------------------
            // prepare obtain Proposal that may reach consensus in the previous round
            // ----------------------------------------------------------------------
            .after(300, function () {
                frame.model().clear();
                frame.model().title = '<h2 style="visibility:visible">Prepare phase is also used to collect proposals that may reach consensus</h2>'
                    + '<br/>' + frame.model().controls.html();
                layout.invalidate();
            })
            .after(800, function () {
                frame.model().controls.show();
            })

            .after(10, function () {
                frame.model().clear();

                model().nodes.create("P");
                node("P")._state = "proposer";

                model().nodes.create("A");
                node("A")._state = "acceptor";

                model().nodes.create("B");
                node("B")._proposalNo += 1;
                node("B")._state = "acceptor";

                model().nodes.create("C");
                node("C")._state = "acceptor";
                node("C")._proposalNo += 1;
                node("C")._log.push(new Proposal(model(), 0, 0, "α"));
            })
            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>Acceptor C previously approved α.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(10, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>The client sends a request for λ.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(10, function () {
                frame.model().clients.create("X");
                client("X")._value = "λ";
                layout.invalidate();
            })
            .after(800, function () {
                model().send(client("X"), node("P"), null, function () {
                    node("P")._proposalNo += 1;
                    node("P")._log.push(new Proposal(model(), 0, 0, "λ"));

                    model().send(node("P"), node("A"), {type: "RVREQ"}, function () {
                        node("A")._proposalNo += 1;
                        model().send(node("A"), node("P"), {type: "RVRSP"}, function () {
                            layout.invalidate();
                        });
                        layout.invalidate();
                    });
                    model().send(node("P"), node("B"), {type: "RVREQ"}, function () {
                        // todo Prompt to reject the reply through the dialog box
                        layout.invalidate();
                    });
                    model().send(node("P"), node("C"), {type: "RVREQ"}, function () {
                        // todo Prompt to reject the reply through the dialog box
                        layout.invalidate();
                    });

                    layout.invalidate();
                });
                layout.invalidate();
            })
            .after(10, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>Acceptor B/C refused to reply because the ProposalNo was higher.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(10, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>Proposer has no majority supporters, so increase ProposalNo and rebroadcast the <em>Prepare</em> message.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(500, function () {
                node("P")._proposalNo += 1;
                layout.invalidate();
            })
            .after(500, function () {
                model().send(node("P"), node("A"), {type: "RVREQ"}, function () {
                    node("A")._proposalNo += 1;
                    layout.invalidate();
                });
                model().send(node("P"), node("B"), {type: "RVREQ"}, function () {
                    node("B")._proposalNo += 1;
                    layout.invalidate();
                });
                model().send(node("P"), node("C"), {type: "RVREQ"}, function () {
                    node("C")._proposalNo += 1;
                    layout.invalidate();
                });
                layout.invalidate();
            })
            .after(100, wait).indefinite()

            .after(100, function () {
                frame.snapshot();
                model().subtitle = '<h2>Acceptor C will carry α in the response.</h2>'
                    + '<h2 id="proposer-next" style="visibility:hidden;">Then, Proposer needs to use α to enter the Accept phase.</h2>'
                    + model().controls.html();
                layout.invalidate();
            })
            .after(800, function () {
                model().send(node("A"), node("P"), {type: "RVRSP"}, function () {
                    layout.invalidate();
                });
                model().send(node("B"), node("P"), {type: "RVRSP"}, function () {
                    layout.invalidate();
                });
                // todo msg 携带 α
                model().send(node("C"), node("P"), {type: "RVRSP"}, function () {
                    node("P")._log=[new Proposal(model(), 0, 0, "α")];
                    layout.invalidate();
                });
            })
            .after(10, function () {
                layout.fadeIn($(".subtitle #proposer-next"));
            })
            .after(100, wait).indefinite()

            .then(function () {
                player.next();
            })

        player.play();
    };
});
