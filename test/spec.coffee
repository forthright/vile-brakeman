mimus = require "mimus"
Promise = require "bluebird"
brakeman = mimus.require "./../lib", __dirname, []
chai = require "./helpers/sinon_chai"
util = require "./helpers/util"
vile = mimus.get brakeman, "vile"
expect = chai.expect

# TODO: write integration tests for spawn -> cli
# TODO: don't use setTimeout everywhere (for proper exception throwing)

describe "running brakeman", ->
  after mimus.restore
  afterEach mimus.reset

  beforeEach ->
    mimus.stub vile, "spawn"
    util.setup vile

  it "calls brakeman with json output", (done) ->
    brakeman
      .punish {}
      .should.be.fulfilled.notify ->
        setTimeout ->
          vile.spawn.should.have.been
            .calledWith "brakeman", args: [
                            "-q"
                            "--format"
                            "json",
                            "--no-exit-on-warn"
                            "--no-exit-on-error"
                            "."
                          ]
          done()
    return

  it "converts brakeman json to issues", ->
    brakeman
      .punish {}
      .should.eventually.eql util.issues

  it "handles an empty response", ->
    vile.spawn.reset()
    vile.spawn.returns new Promise (resolve) -> resolve ""

    brakeman
      .punish {}
      .should.eventually.eql []

  describe "config", ->
    it "supports it as a custom brakeman config file path", (done) ->
      config_path = ".brakeman.yml"

      brakeman
        .punish config: config_path
        .should.be.fulfilled.notify ->
          setTimeout ->
            vile.spawn.should.have.been
              .calledWith "brakeman", args: [
                            "-c"
                            config_path
                            "-q"
                            "--format"
                            "json"
                            "--no-exit-on-warn"
                            "--no-exit-on-error"
                            "."
                          ]
            done()
      return
