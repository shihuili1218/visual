"use strict";
/*jslint browser: true, nomen: true*/
/*global define, playback, tsld*/

define(["./controls", "./client", "./message", "./node", "./log_entry"], function (Controls, Client, Message, Node, Proposal) {
    function Model() {
        playback.Model.call(this);

        this.title = "";
        this.subtitle = "";
        this.defaultNetworkLatency = Model.DEFAULT_NETWORK_LATENCY;
        this.controls = new Controls(this);
        this.nodes = new playback.Set(this, Node);
        this.clients = new playback.Set(this, Client);
        this.messages = new playback.Set(this, Message);
        this.nodeLabelVisible = true;
        this.latencies = {};
        this.bbox = tsld.bbox(0, 100, 100, 0);
        this.domains = {
            x: [0, 100],
            y: [0, 100],
        };
        this._cyclePaxosTimer = null;
        this.addEventListener("flush", this.onFlush);
    }

    Model.prototype = new playback.Model();
    Model.prototype.constructor = Model;

    /**
     * The ratio of simulation time to wall clock time.
     */
    Model.SIMULATION_RATE = (1 / 50);

    /**
     * The default network latency between two nodes if not set.
     */
    Model.DEFAULT_NETWORK_LATENCY = 20 / Model.SIMULATION_RATE;

    /**
     * Finds either a node or client by id.
     */
    Model.prototype.find = function (id) {
        var ret = null;
        if (ret === null) {
            ret = this.nodes.find(id);
        }
        if (ret === null) {
            ret = this.clients.find(id);
        }
        return ret;
    };

    /**
     * Performs clean up of the model at time t.
     */
    Model.prototype.tick = function (t) {
        // Remove messages that have already been received.
        this.messages.filter(function (message) {
            return (message.recvTime > t);
        });
    };

    /**
     * Sends a message between two nodes if latency is greater than zero.
     *
     * @return {Message}
     */
    Model.prototype.send = function (source, target, payload, callback) {
        var message,
            source = (typeof (source) == "string" ? source : source.id),
            target = (typeof (target) == "string" ? target : target.id),
            latency = this.latency(source, target);

        if (!(latency > 0)) {
            return null;
        }

        message = this.messages.create();
        message.payload = (payload !== undefined ? payload : null);
        message.source = source;
        message.target = target;
        message.sendTime = this.playhead();
        message.recvTime = message.sendTime + latency;

        if (callback !== undefined && callback !== null) {
            this.frame().after(latency, callback);
        }

        return message;
    };

    /**
     * Retrieves the latency between two node ids.
     */
    Model.prototype.latency = function (a, b, latency) {
        var ret,
            x = (a < b ? a : b),
            y = (a < b ? b : a),
            key = [x, y].join("|");
        if (arguments.length === 2) {
            ret = this.latencies[key];
            return (ret !== undefined ? ret : this.defaultNetworkLatency);
        }
        this.latencies[key] = latency;
        return this;
    };

    /**
     * Zooms in on a given node or zooms out to full screen.
     *
     * @param {Array}
     */
    Model.prototype.zoom = function (nodes) {
        var i, node,
            bbox = null;

        // Passing in a null node clears the zoom.
        if (nodes === null || nodes === undefined || nodes.length === 0) {
            bbox = tsld.bbox(0, 100, 100, 0);
        } else {
            // Find the x and y ranges to constrain the zoom bbox.
            bbox = nodes[0].bbox();
            for (i = 1; i < nodes.length; i += 1) {
                bbox = bbox.union(nodes[i].bbox());
            }
        }

        this.bbox = bbox;
        this.domains.x = [bbox.left, bbox.right];
        this.domains.y = [bbox.top, bbox.bottom];
    };

    /**
     * Removes all data from the model.
     */
    Model.prototype.clear = function () {
        this.title = this.subtitle = "";
        this.nodes.removeAll();
        this.clients.removeAll();
        this.messages.removeAll();
        this.latencies = {};
    };


    Model.prototype.randomProposal = function (len) {
        if (arguments.length === 0) {
            len = 1;
        }
        const syb = ["α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ", "ν", "ξ", "ο", "π", "ρ", "σ", "τ", "υ", "φ", "χ", "ψ", "ω"];
        let result = "";
        for (let i = 0; i < len; i++) {
            const index = Math.floor(Math.random() * syb.length);
            result += syb[index];
        }
        return result;
    }

    /**
     * Cycle Paxos.
     */
    Model.prototype.loopRunPaxos = function (client, proposer, acceptors, learners) {
        var self = this, timeout = 5000;

        if (this._cyclePaxosTimer === null) {
            this.stopRunPaxos();
            this._cyclePaxosTimer = this.frame().timer(function () {
                self.send(client, proposer, null, function () {
                    self.sendPrepareRequests(client, proposer, acceptors, learners, self.randomProposal(3));
                });
            }).interval(timeout);
        }
    };

    /**
     * Clears the CyclePaxosTimer.
     */
    Model.prototype.stopRunPaxos = function () {
        this.frame().clearTimer(this._cyclePaxosTimer);
        this._cyclePaxosTimer = null;
    };

    Model.prototype.sendPrepareRequests = function (client, proposer, acceptors, learners, proposalVal) {
        var self = this,
            success = 0,
            failure = 0,
            next = true,
            grant = Math.floor(acceptors.length / 2) + 1;

        proposer._proposalNo += 1;
        var proposal = new Proposal(this, proposer._proposalNo, proposer._proposalNo, proposalVal);
        proposer._log.push(proposal);
        proposer.dispatchChangeEvent("flush");

        acceptors.forEach(function (node) {
            self.send(proposer, node, {type: "RVREQ"}, function () {
                if (proposal.term > node._proposalNo) {
                    node._proposalNo = proposal.term;
                    self.send(node, proposer, {type: "RVRSP"}, function () {
                        success++;
                        if (success >= grant && next) {
                            next = false;
                            self.sendAcceptRequests(client, proposer, acceptors, learners, proposal);
                        }
                    });
                } else {
                    failure++;
                    if (failure >= grant && next) {
                        next = false;
                        self.sendPrepareRequests(client, proposer, acceptors, learners, proposal.command);
                    }
                }
                proposer.dispatchChangeEvent("flush");
            });
        });
    };

    Model.prototype.sendAcceptRequests = function (client, proposer, acceptors, learners, proposal) {
        var self = this, success = 0, failure = 0, next = true, grant = Math.floor(acceptors.length / 2) + 1;
        acceptors.forEach(function (node) {
            self.send(proposer, node, {type: "AEREQ"}, function () {
                if (proposal.term >= node._proposalNo) {
                    node._log.push(proposal);
                    self.send(node, proposer, {type: "AERSP"}, function () {
                        success++;
                        self.send(proposer, client, null, function () {
                        });
                        if (success >= grant && next) {
                            next = false;
                            self.sendLearnRequests(proposer, acceptors, learners, proposal);
                        }
                    });
                } else {
                    failure++;
                    if (failure >= grant) {
                        next = false;
                        self.sendPrepareRequests(client, proposer, acceptors, learners, proposal.command);
                    }
                }
                proposer.dispatchChangeEvent("flush");
            });
        });
    };

    Model.prototype.sendLearnRequests = function (proposer, acceptors, learners, proposal) {
        var self = this;

        proposer._log.splice(proposer._log.indexOf(proposal), 1);
        acceptors.forEach(function (acc) {
            acc._log.splice(acc._log.indexOf(proposal), 1);
        });

        learners.forEach(function (node) {
            self.send(proposer, node, {type: "LNREQ"}, function () {
                if (node._log.length === 4) {
                    node._log = [];
                }
                node._log.push(proposal);
                proposer.dispatchChangeEvent("flush");
            });
        });
    };


    Model.prototype.onFlush = function (event) {
        event.target.layout().invalidate();
    };

    /**
     * Clones the model.
     */
    Model.prototype.clone = function () {
        var i, key, clone = new Model();
        clone._player = this._player;
        clone.title = this.title;
        clone.subtitle = this.subtitle;
        clone.nodes = this.nodes.clone(clone);
        clone.clients = this.clients.clone(clone);
        clone.messages = this.messages.clone(clone);
        clone.bbox = this.bbox;
        clone.domains = {
            x: this.domains.x,
            y: this.domains.y,
        };
        for (key in this.latencies) {
            clone.latencies[key] = this.latencies[key];
        }
        return clone;
    };

    return Model;
});
