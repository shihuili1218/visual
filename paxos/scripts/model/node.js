"use strict";
/*jslint browser: true, nomen: true*/
/*global define, playback, tsld*/

define(["./log_entry"], function (Proposal) {
    function Node(model, id) {
        playback.DataObject.call(this, model);
        this.id = id;
        this._state = "acceptor";
        this._value = "";
        this._proposalNo = 0;
        this._log = [];
        this._nameVisible = true;
        this._proposalNoVisible = true;
    }

    Node.prototype = new playback.DataObject();
    Node.prototype.constructor = Node;

    /**
     * Initializes the node to a acceptor.
     */
    Node.prototype.init = function () {
        this.state("acceptor");
        return this;
    };

    /**
     * Sets or retrieves the model.
     */
    Node.prototype.model = function (value) {
        if (arguments.length === 0) {
            return this._model;
        }
        this._model = value;
        this._log.forEach(function (entry) {
            entry.model(value)
        });
        return this;
    };

    /**
     * Retrieve the current node value.
     */
    Node.prototype.value = function () {
        return this._value;
    };

    Node.prototype.proposalNo = function () {
        return this._proposalNo;
    };

    /**
     * Retrieves the log entries.
     */
    Node.prototype.log = function () {
        return this._log;
    };

    /**
     * Sets or retrieves the node state.
     */
    Node.prototype.state = function (value) {
        var prevValue = this._state;
        if (arguments.length === 0) {
            return this._state;
        }
        this._state = value;

        // Begin event loop for this node.
        switch (this._state) {
            case "proposer":
                break;
            case "acceptor":
                break;
            case "learner":
                break;
            case "stopped":
                break;
            default:
                throw new Error("Invalid node state: " + this._state);
        }

        return this;
    };

    /**
     * Determines the bounding box of the node and its log.
     */
    Node.prototype.bbox = function () {
        var bbox = tsld.bbox(this.y - this.r, this.x + this.r, this.y + this.r, this.x - this.r);
        bbox = bbox.union(this.logbbox());
        return bbox;
    };

    Node.prototype.logbbox = function () {
        var i, bbox;
        if (this._log.length === 0) {
            return null;
        }
        bbox = this._log[0].bbox();
        for (i = 1; i < this._log.length; i += 1) {
            bbox = this._log[i].bbox();
        }
        return bbox;
    };

    /**
     * Executes a given command.
     */
    Node.prototype.execute = function (command, callback) {
        var entry,
            prevIndex = (this._log.length > 0 ? this._log[this._log.length - 1].index : 0);
        if (this.state() !== "proposer") {
            return false;
        }

        // Append to log.
        this._log.push(new Proposal(this.model(), prevIndex + 1, this.proposalNo(), command, callback));
    };

    //----------------------------------
    // Utility
    //----------------------------------
    /**
     * Dispatches the event from the node and from the model.
     */
    Node.prototype.dispatchEvent = function (event) {
        playback.DataObject.prototype.dispatchEvent.call(this, event);
        this.model().dispatchEvent(event);
    };

    /**
     * Clones the node.
     */
    Node.prototype.clone = function (model) {
        var clone = new Node(model, this.id);
        clone._state = this._state;
        clone._log = this._log.map(function (entry) {
            return entry.clone(model);
        });
        return clone;
    };

    return Node;
});
