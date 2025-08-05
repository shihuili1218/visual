"use strict";
/*jslint browser: true, nomen: true*/
/*global define, d3, tsld*/

define([], function () {
    function Transaction(model, zxid, epoch, command, callback) {
        playback.DataObject.call(this, model);
        this.zxid = zxid;
        this.epoch = epoch;
        this.command = command;
        this.callback = (callback !== undefined ? callback : null);
    }

    Transaction.prototype = new playback.DataObject();
    Transaction.prototype.constructor = Transaction;

    /**
     * Determines the bounding box of the log entry.
     */
    Transaction.prototype.bbox = function () {
        return tsld.bbox(this.y, this.x + this.w, this.y + this.h, this.x);
    };

    /**
     * Applies the transaction to a node.
     */
    Transaction.prototype.applyTo = function (node) {
        var m = this.command.match(/^(\w+)\((.+)\)$/);
        if (m) {
            switch (m[1]) {
            case "write":
                var keyValue = m[2].split('=');
                if (keyValue.length === 2) {
                    node._value = keyValue[1];
                }
                break;
            case "create":
                // Handle create operations
                break;
            case "delete":
                // Handle delete operations
                break;
            }
        }
        
        if (this.callback !== null) {
            this.callback();
        }
    };

    Transaction.prototype.clone = function (model) {
        var clone = new Transaction(model, this.zxid, this.epoch, this.command);
        clone.zxid = this.zxid;
        clone.epoch = this.epoch;
        clone.command = this.command;
        return clone;
    };

    return Transaction;
});