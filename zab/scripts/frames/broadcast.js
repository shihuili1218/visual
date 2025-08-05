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
            model().title = '<h2 style="visibility:visible">Atomic Broadcast Phase</h2>';
            layout.invalidate();
        })

        .after(500, function () {
            // Create nodes with established leader
            var nodes = [];
            nodes.push(model().nodes.create("node1"));
            nodes.push(model().nodes.create("node2"));
            nodes.push(model().nodes.create("node3"));
            
            // Position nodes
            nodes[0].x = 30; nodes[0].y = 50; nodes[0].state = "following";
            nodes[1].x = 50; nodes[1].y = 30; nodes[1].state = "leading";
            nodes[2].x = 70; nodes[2].y = 50; nodes[2].state = "following";
            
            // Set ZXIDs
            nodes[0].zxid = 100; nodes[0].epoch = 1;
            nodes[1].zxid = 100; nodes[1].epoch = 1;
            nodes[2].zxid = 100; nodes[2].epoch = 1;
            
            layout.invalidate();
        })

        .after(1000, function () {
            model().subtitle = '<p>Leader receives a client request</p>';
            
            // Add client
            var client = model().clients.create("client1");
            client.x = 10; client.y = 30;
            layout.invalidate();
        })

        .after(1500, function () {
            // Send proposal from leader to followers
            var leader = model().nodes.find("node2");
            var followers = [model().nodes.find("node1"), model().nodes.find("node3")];
            var client = model().clients.find("client1");
            
            model().send(client, leader, {type: "REQUEST", data: "write(x=5)"});
            
            model().subtitle = '<p>1. Client sends request to leader</p>';
            layout.invalidate();
        })

        .after(2500, function () {
            // Leader sends proposals
            var leader = model().nodes.find("node2");
            var followers = [model().nodes.find("node1"), model().nodes.find("node3")];
            
            followers.forEach(function(follower) {
                model().send(leader, follower, {type: "PROPOSAL", zxid: 101, data: "write(x=5)"});
            });
            
            model().subtitle = '<p>2. Leader sends PROPOSAL to all followers</p>';
            layout.invalidate();
        })

        .after(3500, function () {
            // Followers send ACKs
            var leader = model().nodes.find("node2");
            var followers = [model().nodes.find("node1"), model().nodes.find("node3")];
            
            followers.forEach(function(follower) {
                model().send(follower, leader, {type: "ACK", zxid: 101});
            });
            
            model().subtitle = '<p>3. Followers send ACK back to leader</p>';
            layout.invalidate();
        })

        .after(4500, function () {
            // Leader sends commits
            var leader = model().nodes.find("node2");
            var followers = [model().nodes.find("node1"), model().nodes.find("node3")];
            
            followers.forEach(function(follower) {
                model().send(leader, follower, {type: "COMMIT", zxid: 101});
            });
            
            // Update ZXIDs
            leader.zxid = 101;
            followers.forEach(function(follower) {
                follower.zxid = 101;
            });
            
            model().subtitle = '<p>4. Leader sends COMMIT to all followers</p>'
                             + '<p>Transaction is now committed across all nodes</p>';
            layout.invalidate();
        })

        .after(500, function () {
            frame.model().controls.show();
        });
    };
});