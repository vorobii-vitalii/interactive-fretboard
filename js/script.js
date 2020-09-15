const root = document.documentElement;

const fretBoard = document.querySelector('.fretboard');
const instrumentSelector = document.querySelector('#instrument_selector');
const accidentalSelector = document.querySelector('#accidental-selector');
const numberOfFretsSelector = document.querySelector('#number-frets-selector');

let numOfThreads = 20;

const STRING_CLASS = 'string';
const NOTE_THREAD_CLASS = 'note-fret';

const NUM_POSSIBLE_NOTES = 12;

const singleFretMarkPositions = [
	3, 5, 7, 9, 15, 19, 21
];

const doubleFretMarkPositions = [
	12, 24
];

const noteFlats = [
	"C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"
];

const noteSharps = [
	"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];

let accidentals = 'flats';

const guitarTuning = [
	4, 11, 7, 2, 9, 4
];

const instrumentTuningPresets = {
	'Guitar': { tuning: [ 4, 11, 7, 2, 9, 4 ] },
	'Bass (4 strings)': { tuning: [ 7, 2, 9, 4] },
	'Bass (5 strings)': { tuning: [ 7, 2, 9, 4, 11] },
	'Ukulele': { tuning: [ 9, 4, 0, 7] },
};

let selectedInstrument = 'Guitar';

let numOfStrings = instrumentTuningPresets[selectedInstrument].tuning.length;

const switchTheme = theme => {
	if (theme == 'light') {
		root.style.setProperty('--background-color', '#fff');
		root.style.setProperty('--text-color', 'black');
	} 
	else if(theme =='dark') {
		root.style.setProperty('--background-color', 'black');
		root.style.setProperty('--text-color', '#fff');
	}
};

let colorTheme = 'light';

const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

if (prefersDarkScheme.matches) {
  colorTheme = 'dark';
} else {
  colorTheme =  'light';
}

switchTheme(colorTheme);


const app = {
	init() {
		this.setupFretboard();
		this.setupInstrumentTuningPresets();
		this.setupEventListeners();
	},
	setupFretboard() {

		fretBoard.innerHTML = '';
		
		// Set CSS variables
		root.style.setProperty('--number-of-strings', numOfStrings);

		// Add strings to fretboard
		for (let currentString = 0; currentString < numOfStrings; currentString++) {
			const string = tools.createElement('div');
			string.classList.add(STRING_CLASS);
			fretBoard.appendChild(string);
			
			let currentNote = instrumentTuningPresets[selectedInstrument].tuning[currentString];

			// Attach threads
			for (let currentThread = 0; currentThread <= numOfThreads; currentThread++) {
				const noteThread = tools.createElement('div');
				noteThread.classList.add(NOTE_THREAD_CLASS);
				const theNoteToShow = this.generateNoteNames(currentNote++);
				noteThread.dataset.content = theNoteToShow;
				if (currentString == 0) {
					if (tools.elementContainsInArray(currentThread, singleFretMarkPositions)) {
						noteThread.classList.add('single-fretmark');
					}
					if (tools.elementContainsInArray(currentThread, doubleFretMarkPositions)) {
						const doubleFretMark = tools.createElement('div');
						doubleFretMark.classList.add('double-fretmark');
						noteThread.appendChild(doubleFretMark);
					}

				}
				string.appendChild(noteThread);
			}
		}
	},
	setupInstrumentTuningPresets() {
		for (const instrumentTuning in instrumentTuningPresets) {
			const option = tools.createElement('option', instrumentTuning);
			option.setAttribute('value', instrumentTuning);
			instrumentSelector.appendChild(option);
		}
	},
	generateNoteNames(noteIndex) {
		noteIndex %= NUM_POSSIBLE_NOTES;
		let noteName;
		if (accidentals == 'flats') {
			noteName = noteFlats[noteIndex];
		} else {
			noteName = noteSharps[noteIndex];
		}
		return noteName;
	},
	setupEventListeners() {
		instrumentSelector.addEventListener('change', e => {
			selectedInstrument = e.target.value;
			numOfStrings = instrumentTuningPresets[selectedInstrument].tuning.length;
			this.setupFretboard();
		});
		accidentalSelector.addEventListener('change', e => {
			accidentals = e.target.value;
			this.setupFretboard();
		});
		numberOfFretsSelector.addEventListener('change', e => {
			console.log('Got value');
			numOfThreads = Number.parseInt(e.target.value, 10);
			this.setupFretboard();
		});
	},
};


const tools = {
	createElement(element, content = '') {
		const htmlElement = document.createElement(element);
		if (content !== '') {
			htmlElement.innerHTML = content;
		}
		return htmlElement;
	},
	elementContainsInArray(elementToCheck, array) {
		for (const element of array) {
			if (element == elementToCheck) {
				return true;
			}
		}
		return false;
	}
};

app.init();