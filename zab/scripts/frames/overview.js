"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define([], function () {
    return function (frame) {
        var player = frame.player(),
            layout = frame.layout(),
            model = function() { return frame.model(); };

        frame.after(1, function () {
            model().clear();
            layout.invalidate();
        })

        .after(100, function () {
            model().title = '<h2 style="visibility:visible">ZAB Algorithm Overview</h2>';
            layout.invalidate();
        })

        .after(1000, function () {
            // Create nodes for ZAB cluster
            var nodes = [];
            nodes.push(model().nodes.create("node1"));
            nodes.push(model().nodes.create("node2"));
            nodes.push(model().nodes.create("node3"));
            
            // Position nodes
            nodes[0].x = 30; nodes[0].y = 50; nodes[0].state = "follower";
            nodes[1].x = 50; nodes[1].y = 30; nodes[1].state = "leader";
            nodes[2].x = 70; nodes[2].y = 50; nodes[2].state = "follower";
            
            // Set initial leader
            nodes[1].state = "leader";
            nodes[1].zxid = 100;
            nodes[0].zxid = 99;
            nodes[2].zxid = 98;
            
            layout.invalidate();
        })

        .after(1000, function () {
            model().subtitle = '<p>ZAB operates in three main phases:</p>'
                             + '<p><strong>1. Leader Election:</strong> Elect a single leader</p>'
                             + '<p><strong>2. Discovery:</strong> Synchronize state</p>'
                             + '<p><strong>3. Broadcast:</strong> Process transactions</p>';
            layout.invalidate();
        })

        .after(500, function () {
            frame.model().controls.show();
        });
    };
});