var textbox = document.querySelector('#textbox');
var advicebox = document.querySelector('#advicebox');
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

document.querySelector('#updated').textContent = new Date(document.lastModified)
    .toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit'
    });

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
    rules.forEach(rule => {
        for (const match of text.matchAll(new RegExp(rule.violation, 'ig'))) {
            let matchedText = match[0];
            advice = rule.description.replaceAll("{match}", escapeHtml(matchedText || ''));
            adviceMatches.push([match.index, matchedText, advice, rule.showMore]);
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

function getAdviceItemHtml(summaryHtml, detailHtml) {
    return `<li class="advice-item">
        <p class="advice-summary">${summaryHtml}</p>
        <button type="button" class="show-more">Show more</button>
        <div class="advice-detail" hidden="hidden">${detailHtml}</div>
    </li>`;
}

function getAdviceHtml(adviceMatches) {
    if (adviceMatches.length > 0) {
        var html = '<ol class="advice-list">';
        adviceMatches.forEach(adviceMatch => {
            html += getAdviceItemHtml(adviceMatch[2], adviceMatch[3]);
        });
        html += '</ol>';
        return html;
    }
    return '<p class="advice-success">You used all the possible Claritish options!</p>';
}

function getFeaturesHtml() {
    var html = '<ul class="features-list">';
    rules.forEach(rule => {
        html += `<li class="features-item">${rule.showMore}</li>`;
    });
    html += '</ul>';
    return html;
}

function updateAdvicebox(html) {
    advicebox.classList.remove('advice-visible');
    advicebox.classList.add('advice-updating');
    advicebox.innerHTML = html;
    advicebox.classList.remove('advice-welcome');
    requestAnimationFrame(function () {
        advicebox.classList.remove('advice-updating');
        advicebox.classList.add('advice-visible');
    });
}

advicebox.addEventListener('click', function (event) {
    var button = event.target.closest('.show-more');
    if (!button) return;
    var item = button.closest('.advice-item');
    if (!item) return;
    var detail = item.querySelector('.advice-detail');
    if (!detail) return;
    var isHidden = detail.hasAttribute('hidden');
    if (isHidden) {
        detail.removeAttribute('hidden');
        button.textContent = 'Show less';
    } else {
        detail.setAttribute('hidden', 'hidden');
        button.textContent = 'Show more';
    }
});

function escapeHtml(unsafeText) {
    return unsafeText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
};

// Show the hints
document.querySelector("#hints-button").onclick = function (event) {
    event.preventDefault();
    text = removeAdviceReferences(textbox.value);
    const matches = getAdviceMatches(text);
    updateAdvicebox(getAdviceHtml(matches));
    textbox.value = addAdviceReferences(text, matches);
};

document.querySelector("#features-button").onclick = function (event) {
    event.preventDefault();
    updateAdvicebox(getFeaturesHtml());
};

var fontSizeInput = document.querySelector('#font-size-input');
var FONT_SIZE_MIN = 8;
var FONT_SIZE_MAX = 72;
var FONT_SIZE_STEP = 1;
var FONT_SIZE_DEFAULT = 16;

function setFontSize(sizePx) {
    var size = Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, Math.round(Number(sizePx))));
    if (Number.isNaN(size)) size = FONT_SIZE_DEFAULT;
    document.documentElement.style.setProperty('--editor-font-size', size + 'px');
    fontSizeInput.value = String(size);
    localStorage.setItem('fontSize', String(size));
}

setFontSize(localStorage.getItem('fontSize') || FONT_SIZE_DEFAULT);

document.querySelector('#font-decrease').onclick = function (event) {
    event.preventDefault();
    setFontSize(Number(fontSizeInput.value) - FONT_SIZE_STEP);
};

document.querySelector('#font-increase').onclick = function (event) {
    event.preventDefault();
    setFontSize(Number(fontSizeInput.value) + FONT_SIZE_STEP);
};

fontSizeInput.onchange = function () {
    setFontSize(this.value);
};

function calcScore() {
    let text = textbox.value;
    var score = 0;
    for (const rule of rules) {
        const matches = text.match(new RegExp(rule.followed, 'ig'));
        if (matches) score += matches.length * rule.points;
    }
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
document.querySelector("#about-icon").onclick = function (event) {
    event.preventDefault();
    document.querySelector("#about").showModal();
};
