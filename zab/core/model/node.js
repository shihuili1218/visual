"use strict";
/*jslint browser: true, nomen: true*/
/*global define, playback, tsld*/

define(["./log_entry"], function (Transaction) {
    function Node(model, id) {
        playback.DataObject.call(this, model);
        this.id = id;
        this._state = "following";
        this._value = "";
        this.zxid = 0;
        this.epoch = 1;
        this._log = [];
        this._nameVisible = true;
        this._zxidVisible = true;
    }

    Node.prototype = new playback.DataObject();
    Node.prototype.constructor = Node;

    /**
     * Initializes the node to a follower.
     */
    Node.prototype.init = function () {
        this.state("following");
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
            prevZxid = (this._log.length > 0 ? this._log[this._log.length - 1].zxid : this.zxid);
        if (this.state() !== "leading") {
            return false;
        }

        // Append to log.
        this._log.push(new Transaction(this.model(), prevZxid + 1, this.epoch, command, callback));
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
        clone.zxid = this.zxid;
        clone.epoch = this.epoch;
        clone._log = this._log.map(function (entry) {
            return entry.clone(model);
        });
        return clone;
    };

    return Node;
});