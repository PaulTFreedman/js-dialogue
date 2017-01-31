var currentIndex = 0;
var maxLength = 140;
var nextCutoff = maxLength;
var clicked = false;
var finishedPage = false;
var delay = 100;
var audioElementChooser = 1;

var text = 'This is a Zelda-inspired dialogue engine. Add text on a new line to force a new page.\nLike.\nThis.\nAny very long sentences will spread to a new page, divided using the last possible space - This long sentence will serve as an example!';

/*
target   - The DOM object to act on
message  - The text we iterate through (a substring of the full text)
index    - Which letter within the message we are examining in this pass (always starts at 0)
interval - How long until function calls itself
 */
var showText = function (target, message, index, interval) {

	if (currentIndex == nextCutoff) {
		var limit = Math.min(text.length, (nextCutoff + maxLength));

		nextCutoff = findEndOfPhrase(limit);
		finishedPage = true;
		return;
	}

	if (clicked == true) {
		interval = 0;
	}

	$(target).append(message[index++]);
	currentIndex++;
	
	if (message[index] != " ") {
		playSound();		
	}

	setTimeout(function () {
		showText(target, message, index, interval);
	}, interval);
};

var findEndOfPhrase = function (endIndex) {
	var firstNewLine;
	var lastStopIndex;
	var lastSpace;
	
	for (i = endIndex; i > currentIndex; i--) {		
		if (text[i] == "\n") {
			firstNewLine = (i + 1);
			continue;
		}

		if (!lastStopIndex && text[i] == "." && text[i - 1] != ".") {
			lastStopIndex = (i + 1);
			continue;
		}
		
		if (!lastSpace && text[i] == " ") {
			lastSpace = (i + 1);
		}
	}
	
	if (!lastSpace) {
		lastSpace = endIndex;
	}
	
	if (firstNewLine) {
		return firstNewLine;
	} else if (lastStopIndex) {
		return lastStopIndex;
	} else if (lastSpace) {
		return lastSpace;
	} else {
		return endIndex;
	}
}

var playSound = function() {
	var targetId = "audio-source" + this.audioElementChooser;
	var audio = document.getElementById(targetId);
	audio.volume = 0.1;
	audio.play();

	if (this.audioElementChooser < 3) {
		this.audioElementChooser++;
	} else {
		this.audioElementChooser = 1;
	}
}

$(function () {
	$("#input-text").val(text);
	
	$("#triangle_marker").css("display", "block");
	$("#square_marker").css("display", "none");
	
	nextCutoff = findEndOfPhrase(nextCutoff);
	showText("#text_target", text.substring(0, nextCutoff), 0, delay);

	/* Click */
	$("#dialogue-box").click(function () {
		clicked = true;
		
		var oldText = text;
		text = $("#input-text").val();

		if (oldText != text || currentIndex >= text.length) {
			/* Back to start of string */
			currentIndex = 0;
			nextCutoff = findEndOfPhrase(maxLength);
		}

		if (nextCutoff >= text.length) {
			$("#triangle_marker").css("display", "none");
			$("#square_marker").css("display", "block");
		} else {
			$("#triangle_marker").css("display", "block");
			$("#square_marker").css("display", "none");
		}

		if (finishedPage == true) {
			$("#text_target").empty();
			clicked = false;
			finishedPage = false;
			showText("#text_target", text.substring(currentIndex, nextCutoff).trim(), 0, delay);
		}
	});
});