import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import { XvfbConfig } from '../tasks/XvfbV0/config';

describe('XvfbV0 Task Config Tests', function () {

    before( function() {
        this.timeout(1000);
    });

    it('should succeed with valid XvfbConfig', function(done: MochaDone) {

        let testConfig = new XvfbConfig();
        testConfig.resolution = "1024x768x16";
        testConfig.display = 33;

        let actualArguments = testConfig.arguments;

        assert.equal(testConfig.display, 33, "should parse display variable");
        assert.equal(testConfig.resolution, "1024x768x16", "should parse resolution variable");
        assert.equal(testConfig.socket, "/tmp/.X11-unix/X33", "should parse socket variable");
        assert.deepEqual(actualArguments, [':33','-ac','-screen','0','1024x768x16'], "should parse Xvfb arguments")

        done();

    });

    it('should fail with invalid valid XvfbConfig', function(done: MochaDone) {

        let testConfig = new XvfbConfig();
        let defaultDisplay = testConfig.display;
        testConfig.display = NaN

        assert.throws( ()=> {
            testConfig.resolution = "102476816"
        }, /screen format must be 'WxHxD'/, "should thrown and error passing bad resolution format");

        assert.throws( ()=> {
            testConfig.resolution = "102476816"
        }, /screen format must be 'WxHxD'/, "should thrown and error passing bad resolution format");

        assert.throws( ()=> {
            testConfig.screen = { width: -1, height: -1, depth: -1}
        }, /resolution must be grather than 0/, "should thrown and error if screen resolution is negative");

        assert.throws( ()=> {
            testConfig.display = -1
        }, /display must be grather than 0/, "should thrown and error if display is negative");
        
        assert.equal(testConfig.display, defaultDisplay, "should use default display if isNaN")

        done();

    });

    it('should fail with invalid action', function(done: MochaDone) {

        let tp = path.join(__dirname, 'XvfbV0', 'invalid_failure.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        
        tr.run();
        
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], 'Invalid action', 'error issue output');

        done();

    });


});

describe('XvfbV0 Task Start Tests', function () {

    before( function() {
        this.timeout(15000);
    });

    after(() => {

    });


    it('should succeed with default inputs', function(done: MochaDone) {
        
        let tp = path.join(__dirname, 'XvfbV0', 'start_defaults.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        
        tr.run();

        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.equal(tr.stdout.indexOf('Set Variable DISPLAY=:0') >= 0, true, "should display export message");

        done();
    });


    it('should succeed with custom inputs', function(done: MochaDone) {

        let tp = path.join(__dirname, 'XvfbV0', 'start_custom.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.equal(tr.stdout.indexOf('Set Variable DISPLAY=') ==-1, true, "should display export message");

        done();
    });

    it('should fail if is not possible start Xvfb daemon', function(done: MochaDone) {

        let tp = path.join(__dirname, 'XvfbV0', 'start_failure.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        //console.log(tr.stdout)
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], '/sbin/start-stop-daemon failed with return code: 1', 'error issue output');
        assert.equal(tr.stdout.indexOf('Xvfb daemon started'), -1, "Should not display Xvfb daemon started message");

        done();
    });

    it('should fail if is not possible test Xvfb connection after hardcoded timeout', function(done: MochaDone) {

        let tp = path.join(__dirname, 'XvfbV0', 'start_timeout.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        //console.log(tr.stdout)
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], 'xdpyinfo failed with return code: 1', 'error issue output');
        assert.equal(tr.stdout.indexOf('Xvfb daemon started'), -1, "Should not display Xvfb daemon started message");

        done();
    });

});

describe('XvfbV0 Task Stop Tests', function () {

    it('should succed stoping Xvfb daemon', function(done: MochaDone) {
        this.timeout(15000);

        let tp = path.join(__dirname, 'XvfbV0', 'stop.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();

        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

});