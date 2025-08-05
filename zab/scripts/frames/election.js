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
            model().title = '<h2 style="visibility:visible">Leader Election Phase</h2>';
            layout.invalidate();
        })

        .after(500, function () {
            // Create nodes
            var nodes = [];
            nodes.push(model().nodes.create("node1"));
            nodes.push(model().nodes.create("node2"));
            nodes.push(model().nodes.create("node3"));
            
            // Position nodes - all start as looking
            nodes[0].x = 30; nodes[0].y = 50; nodes[0].state = "looking";
            nodes[1].x = 50; nodes[1].y = 30; nodes[1].state = "looking";
            nodes[2].x = 70; nodes[2].y = 50; nodes[2].state = "looking";
            
            // Set server IDs and ZXIDs
            nodes[0].id = 1; nodes[0].zxid = 98;
            nodes[1].id = 2; nodes[1].zxid = 100;
            nodes[2].id = 3; nodes[2].zxid = 99;
            
            layout.invalidate();
        })

        .after(1000, function () {
            model().subtitle = '<p>All nodes start in LOOKING state</p>'
                             + '<p>Each node votes for the server with:</p>'
                             + '<p>• Highest ZXID (transaction ID)</p>'
                             + '<p>• Highest server ID (as tiebreaker)</p>';
            layout.invalidate();
        })

        .after(2000, function () {
            // Simulate voting process
            var nodes = model().nodes.nodes;
            
            // Node 2 has highest ZXID, becomes leader
            nodes[1].state = "leading";
            nodes[0].state = "following";
            nodes[2].state = "following";
            
            model().subtitle = '<p>Node 2 elected as leader (highest ZXID: 100)</p>'
                             + '<p>Other nodes become followers</p>';
            layout.invalidate();
        })

        .after(500, function () {
            frame.model().controls.show();
        });
    };
});