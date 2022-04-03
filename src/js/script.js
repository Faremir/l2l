(function ($) {

    // USE STRICT
    "use strict";

    //----------------------------------------------------/
    // Predefined Variables
    //----------------------------------------------------/
    var $document = $(document);
    var $last_clicked = 0;


    //----------------------------------------------------/
    // Quiz Methods
    //----------------------------------------------------/

    function save_button() {
        var timeNow = (new Date()).getTime();
        let last_div = $('.step').last()
        let step_time_consumed = document.createElement("span");
        step_time_consumed.innerHTML = (timeNow - $last_clicked) / 1000
        $(last_div).append(step_time_consumed);
        $last_clicked = timeNow;
    }

    function render_step() {
        $last_clicked = (new Date()).getTime();
        let step_wrap = document.createElement("div");
        step_wrap.className = "step";

        let step_type_label = document.createElement("label");
        step_type_label.innerHTML = "Choose type"
        let step_type_input = document.createElement("select");
        step_type_input.className = 'step_type';

        let step_value_label = document.createElement("label");
        step_value_label.innerHTML = "Value"
        let step_value_input = document.createElement("input");
        step_value_input.className = 'step_value';

        let step_com_label = document.createElement("label");
        step_com_label.innerHTML = "Comment"
        let step_comment_input = document.createElement("input");
        step_comment_input.className = 'step_comment';
        let options = ['seaching', 'reading', 'listening', 'writing'];
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
        function render_label(question, parent_el) {
            let question_label = document.createElement("h4");
            question_label.innerHTML = question.text;
            $(parent_el).append(question_label);
        }

        function render_option(option, question) {
            let input_element = document.createElement("input");
            input_element.id = option.name;
            input_element.type = "radio";
            input_element.name = question.name;
            input_element.value = option.name;
            input_element.dataset.visual_value = option.visual_value;
            input_element.dataset.static_value = option.static_value;
            input_element.dataset.emotional_value = option.emotional_value;
            input_element.dataset.interactive_value = option.interactive_value;
            return input_element;
        }

        questions.forEach(
            question => {
                let question_wrapper = document.createElement("div");
                question_wrapper.className = question.name.toLowerCase()
                render_label(question, question_wrapper);
                $("#insert-person").append(question_wrapper);
                question.options.forEach(option => {
                    let input_wrapper = document.createElement("div");
                    input_wrapper.className = "col-12 question";

                    let input_element = render_option(option, question);
                    $(input_wrapper).append(input_element);
                    let label_element = document.createElement("label");
                    label_element.for = input_element.id;
                    if (["visual", "emotional"].includes(question.category)) {
                        let img_element = document.createElement("img");
                        img_element.src = option.value;
                        $(label_element).append(img_element);
                    } else {
                        $(label_element).append(option.value);
                    }
                    $(input_wrapper).append(label_element);
                    $(question_wrapper).append(input_wrapper);
                });
            });
    }

    function render_quiz() {
        quiz_questions.forEach(
            question => {
                let question_label = document.createElement("span");
                question_label.innerHTML = question.text;
                $("#insert-results").append(question_label);
                let input_wrapper = document.createElement("div");
                let input_element = document.createElement("input");
                input_element.id = question.name;
                input_element.name = question.name;
                input_element.type = "text";
                $(input_wrapper).append(input_element);
                let label_element = document.createElement("label");
                label_element.for = input_element.id;
                $(input_wrapper).append(label_element);
                $("#insert-results").append(input_wrapper);
            });
    };

    function process_form() {
	    let max_score = 0;
        let visual_value = 0;
        let static_value = 0;
        let emotional_value = 0;
        let interactive_value = 0;
        let difference = 0;
        let total_score = 0;
//		console.log("Form", $('form').serializeArray());

        $('form').serializeArray().forEach(
            answer => {
                let question_object = questions.filter(x => x.name == answer.name)
                let quiz_object = quiz_questions.filter(x => x.name == answer.name)
//				console.log("je question/answer name", question_object, quiz_object, questions);
                if (question_object.length > 0) {
                    let right_option = question_object[0].options.filter(x => x.name == answer.value)
                    visual_value += right_option[0].visual_value
                    static_value += right_option[0].static_value
                    emotional_value += right_option[0].emotional_value
                    interactive_value += right_option[0].interactive_value

                }
                if (quiz_object.length > 0) {
				    max_score += 100
                    if (Number(answer.value)) {
                        difference = Math.abs(Number(quiz_object[0].right_answer) - Number(answer.value))
                        let percentage = Number(quiz_object[0].right_answer) / Number(answer.value);
                        let percentage_difference = Math.abs(100 - (percentage * 100))
                        // if there is deviation but no big we will give points
                        if (percentage_difference < 20) {
                            total_score += (100) * ((100 - percentage_difference) / 100)
                        }
                    }
                    // if is answer a string only right answer is considered as valid
                    else {
                        if (quiz_object[0].right_answer == answer.value) {
                            total_score += 100;
                        }
                    }
                }

            });
	    let steps = process_steps();
		let value = {
		"success_rate": (total_score / max_score ) * 100,
		"visual_value":visual_value,
		"static_value":static_value,
		"emotional_value":emotional_value,
		"interactive_value":interactive_value,
		"steps": steps
		}
		console.log(value)
		return value;



	};
	function process_steps()
	{
	 let step_count = 1;
     let step_elements = $('.step');
     let steps_json = []
     $('.step').each(function(obj, element) {
       console.log("object", element);
       console.log("VAlues",
     $(element).children(".step_value")[0].value,
     $(element).children(".step_comment")[0].value,
     $(element).children(".step_type")[0].value,
     $(element).children("span")[0].innerText
     );
     steps_json.push(
     {
        "step_count": step_count,
        "step_value":  $(element).children(".step_value")[0].value,
        "step_comment":  $(element).children(".step_comment")[0].value,
        "step_type":  $(element).children(".step_type")[0].value,
        "step_time": $(element).children("span")[0].innerText

     });

    });
 return steps_json
	}

    function call_ajax(data) {
        $.ajax({
            url: "/determine",
            type: "POST",
            data: JSON.stringify(data),
            success: function (data, textStatus, jqXHR) {
                //data - response from server
                console.log(data, textStatus, jqXHR);
                $('#main').load('network.html', function() {
                    $('.main-header-content').html('<p>data</p>')
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // render error
                $('#main').load('network.html', function() {
                    $('.main-header-content').html('<p>error</p>')
                });
            }
        });
    }

    /* -----------------------------
     * On DOM ready functions
     * ---------------------------*/

    $document.ready(function () {

        //Render Questions & Quiz
        render_questions();
        render_quiz();

        $("#render_step_btn").on("click", function () {
            render_step();
        })
        $("#save_step_btn").on("click", function () {
            save_button();
        })
        $("#process_form_btn").on("click", function () {
			var data = process_form();
            call_ajax(data);
        })
        $("input[type=radio]").on('change', function () {
            let $checked = $("input[type=radio]:checked");
            if ($checked.length === 4) {
                let values = {
                    'interactive_value': 0,
                    'emotional_value': 0,
                    'static_value': 0,
                    'visual_value': 0,
                };
                $checked.each(function () {
                        let data = $(this).data();
                        values.interactive_value += data.interactive_value
                        values.emotional_value += data.emotional_value
                        values.static_value += data.static_value
                        values.visual_value += data.visual_value
                    }
                );
                const maxKey = _.max(Object.keys(values), o => values[o]);

                var title = "Improve your learning";
                var bg_color = 'unset';
                console.log(maxKey);
                switch (maxKey) {
                    case 'interactive_value':

                        break;
                    case 'emotional_value':
                        break;
                    case 'static_value':
                        title = "Improve your brain";
                        break;
                    case 'visual_value':
                        bg_color = 'rgba(234, 88, 56, 0.95)';
                        break;
                }
                $('.landing-content h1').text(title);
                $('.content-bg-wrap').css({'background-color': bg_color});
            }

        })
        $('input')

    });
})(jQuery);

