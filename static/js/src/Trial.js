function TimeLine(_timeline_type, _button_label) {
    this.type = _timeline_type;
    this.button_label = _button_label;
}

function Trial(_id, _timeline, _timeline_variables, _randomize_order, _repetitions) {
    this.id = _id;
    this.timeline = _timeline;
    this.timelime_variables = _timeline_variables;
    this.randomize_order = _randomize_order;
    this._repetitions = _repetitions;
}

function Data(_stimulus) {
    this.stimulus = _stimulus
}

function Fullscreen(_fullscreen_mode, _message) {
    this.type = 'fullscreen'
    this.fullscreen_mode = _fullscreen_mode;
    this.message = _message;
}

function KeyboardResponse(_timeline, _prompt, _choices) {
    TimeLine.call(this, "html-keyboard-response", "");
    this.prompt = _prompt;
    this.timeline = _timeline;
    this.choices = _choices;
}

function IntroSequence(_stimulus, _choices) {
    this.stimulus_side = _stimulus;
    this.choices = _choices;
}


function IntroTrial(_timeline, _timing_post_trial) {
    this.type = 'html-keyboard-response';
    this.timeline = _timeline;
    this.timing_post_trial = _timing_post_trial;
}