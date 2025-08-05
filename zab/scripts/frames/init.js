"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define(["./title", "./intro", "./overview", "./election", "./broadcast", "./recovery", "./demo"],
    function (title, intro, overview, election, broadcast, recovery, demo) {
        return function (player) {
            player.frame("home", "Home", title);
            player.frame("intro", "What is ZAB?", intro);
            player.frame("overview", "Algorithm Overview", overview);
            player.frame("election", "Leader Election", election);
            player.frame("broadcast", "Atomic Broadcast", broadcast);
            player.frame("recovery", "Recovery Process", recovery);
            player.frame("demo", "Demonstration", demo);
        };
    });