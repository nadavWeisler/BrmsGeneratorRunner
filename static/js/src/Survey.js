function Question(_id, _prompt, _value=0, _required=true) {
    this.id = _id;
    this.prompt = _prompt;
    this.value = _value;
    this.required = _required;
}

function QuestionText(_id, _prompt, _columns, _rows, _value=0, _required=true) {
    Question.call(_id, _prompt, _value, _required);
    this.columns = _columns;
    this.rows = _rows;
}

function QuestionMultiChoice(_id, _prompt, _options, _value=0, _required=true) {
    Question.call(_id, _prompt, _value, _required);
    this.options = _options;
}

function QuestionScale(_id, _prompt, _labels, _value=0, _required=true) {
    Question.call()
    this.labels = _labels
}

function QuestionsList(_questions, _type){
    this.questions = _questions;
    this.type = _type;
}

function Survey(_questions_lists) {
    this.questions_lists = _questions_lists;
}