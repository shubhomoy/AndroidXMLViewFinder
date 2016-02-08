window.onload = function() {
	var refreshBtn = document.getElementById('generate');
	var sourceInput = document.getElementById('source');
	var destinationInput = document.getElementById('java_function');
	var outputText = document.getElementById('output');
	var otherAppLink = document.getElementById('other_apps');
	var author = document.getElementById('author');

	destinationInput.innerHTML = "private void instantiate() {\n\n}";

	otherAppLink.onclick = function() {
		window.open("https://play.google.com/store/search?q=bitslate");
	}
	author.onclick = function() {
		window.open("https://in.linkedin.com/in/shubhomoybiswas");
	}

	refreshBtn.onclick = function() {
		var inputString = sourceInput.value;
		var currPointer = 0
		var currState = 0
		var viewBegin = 0;
		var viewEnd = 0;
		var idBegin = 0;
		var idEnd = 0;
		var viewStatus = 'free';
		var inputChar;
		var viewProcessed = false;
		var idProcessed = false;
		var list = [];
		while(currPointer < inputString.length) {
			inputChar = inputString[currPointer];
			switch(currState) {
				case 0:
					if(inputChar == '<') {
						currState++;
					}
					if(viewProcessed && idProcessed) {
						var item = {
							view : inputString.substring(viewBegin, viewEnd),
							id : inputString.substring(idBegin, idEnd)
						};
						list.push(item);
					}
					viewProcessed = idProcessed = false;
					break;
				case 1:
					if(inputChar == '/' || inputChar == '?') {
						currState = 0;
					}else{
						viewStatus = 'busy';
						viewBegin = currPointer;
						currState = 2;
					}
					break;
				case 2:
					if((inputChar == ' ' || inputChar == '\n') && viewStatus == 'busy') {
						viewEnd = currPointer;
						viewProcessed = true;
						viewStatus = 'free';
					}else if(inputChar == '>') {
						currState = 0;
					}else if(inputChar == '@' && inputString[currPointer+1] == '+' && inputString[currPointer+2] == 'i' && inputString[currPointer+3] == 'd' && inputString[currPointer+4] == '/') {
						currPointer += 4;
						currState = 3;
					}
					break;
				case 3:
					idBegin = currPointer;
					currState = 4;
					break;
				case 4:
					if(inputChar == '"') {
						idProcessed = true;
						idEnd = currPointer;
						currState = 0;
					}
			}
			currPointer++
		}

		var finalString = '';
		list.forEach(function(item) {
			var varName = '';
			var viewName = '';
			var i = 0;
			var camelFound = false;
			i = item.view.indexOf('.');
			while(i != -1) {
				item.view = item.view.substring(i+1);
				i = item.view.indexOf('.');
			}
			i=0;
			while(i < item.id.length) {
				if(item.id[i] != '_')
					if(camelFound == true) {
						camelFound = false;
						varName += item.id[i].toUpperCase();
					}else
						varName += item.id[i];
				else{
					camelFound = true;
				}
				i++;
			}
			item.varName = varName;
			finalString += "private " + item.view + " " + varName + ";\n";
		});
		finalString += "\nprivate void instantiate() {\n";
		list.forEach(function(item) {
			finalString += "\t" + item.varName + " = (" + item.view + ")findViewById(R.id." + item.id + ");\n";
		});
		finalString += '}'
		$('.collapsible-header').trigger('click');
		destinationInput.value = finalString;
		$('#java_function').trigger('keyup');
		output.innerHTML = "Voila! Now you can copy-paste this function in your Activity class and call it from inside onCreate() method.";
	};
}