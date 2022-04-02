render_questions();
render_quiz();
var last_clicked = 0;

function save_button() {
	var timeNow = (new Date()).getTime();
	let last_div = $('.step').last()
	let step_time_consumed = document.createElement("span");
	step_time_consumed.innerHTML = (timeNow - last_clicked) / 1000
	$(last_div).append(step_time_consumed);
	lastClicked = timeNow;
}

function render_step() {
	last_clicked = (new Date()).getTime();
	let step_wrap = document.createElement("div");
	step_wrap.className = "step";
    
    let step_type_label = document.createElement("label");
    step_type_label.innerHTML = "Choose type"
	let step_type_input = document.createElement("select");
    
    let step_value_label = document.createElement("label");
    step_value_label.innerHTML = "Value"
	let step_value_input = document.createElement("input");

    let step_com_label = document.createElement("label");
    step_com_label.innerHTML = "Comment"
    let step_comment_input = document.createElement("input");

	let options = ['seaching', 'reading', 'listening', 'writing']
	options.forEach(option => {
		let opt = document.createElement('option');
		opt.value = option;
		opt.innerHTML = option;
		step_type_input.appendChild(opt);
	});
	$(step_wrap).append(step_type_label);
    $(step_wrap).append(step_type_input);
    $(step_wrap).append(step_value_label);
	$(step_wrap).append(step_value_input);
    $(step_wrap).append(step_com_label);
	$(step_wrap).append(step_comment_input);
	$('#steps').append(step_wrap);
}

function render_questions() {
	questions.forEach(
		question => {
			let question_label = document.createElement("h4");
			question_label.innerHTML = question.text;
			$("#insert-person").append(question_label);
			question.options.forEach(option => {
				let input_wrapper = document.createElement("div");
				let input_element = document.createElement("input");
                input_wrapper.className = "col-12 question";
				input_element.id = option.name;
				input_element.type = "radio";
				input_element.name = question.name;
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

function render_quiz() {
	quiz_questions.forEach(
		question => {
			let question_label = document.createElement("h4");
			question_label.innerHTML = question.text;
			$("#insert-results").append(question_label);
			question.options.forEach(option => {
				let input_wrapper = document.createElement("div");
				let input_element = document.createElement("input");
				input_element.id = option.name;
				input_element.type = "radio";
				input_element.name = question.category;
				input_element.value = option.name;
				$(input_wrapper).append(input_element);
				let label_element = document.createElement("label");
				label_element.for = input_element.id;
				$(label_element).append(option.value);
				$(input_wrapper).append(label_element);
				$("#insert-results").append(input_wrapper);
			});
		});
}
