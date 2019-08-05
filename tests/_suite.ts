import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('Start Xvfv task tests', function () {

    before( function() {

    });

    after(() => {

    });

    it('should succeed with default inputs', function(done: MochaDone) {
        this.timeout(10000);

        let tp = path.join(__dirname, 'StartXvfb', 'success.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        console.log(tr.stdout)
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        console.log(tr.stdout);
        assert.equal(tr.stdout.indexOf('Xvfb daemon started in display :99') >= 0, true, "should display started message");
        assert.equal(tr.stdout.indexOf('Set Task Variable DISPLAY=":99"') >= 0, true, "should display export message");
        done();
    });


    it('should succeed with valid display input', function(done: MochaDone) {
        this.timeout(10000);

        let tp = path.join(__dirname, 'StartXvfb', 'success-input-display.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        console.log(tr.stdout)
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        console.log(tr.stdout);
        assert.equal(tr.stdout.indexOf('Xvfb daemon started in display :13') >= 0, true, "should display started message");
        done();
    });

    it('should succeed with valid display screen', function(done: MochaDone) {
        this.timeout(10000);

        let tp = path.join(__dirname, 'StartXvfb', 'success-input-screen.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        console.log(tr.stdout)
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        console.log(tr.stdout);
        assert.equal(tr.stdout.indexOf('Xvfb daemon started in display :99') >= 0, true, "should display started message");
        done();
    });


    it('should succeed with valid display exportDisplay', function(done: MochaDone) {
        this.timeout(10000);

        let tp = path.join(__dirname, 'StartXvfb', 'success-input-export.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();
        console.log(tr.stdout)
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        console.log(tr.stdout);
        assert.equal(tr.stdout.indexOf('Xvfb daemon started in display :99') >= 0, true, "should display started message");
        assert.equal(tr.stdout.indexOf('Set Task Variable DISPLAY=":99"'), -1, "Should not display export message");
        done();
    });


    it('it should fail if tool cannot start Xvfb', function(done: MochaDone) {
        this.timeout(10000);

        let tp = path.join(__dirname, 'StartXvfb', 'failure.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.run();
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], '/sbin/start-stop-daemon failed with return code: 1', 'error issue output');
        assert.equal(tr.stdout.indexOf('Xvfb daemon started'), -1, "Should not display Xvfb daemon started message");
    
        done();
    });


    it('it should fail if cannot detect Xvfm status', function (done) {
        this.timeout(10000);
        var tp = path.join(__dirname, 'StartXvfb', 'failure-status.js');
        var tr = new ttm.MockTestRunner(tp);
        tr.run();
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], '/sbin/start-stop-daemon failed with return code: 1', 'error issue output');
        assert.equal(tr.stdout.indexOf('Xvfb daemon started'), -1, "Should not display Xvfb daemon started message");
        done();
    });

    it('it should fail if diplay is not numeric', function(done: MochaDone) {
        this.timeout(1000);
    
        let tp = path.join(__dirname, 'StartXvfb', 'failure-input-display.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        
        tr.run();
        console.log(tr.succeeded);
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 2, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], 'Bad Display was given', 'error issue output');
        assert.equal(tr.stdout.indexOf('Xvfb daemon started'), -1, "Should not display Xvfb daemon started message");
    
        done();
    });
});