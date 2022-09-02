
"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define(["./home", "./tease", "./overview"],
    function (home, tease, overview) {
        return function (player) {
            player.frame("home", "Home", home);
            player.frame("tease", "Paxos Disadvantages", tease);
            player.frame("overview", "Algorithm Overview", overview);
        };
    });
