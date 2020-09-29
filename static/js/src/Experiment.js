function Experiment(_timeline, _fullscreen) {
    this.timeline = _timeline;
    this.fullscreen = _fullscreen;
    this.RunExperiment = function () {
        jsPsych.init({
            timeline: this.timeline,
            fullscreen: this.fullscreen,
            on_finish: function () {

            }
        });
    }
}