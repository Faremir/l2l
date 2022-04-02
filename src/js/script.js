render_questions();
var last_clicked = 0;

function save_button() {
    var timeNow = (new Date()).getTime();
    let last_div = $('.step_class').last()
    let step_time_consumed = document.createElement("span");
    step_time_consumed.innerHTML = (timeNow - last_clicked) / 1000
    $(last_div).append(step_time_consumed);
    lastClicked = timeNow;
}

function render_step() {
    last_clicked = (new Date()).getTime();
    let step_wrap = document.createElement("div");
    step_wrap.className = "step_class";
    let step_type_input = document.createElement("select");
    let step_value_input = document.createElement("input");
    let step_comment_input = document.createElement("input");
    let options = ['seaching', 'reading', 'listening', 'writing']
    options.forEach(option => {
        let opt = document.createElement('option');
        opt.value = option;
        opt.innerHTML = option;
        step_type_input.appendChild(opt);
    });
    $(step_wrap).append(step_type_input);
    $(step_wrap).append(step_value_input);
    $(step_wrap).append(step_comment_input);
    $('#steps').append(step_wrap);
}

function render_questions() {
    questions.forEach(
        question => {
            question.options.forEach(option => {
				let input_wrapper = document.createElement("div");
                let input_element = document.createElement("input");
                input_wrapper.className = "col-12 question";
                input_element.id = option.name;
                input_element.type = "radio";
                input_element.name = question.category;
                input_element.value = option.name;
                input_element.dataset.visual_value = question.visual_value;
                input_element.dataset.static_value = question.static_value;
                input_element.dataset.emotional_value = question.emotional_value;
                input_element.dataset.interactive_value = question.interactive_value;
                $(input_wrapper).append(input_element);
                let label_element = document.createElement("label");
                label_element.for = input_element.id;
                if (["visual", "emotional"].includes(question.category)) {
                    let img_element = document.createElement("img");
                    img_element.src = option.value;
                    $(label_element).append(img_element);
                }
                else {
                    $(label_element).append(option.value);
                }
				$(input_wrapper).append(label_element);
                $("#insert-person").append(input_wrapper);
            });
        });
}
