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
            model().title = '<h2 style="visibility:visible">ZAB Protocol Demonstration</h2>';
            layout.invalidate();
        })

        .after(500, function () {
            // Create interactive demo setup
            var nodes = [];
            nodes.push(model().nodes.create("node1"));
            nodes.push(model().nodes.create("node2"));
            nodes.push(model().nodes.create("node3"));
            
            // Position nodes
            nodes[0].x = 25; nodes[0].y = 50; nodes[0].state = "following";
            nodes[1].x = 50; nodes[1].y = 25; nodes[1].state = "leading";
            nodes[2].x = 75; nodes[2].y = 50; nodes[2].state = "following";
            
            // Set initial state
            nodes[0].zxid = 100; nodes[0].epoch = 1; nodes[0].id = 1;
            nodes[1].zxid = 100; nodes[1].epoch = 1; nodes[1].id = 2;
            nodes[2].zxid = 100; nodes[2].epoch = 1; nodes[2].id = 3;
            
            // Add client
            var client = model().clients.create("client1");
            client.x = 10; client.y = 25;
            
            layout.invalidate();
        })

        .after(1000, function () {
            model().subtitle = '<p>Interactive ZAB Demo</p>'
                             + '<p>Watch as transactions flow through the cluster</p>'
                             + '<p>Leader coordinates all updates for consistency</p>';
            layout.invalidate();
        })

        .after(2000, function () {
            // Start continuous demo
            var client = model().clients.find("client1");
            var leader = model().nodes.find("node2");
            var followers = [model().nodes.find("node1"), model().nodes.find("node3")];
            var transactionCount = 101;
            
            function runTransaction() {
                // Client request
                model().send(client, leader, {type: "REQUEST", data: "write(x=" + transactionCount + ")"});
                
                // Leader proposals
                followers.forEach(function(follower) {
                    model().send(leader, follower, {
                        type: "PROPOSAL", 
                        zxid: transactionCount,
                        data: "write(x=" + transactionCount + ")"
                    });
                });
                
                // Follower ACKs
                setTimeout(function() {
                    followers.forEach(function(follower) {
                        model().send(follower, leader, {type: "ACK", zxid: transactionCount});
                    });
                }, 1000);
                
                // Leader commits
                setTimeout(function() {
                    followers.forEach(function(follower) {
                        model().send(leader, follower, {type: "COMMIT", zxid: transactionCount});
                    });
                    
                    // Update ZXIDs
                    leader.zxid = transactionCount;
                    followers.forEach(function(follower) {
                        follower.zxid = transactionCount;
                    });
                    
                    transactionCount++;
                    layout.invalidate();
                }, 2000);
            }
            
            // Run transactions periodically
            setInterval(runTransaction, 4000);
            runTransaction(); // Start immediately
        })

        .after(500, function () {
            frame.model().controls.show();
        });
    };
});