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
            model().title = '<h2 style="visibility:visible">Recovery Process</h2>';
            layout.invalidate();
        })

        .after(500, function () {
            // Create nodes - leader has failed
            var nodes = [];
            nodes.push(model().nodes.create("node1"));
            nodes.push(model().nodes.create("node2"));
            nodes.push(model().nodes.create("node3"));
            
            // Position nodes
            nodes[0].x = 30; nodes[0].y = 50; nodes[0].state = "following";
            nodes[1].x = 50; nodes[1].y = 30; nodes[1].state = "failed";
            nodes[2].x = 70; nodes[2].y = 50; nodes[2].state = "following";
            
            // Set different ZXIDs to show inconsistency
            nodes[0].zxid = 101; nodes[0].epoch = 1;
            nodes[1].zxid = 103; nodes[1].epoch = 1; // Failed leader had more transactions
            nodes[2].zxid = 100; nodes[2].epoch = 1;
            
            layout.invalidate();
        })

        .after(1000, function () {
            model().subtitle = '<p>Leader has failed! Nodes have inconsistent state</p>'
                             + '<p>Node 1 ZXID: 101, Node 3 ZXID: 100</p>';
            layout.invalidate();
        })

        .after(2000, function () {
            // Start new election
            var nodes = model().nodes.nodes;
            nodes[0].state = "looking";
            nodes[2].state = "looking";
            
            model().subtitle = '<p>Surviving nodes enter LOOKING state for new election</p>';
            layout.invalidate();
        })

        .after(3000, function () {
            // Node 1 becomes new leader (higher ZXID)
            var nodes = model().nodes.nodes;
            nodes[0].state = "leading";
            nodes[0].epoch = 2; // New epoch
            nodes[2].state = "following";
            
            model().subtitle = '<p>Node 1 elected as new leader (highest ZXID: 101)</p>'
                             + '<p>Epoch incremented to 2</p>';
            layout.invalidate();
        })

        .after(4000, function () {
            // Discovery and synchronization
            var leader = model().nodes.find("node1");
            var follower = model().nodes.find("node3");
            
            model().send(leader, follower, {type: "NEWLEADER", epoch: 2});
            
            model().subtitle = '<p>Discovery Phase: New leader synchronizes with followers</p>'
                             + '<p>Ensures all nodes have consistent state</p>';
            layout.invalidate();
        })

        .after(5000, function () {
            // Synchronization complete
            var follower = model().nodes.find("node3");
            follower.zxid = 101; // Synchronized
            follower.epoch = 2;
            
            model().subtitle = '<p>Synchronization complete!</p>'
                             + '<p>All nodes now have ZXID: 101, Epoch: 2</p>'
                             + '<p>Ready to process new transactions</p>';
            layout.invalidate();
        })

        .after(500, function () {
            frame.model().controls.show();
        });
    };
});