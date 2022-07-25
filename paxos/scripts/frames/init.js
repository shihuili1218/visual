
"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define(["./title", "./intro", "./overview", "./prepare", "./accept"],
    function (title, intro, overview, prepare, accept) {
        return function (player) {
            player.frame("home", "Home", title);
            player.frame("intro", "What is Paxos?", intro);
            player.frame("overview", "Algorithm Overview", overview);
            player.frame("prepare", "Prepare Phase", prepare);
            player.frame("accept", "Accept Phase", accept);
        };
    });
