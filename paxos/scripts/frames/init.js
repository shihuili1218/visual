
"use strict";
/*jslint browser: true, nomen: true*/
/*global define*/

define(["./title", "./intro", "./overview", "./prepare", "./accept", "./learn"],
    function (title, intro, overview, prepare, accept, learn) {
        return function (player) {
            player.frame("home", "Home", title);
            player.frame("intro", "What is Paxos?", intro);
            player.frame("overview", "Algorithm Overview", overview);
            player.frame("prepare", "Prepare Phase", prepare);
            player.frame("accept", "Accept Phase", accept);
            player.frame("learn", "Learn Phase", learn);
        };
    });
