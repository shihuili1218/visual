
"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define(["./title", "./intro", "./overview", "./election"],
    function (title, intro, overview, election) {
        return function (player) {
            // player.frame("playground", "Playground", playground);
            player.frame("home", "Home", title);
            player.frame("intro", "What is Paxos?", intro);
            player.frame("overview", "Prepare Phase", overview);
            player.frame("election", "Accept Phase", election);
            // player.frame("replication", "Log Replication", replication);
            // player.frame("conclusion", "Other Resources", conclusion);
        };
    });
