
define(["../../scripts/model/model", "../../scripts/model/log_entry", "../../../scripts/domReady/domReady-2.0.1!"], function (Model, LogEntry, doc) {
    describe('Node', function(){
        var assert = chai.assert,
            frame = null,
            model = null,
            node  = null;

        beforeEach(function() {
            var player = playback.player().frame("TEST", "TEST", function () {});
            player.model(new Model());
            frame = player.current();
            model = frame.model();
            node = model.nodes.create("a");
        });

        describe('#initialize()', function(){
            it('should initialize as a follower', function(){
                assert.equal(node.state(), "acceptor");
            });

            it('should initialize with model', function(){
                assert.strictEqual(node.model(), model);
            });
        });

        describe('#bbox()', function(){
            it('should return a bbox around the circle', function(){
                node.x = 10;
                node.y = 20;
                node.r = 5
                var bbox = node.bbox()
                assert(bbox.equal(tsld.bbox(15, 15, 25, 5)));
            });
        });

        describe('#execute()', function(){
            it('should append a log entry', function(){
                node._proposalNo = 3;
                node.state("proposer");
                node.execute("SET 5");
                assert.equal(1, node._log.length);
                assert.equal(1, node._log[0].index);
                assert.equal(3, node._log[0].term);
                assert.equal("SET 5", node._log[0].command);

                node.execute("SET 10");
                assert.equal(2, node._log.length);
                assert.equal(2, node._log[1].index);
                assert.equal("SET 10", node._log[1].command);
            });
        });

        describe('#proposalNo()', function(){
            it('should update the term and change to "acceptor" if term is higher', function(){
                node._proposalNo = 10;
                node.state("acceptor");    // Bumps to term 11.
                node._proposalNo = 12;
                assert.equal(12, node.proposalNo());
                assert.equal("acceptor", node.state());
            });

            it('should not change if the term is lower or equal to current', function(){
                node._proposalNo = 10;
                node.state("acceptor")     // Bumps to term 11.
                node._proposalNo = 9;
                node._proposalNo = 11;
                assert.equal(11, node.proposalNo());
                assert.equal("acceptor", node.state());
            });
        });

    });
});
