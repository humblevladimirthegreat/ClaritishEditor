var textbox = document.querySelector('#textbox');
var timeoutID = null;
var filenameBox = document.querySelector('#filename');

// Automatically load/save cache in local storage when opening and closing the page
textbox.value = localStorage.getItem('browserpad') || '';
textbox.setSelectionRange(textbox.value.length, textbox.value.length); // Place caret at end of content
calcScore(); // Update counters after loading
function storeLocally() { localStorage.setItem('browserpad', textbox.value); }
window.beforeunload = storeLocally;

//keep track of how many distinct days the page has been opened
if(localStorage.getItem('daysVisited') === null) {
    localStorage.setItem('daysVisited', ''); 
  }
const dateString = new Date().toISOString().slice(0,10);
// daysVisited is stored as comma-separated list of YYYY_MM_DD 
let daysVisited = localStorage.getItem('daysVisited').split(','); 
  
if(!daysVisited.includes(dateString)) {
    daysVisited.push(dateString); 
    localStorage.setItem('daysVisited', daysVisited.join(','));
}
document.querySelector('#days').textContent = daysVisited.length;

// Set the filename placeholder to have the date
filenameBox.placeholder = "claritish_" + dateString + ".txt";

// Allow inputting tabs in the textarea instead of changing focus to the next element
textbox.onkeypress = function (event) {
    if (event.key === "Tab") {
        event.preventDefault();
        var text = this.value, s = this.selectionStart, e = this.selectionEnd;
        this.value = text.substring(0, s) + '\t' + text.substring(e);
        this.selectionStart = this.selectionEnd = s + 1;
    }
};

// Auto-save to local storage and calculate score on every keystroke
textbox.onkeyup = function () {
    calcScore();
    window.clearTimeout(timeoutID); // Prevent saving too frequently
    timeoutID = window.setTimeout(storeLocally, 1000);
};

function getAdviceMatches(text) {
    var adviceMatches = [];
    advices.forEach(expr => {
        for (const match of text.matchAll(new RegExp(expr.regex, 'ig'))) {
            let matchedText = match[0];
            advice = expr.advice.replaceAll("{match}", escapeHtml(matchedText || ''));
            adviceMatches.push([match.index, matchedText, advice, expr.showMore]);
        }
    });
    // sort by index, because JS default approach to sort is apparently to coerce the arrays to string first
    adviceMatches.sort((a, b) => {
        return a[0] - b[0];
    });
    return adviceMatches;
}

function removeAdviceReferences(text) {
    return text.replace(/\[\d+\]/g, '');
}


function addAdviceReferences(text, adviceMatches) {
    //do it in reverse order so the match indexes remain valid
    for (let i = adviceMatches.length - 1; i >= 0; i--) {
        // the position of the end of the matched text
        index = adviceMatches[i][0] + adviceMatches[i][1].length;
        // insert the reference at end of matched text. Use 1-indexing for correspondence with ordered list
        text = text.substring(0, index) + `[${i+1}]` + text.substring(index);
    }
    return text;
}

function getShowMoreOnClick(uuid) {
    return `var moreText = document.getElementById('moreText_${uuid}');
        if (moreText.style.display === 'none') {
            moreText.style.display = 'block';
            this.innerText = 'Show Less';
        } else {
            moreText.style.display = 'none';
            this.innerText = 'Show More';
        }
    `.replaceAll('\n','')
}

function getShowMoreHtml(hiddenHtml) {
    uuid = Math.floor(Math.random() * 1000000000000001)
    // creates a Show More button that when clicked displays hiddenHtml
    html = `<span id="showMore_${uuid}" class="show-more" onclick="${getShowMoreOnClick(uuid)}">Show More</span>`
    html += `<div id="moreText_${uuid}" style="display: none;">${hiddenHtml}</div>`
    return html;
}

function getAdviceHtml(adviceMatches) {
    var html = "<ol>"
    if (adviceMatches.length > 0) {
        adviceMatches.forEach(adviceMatch => {
            // Create <li> for each match  
            html += `<li>${adviceMatch[2]} ${getShowMoreHtml(adviceMatch[3])}</li>`;
        });
        html += "</ol>"
    } else {
        html = "You used all the possible Claritish options!"
    }
    return html;
};

function escapeHtml(unsafeText) {
    return unsafeText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
};

// Show the hints
document.querySelector("#hints-button").onclick = function () {
    text = removeAdviceReferences(textbox.value);
    const matches = getAdviceMatches(text);
    advicebox.innerHTML = getAdviceHtml(matches);
    textbox.value = addAdviceReferences(text, matches);
};

function calcScore() {
    let text = textbox.value;
    var score = 0;
    pointFunctions.forEach(func => score += func(text))
    document.querySelector('#score').textContent = score;
}

// Save textarea contents as a text file
document.querySelector('#download a').onclick = function () {
    this.download = (filenameBox.value || filenameBox.placeholder).replace(/^([^.]*)$/, "$1.txt");
    this.href = URL.createObjectURL(new Blob([document.querySelector('#textbox').value], { type: 'text/plain' }));
};

// Load contents from a text file
document.querySelector('#open a').onclick = function () {
    document.querySelector('#open input').click();
};
document.querySelector('#open input').onchange = function () {
    var reader = new FileReader();
    reader.file = this.files[0]; // Custom property so the filenameBox can be set from within reader.onload()
    reader.onload = function () {
        filenameBox.value = this.file.name;
        textbox.value = this.result; // this = FileReader object
    };
    reader.readAsText(this.files[0]); // this = input element
};

// Keyboard shortcuts for the save and load functions (`Ctrl+S`, `Ctrl+O`)
document.onkeydown = function (event) {
    if (event.ctrlKey) {
        if (event.key === "s") {
            document.querySelector('#download a').click();
            event.preventDefault();
        }
        else if (event.key === "o") {
            document.querySelector('#open input').click();
            event.preventDefault();
        }
    }
}

// Show the about dialog
document.querySelector("#about-icon").onclick = function () {
    document.querySelector("#about").showModal();
};
