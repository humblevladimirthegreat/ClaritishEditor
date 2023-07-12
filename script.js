var textbox = document.querySelector('#textbox');
var timeoutID = null;
var filenameBox = document.querySelector('#filename');

// Automatically load/save cache in local storage when opening and closing the page
textbox.value = localStorage.getItem('browserpad') || '';
//textbox.setSelectionRange(textbox.value.length, textbox.value.length); // Place caret at end of content
calcStats(); // Update counters after loading
function storeLocally() { localStorage.setItem('browserpad', textbox.value); }
window.beforeunload = storeLocally;

// Allow inputting tabs in the textarea instead of changing focus to the next element
textbox.onkeypress = function (event) {
    if (event.key === "Tab") {
        event.preventDefault();
        var text = this.value, s = this.selectionStart, e = this.selectionEnd;
        this.value = text.substring(0, s) + '\t' + text.substring(e);
        this.selectionStart = this.selectionEnd = s + 1;
    }
};

// Auto-save to local storage and calculate stats on every keystroke
textbox.onkeyup = function () {
    calcStats();
    window.clearTimeout(timeoutID); // Prevent saving too frequently
    timeoutID = window.setTimeout(storeLocally, 1000);
};

textbox.addEventListener('input', function (event) {
    let text = event.target.textContent

    console.debug("current text is:", text)
    
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const startOffset = range.startOffset;
    
    textbox.innerHTML = check_claritish(text)

    // Restore cursor position
    const newRange = document.createRange();
    const newSelection = window.getSelection();
    const nodes = event.target.childNodes;
    let node;
    let offset = 0;
    for (let i = 0; i < nodes.length; i++) {
      node = nodes[i];
      if (node.nodeType === Node.TEXT_NODE) {
        offset += node.length;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const className = node.getAttribute('class');
        if (className === 'blue-squiggle') {
          break;
        }
      }
    }
    newRange.setStart(node, startOffset);
    newRange.setEnd(node, startOffset);
    newSelection.removeAllRanges();
    newSelection.addRange(newRange);
});

// Calculate and display character, words and line counts
function calcStats() {
    updateCount('char', textbox.value.length);
    updateCount('word', textbox.value === "" ? 0 : textbox.value.replace(/\s+/g, ' ').split(' ').length);
    updateCount('line', textbox.value === "" ? 0 : textbox.value.split(/\n/).length);
}
function updateCount(item, value) {
    document.querySelector('#' + item + '-count').textContent = value;
}

// Save textarea contents as a text file
document.querySelector('#save a').onclick = function () {
    this.download = (filenameBox.value || 'browserpad.txt').replace(/^([^.]*)$/, "$1.txt");
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

// Toggle spell-checking
document.querySelector('#spellcheck').onchange = function () {
    textbox.spellcheck = this.checked;
};
textbox.spellcheck = document.querySelector('#spellcheck').checked; // Initialize

// Print the content
document.querySelector("#print").onclick = function () {
    window.print();
};

// Keyboard shortcuts for the save and load functions (`Ctrl+S`, `Ctrl+O`)
document.onkeydown = function (event) {
    if (event.ctrlKey) {
        if (event.key === "s") {
            document.querySelector('#save a').click();
            event.preventDefault();
        }
        else if (event.key === "o") {
            document.querySelector('#open input').click();
            event.preventDefault();
        }
    }
}

// handle Claritish checking. Returns the HTML to replace the content with
check_claritish = function(text) {
    console.debug('current value:', text)

    const regex = /\bI\b/g;

    const matches = text.match(regex);

    if (matches && matches.length > 0) {
      const highlightedText = text.replace(regex, '<span class="blue-squiggle" data-tooltip="Don\'t use the word I">$&</span>');
      console.debug('set innerHtml to', highlightedText)
      return highlightedText;
    } else {
      return text;
    }
  };

// Show the about dialog
document.querySelector("#about-icon").onclick = function () {
    document.querySelector("#about").showModal();
};
