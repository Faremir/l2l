render_questions();
render_quiz();
var last_clicked = 0;

function save_button() {
	var timeNow = (new Date()).getTime();
	let last_div = $('.step_class').last()
	console.log(timeNow, last_clicked)
	let step_time_consumed = document.createElement("span");
	step_time_consumed.innerHTML = (timeNow - last_clicked) / 1000
	console.log(last_div);
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
			let question_label = document.createElement("span");
			question_label.innerHTML = question.text;
			$("#person").append(question_label);
			question.options.forEach(option => {
				let input_wrapper = document.createElement("div");
				let input_element = document.createElement("input");
				input_wrapper.className = "col-12 question";
				input_element.id = option.name;
				input_element.type = "radio";
				input_element.name = question.category;
				input_element.value = option.name;
				input_element.dataset.visual_value = option.visual_value;
				input_element.dataset.static_value = option.static_value;
				input_element.dataset.emotional_value = option.emotional_value;
				input_element.dataset.interactive_value = option.interactive_value;
				$(input_wrapper).append(input_element);
				let label_element = document.createElement("label");
				label_element.for = input_element.id;
				if (["visual", "emotional"].includes(question.category)) {
					let img_element = document.createElement("img");
					img_element.src = option.value;
					img_element.style.maxHeight = "10px";
					$(label_element).append(img_element);
				}
				else {
					$(label_element).append(option.value);
				}
				$(input_wrapper).append(label_element);
				$("#person").append(input_wrapper);
			});
		});
}

function render_quiz() {
	quiz_questions.forEach(
		question => {
			let question_label = document.createElement("span");
			question_label.innerHTML = question.text;
			$("#results").append(question_label);
			let input_wrapper = document.createElement("div");
			let input_element = document.createElement("input");
			input_element.id = question.name;
			input_element.name = question.name;
			input_element.type = "text";
			$(input_wrapper).append(input_element);
			let label_element = document.createElement("label");
			label_element.for = input_element.id;
			$(input_wrapper).append(label_element);
			$("#results").append(input_wrapper);
		});


}
function process_form() {
	let visual_value = 0;
	let static_value = 0;
	let emotional_value = 0;
	let interactive_value = 0;
	let difference = 0;
	total_score = 0;
	console.log("fomr", $('form').serializeArray());

	$('form').serializeArray().forEach(

		answer => {
			let question_object = questions.filter(x=> x.category == answer.name)
			let quiz_object = quiz_questions.filter(x=> x.name == answer.name)
			console.log("je question/quic", question_object, quiz_object);	
			if (question_object.length > 0) {
				console.log("Mam quest");
				visual_value += question_object[0].visual_value;
				static_value += question_object[0].static_value;
				emotional_value += question_object[0].emotional_value;
				interactive_value += question_object[0].interactive_value;
			}
			if (quiz_object.length > 0) {
				console.log("Mam quiz");
				if (Number(answer.value)){
					difference = Math.abs(Number(quiz_object[0].right_answer) - Number(answer.value))
					let percentage = Number(quiz_object[0].right_answer) / Number(answer.value);
					let percentage_difference = Math.abs(100 - (percentage *100))
					// if there is deviation but no big we will give points
					if (percentage_difference < 20){ 
						total_score += (100) * ((100 - percentage_difference)/100)
					}
				}
				// if is answer a string only right answer is considered as valid
				else{
					if (quiz_object[0].right_answer == answer.value){
						total_score += 100;
					}
				}
			}
		});
		console.log(total_score);
		console.log(visual_value,static_value,emotional_value,interactive_value);

}
function validate_answers() {

}
