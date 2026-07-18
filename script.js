import { EditorState, StateEffect, StateField } from "@codemirror/state";
import {
    EditorView,
    Decoration,
    placeholder,
    showTooltip,
} from "@codemirror/view";
import { minimalSetup } from "codemirror";

const rules = window.rules;
const editorHost = document.querySelector('#textbox');
const saveTimeoutID = { id: null };
const analyzeTimeoutID = { id: null };
const ANALYZE_IDLE_MS = 2000;
const filenameBox = document.querySelector('#filename');

let editorView;
let currentAdviceMatches = [];

const setAdviceMarks = StateEffect.define();
const setAdviceTooltip = StateEffect.define();

const adviceMarksField = StateField.define({
    create() {
        return Decoration.none;
    },
    update(deco, tr) {
        deco = deco.map(tr.changes);
        for (const effect of tr.effects) {
            if (effect.is(setAdviceMarks)) {
                deco = effect.value;
            }
        }
        return deco;
    },
    provide: (field) => EditorView.decorations.from(field),
});

const adviceTooltipField = StateField.define({
    create() {
        return null;
    },
    update(value, tr) {
        for (const effect of tr.effects) {
            if (effect.is(setAdviceTooltip)) {
                return effect.value;
            }
        }
        if (tr.docChanged) return null;
        if (tr.selection) {
            const index = getAdviceIndexAt(tr.newSelection.main.head);
            if (index === null) return null;
            const next = createAdviceTooltip(index);
            if (value && next && value.pos === next.pos && value.end === next.end) return value;
            return next;
        }
        return value;
    },
    provide: (field) => showTooltip.from(field),
});

function getText() {
    return editorView.state.doc.toString();
}

function setText(str) {
    editorView.dispatch({
        changes: { from: 0, to: editorView.state.doc.length, insert: str },
        selection: { anchor: str.length },
    });
}

function clearAdviceMarks() {
    currentAdviceMatches = [];
    editorView.dispatch({
        effects: [
            setAdviceMarks.of(Decoration.none),
            setAdviceTooltip.of(null),
        ],
    });
}

function clearStickyTooltip() {
    editorView.dispatch({ effects: setAdviceTooltip.of(null) });
}

function storeLocally() {
    localStorage.setItem('browserpad', getText());
}

function calcScore() {
    const text = getText();
    let score = 0;
    for (const rule of rules) {
        const matches = text.match(new RegExp(rule.followed, 'ig'));
        if (matches) score += matches.length * rule.points;
    }
    document.querySelector('#score').textContent = score;
}

function onEditorUpdate(update) {
    if (!update.docChanged) return;
    calcScore();
    window.clearTimeout(saveTimeoutID.id);
    saveTimeoutID.id = window.setTimeout(storeLocally, 1000);
    window.clearTimeout(analyzeTimeoutID.id);
    analyzeTimeoutID.id = window.setTimeout(runAnalyze, ANALYZE_IDLE_MS);
}

function getAdviceMatches(text) {
    const adviceMatches = [];
    rules.forEach((rule) => {
        for (const match of text.matchAll(new RegExp(rule.violation, 'ig'))) {
            const matchedText = match[0];
            const advice = rule.description.replaceAll("{match}", escapeHtml(matchedText || ''));
            adviceMatches.push([match.index, matchedText, advice, rule.showMore, rule.name]);
        }
    });
    adviceMatches.sort((a, b) => a[0] - b[0]);
    return adviceMatches;
}

function removeAdviceReferences(text) {
    return text.replace(/\[\d+\]/g, '');
}

function buildAdviceDecorations(matches) {
    const marks = matches.map((match, index) => {
        const from = match[0];
        const to = from + match[1].length;
        return Decoration.mark({
            class: "cm-advice-mark",
            attributes: { "data-advice-index": String(index) },
        }).range(from, to);
    });
    return Decoration.set(marks, true);
}

function getAdviceIndexAt(pos) {
    for (let i = 0; i < currentAdviceMatches.length; i++) {
        const from = currentAdviceMatches[i][0];
        const to = from + currentAdviceMatches[i][1].length;
        if (pos >= from && pos <= to) return i;
    }
    return null;
}

function createAdviceTooltip(index) {
    const match = currentAdviceMatches[index];
    if (!match) return null;
    const from = match[0];
    const to = from + match[1].length;
    return {
        pos: from,
        end: to,
        above: true,
        arrow: true,
        create() {
            const dom = document.createElement('div');
            dom.className = 'cm-advice-tooltip cm-advice-tooltip-detail';
            const title = document.createElement('strong');
            title.textContent = match[4];
            const detail = document.createElement('div');
            detail.className = 'cm-advice-detail';
            detail.innerHTML = match[3];
            dom.append(title, detail);
            return { dom };
        },
    };
}

function getFeaturesHtml() {
    let html = '<ul class="features-list">';
    rules.forEach((rule) => {
        html += `<li class="features-item"><strong class="features-name">${escapeHtml(rule.name)}</strong>${rule.showMore}</li>`;
    });
    html += '</ul>';
    return html;
}

function escapeHtml(unsafeText) {
    return unsafeText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

const editorTheme = EditorView.theme({
    "&": {
        height: "100%",
        backgroundColor: "transparent",
    },
    ".cm-scroller": {
        fontFamily: 'var(--font-sans)',
        lineHeight: "1.55",
    },
    ".cm-content": {
        fontFamily: 'inherit',
        fontSize: "var(--editor-font-size)",
        lineHeight: "inherit",
        color: "var(--color-ink)",
        caretColor: "var(--color-ink)",
        padding: "var(--space-lg) var(--space-xl)",
    },
    ".cm-gutters": {
        display: "none",
    },
    "&.cm-focused .cm-cursor": {
        borderLeftColor: "var(--color-ink)",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
        backgroundColor: "rgba(74, 107, 82, 0.2) !important",
    },
    ".cm-activeLine": {
        backgroundColor: "transparent",
    },
    ".cm-placeholder": {
        color: "var(--color-ink-faint)",
        fontStyle: "normal",
    },
});

let savedText = removeAdviceReferences(localStorage.getItem('browserpad') || '');

const editorExtensions = [
    ...minimalSetup,
    EditorView.lineWrapping,
    placeholder("Write here…"),
    adviceMarksField,
    adviceTooltipField,
    editorTheme,
    EditorView.updateListener.of(onEditorUpdate),
];

editorView = new EditorView({
    state: EditorState.create({
        doc: savedText,
        extensions: editorExtensions,
    }),
    parent: editorHost,
});

editorView.focus();
calcScore();
window.beforeunload = storeLocally;

if (localStorage.getItem('daysVisited') === null) {
    localStorage.setItem('daysVisited', '');
}
const dateString = new Date().toISOString().slice(0, 10);
let daysVisited = localStorage.getItem('daysVisited').split(',');

if (!daysVisited.includes(dateString)) {
    daysVisited.push(dateString);
    localStorage.setItem('daysVisited', daysVisited.join(','));
}
document.querySelector('#days').textContent = daysVisited.length;

document.querySelector('#updated').textContent = new Date(document.lastModified)
    .toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit',
    });

filenameBox.placeholder = "claritish_" + dateString + ".txt";

function runAnalyze() {
    let text = removeAdviceReferences(getText());
    if (text !== getText()) {
        setText(text);
    }
    clearStickyTooltip();
    const matches = getAdviceMatches(text);
    currentAdviceMatches = matches;
    editorView.dispatch({
        effects: setAdviceMarks.of(buildAdviceDecorations(matches)),
    });
}

if (savedText.trim()) {
    runAnalyze();
}

const featuresDialog = document.querySelector("#features");
const featuresBody = document.querySelector("#features-body");

document.querySelector("#features-button").onclick = function (event) {
    event.preventDefault();
    featuresBody.innerHTML = getFeaturesHtml();
    featuresDialog.showModal();
};

const fontSizeInput = document.querySelector('#font-size-input');
const FONT_SIZE_MIN = 8;
const FONT_SIZE_MAX = 72;
const FONT_SIZE_STEP = 1;
const FONT_SIZE_DEFAULT = 16;

function setFontSize(sizePx) {
    let size = Math.min(FONT_SIZE_MAX, Math.max(FONT_SIZE_MIN, Math.round(Number(sizePx))));
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

document.querySelector('#download a').onclick = function () {
    this.download = (filenameBox.value || filenameBox.placeholder).replace(/^([^.]*)$/, "$1.txt");
    this.href = URL.createObjectURL(new Blob([getText()], { type: 'text/plain' }));
};

document.querySelector('#open a').onclick = function () {
    document.querySelector('#open input').click();
};
document.querySelector('#open input').onchange = function () {
    const reader = new FileReader();
    reader.file = this.files[0];
    reader.onload = function () {
        filenameBox.value = this.file.name;
        setText(this.result);
        clearAdviceMarks();
        calcScore();
    };
    reader.readAsText(this.files[0]);
};

document.onkeydown = function (event) {
    if (event.key === "Escape") {
        clearStickyTooltip();
    }
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
};

document.querySelector("#about-icon").onclick = function (event) {
    event.preventDefault();
    document.querySelector("#about").showModal();
};
