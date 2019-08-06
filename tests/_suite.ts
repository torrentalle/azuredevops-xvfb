import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import { XvfbConfig } from '../tasks/XvfbV0/config';

describe('Start Xvfv task tests', function () {

    before( function() {

    });

    after(() => {

    });

    it('should succeed with valid XvfbConfig', function(done: MochaDone) {
        this.timeout(1000);

        let testConfig = new XvfbConfig();
        testConfig.resolution = "1024x768x16";
        testConfig.display = 33;

        let actualArguments = testConfig.getArrayArguments();

        assert.equal(testConfig.display, 33, "should parse display variable");
        assert.equal(testConfig.resolution, "1024x768x16", "should parse resolution variable");
        assert.deepEqual(actualArguments, [':33','-ac','-screen','0','1024x768x16'], "should parse Xvfb arguments")

        done();

    });

    it('should fail with invalid valid XvfbConfig', function(done: MochaDone) {
        this.timeout(1000);

        let testConfig = new XvfbConfig();
        let defaultDisplay = testConfig.display;
        testConfig.display = NaN

        assert.throws( ()=> {
            testConfig.resolution = "102476816"
        }, "screen format must be 'WxHxD'", "should thrown and error passing bad resolution format");

        assert.throws( ()=> {
            testConfig.resolution = "102476816"
        }, "screen format must be 'WxHxD'", "should thrown and error passing bad resolution format");

        assert.throws( ()=> {
            testConfig.screen = { width: -1, height: -1, depth: -1}
        }, "resolution must be grather than 0. -1x-1x-1", "should thrown and error if screen resolution is negative");

        assert.throws( ()=> {
            testConfig.display = -1
        }, "display must be grather than 0", "should thrown and error if display is negative");
        
        assert.equal(testConfig.display, defaultDisplay, "should use default display if isNaN")

        done();

    });

    it('should succeed with default inputs', function(done: MochaDone) {
        this.timeout(10000);

        let tp = path.join(__dirname, 'XvfbV0', 'defaults.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");

        done();
    });

    it('should succed starting Xvfb daemon', function(done: MochaDone) {
        this.timeout(10000);

        let tp = path.join(__dirname, 'XvfbV0', 'start.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.equal(tr.stdout.indexOf('Xvfb daemon started in display :99') >= 0, true, "should display started message");
        assert.equal(tr.stdout.indexOf('Set Task Variable DISPLAY=:99') >= 0, true, "should display export message");

        done();
    });

    it('should fail starting Xvfb daemon', function(done: MochaDone) {
        this.timeout(10000);

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

    it('should succed stoping Xvfb daemon', function(done: MochaDone) {
        this.timeout(10000);

        let tp = path.join(__dirname, 'XvfbV0', 'stop.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();

        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.equal(tr.stdout.indexOf('Xvfb daemon stopped') >= 0, true, "should display stopped");
        assert.equal(tr.stdout.indexOf('Set Task Variable DISPLAY=') >= 0, true, "should display export message");

        done();
    });

});