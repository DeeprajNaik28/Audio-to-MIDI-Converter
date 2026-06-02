# 🎹 Audio To MIDI Converter

An experimental audio-to-MIDI web application that converts sounds from any toy keyboard or vocals into MIDI notes using real-time microphone pitch detection and the Web MIDI API.

Built with React, Vite, Pitchy, and WebMidi.

---
## 🌍 Live Demo
https://toy-keyboard-midi-converter.vercel.app/

---
## ✨ Features

* 🎤 Real-time microphone pitch detection
* 🎹 Converts audio sounds into MIDI notes
* 🎼 Sends MIDI output directly to FL Studio
* 💡 Live piano visualization
* ⚡ Real-time note and frequency display
* 🖥️ Responsive modern UI
* 🌐 Browser-based — no Arduino required
* 🔊 Experimental support for low-quality toy keyboards

---

## 🛠️ Tech Stack

* React
* Vite
* Web Audio API
* Pitchy
* WebMidi
* JavaScript
* HTML/CSS

---

## 🚀 How It Works

```text
Toy Keyboard
      ↓
Laptop Microphone
      ↓
Pitch Detection
      ↓
MIDI Conversion
      ↓
Virtual MIDI Port (loopMIDI)
      ↓
FL Studio
```

The application listens to audio from the toy keyboard through the microphone, detects the dominant pitch, converts it into MIDI notes, and sends the MIDI signal to FL Studio using a virtual MIDI connection.

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/toy-keyboard-midi-converter.git
```

Move into the project folder:

```bash
cd toy-keyboard-midi-converter
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

---

## 🎛️ FL Studio Setup

1. Install loopMIDI
2. Create a virtual MIDI port named:

```text
ToyMIDI
```

3. Open FL Studio
4. Go to:

```text
Options → MIDI Settings
```

5. Enable the `ToyMIDI` input port
6. Load any instrument (FL Keys, Piano, Synth, etc.)
7. Start the web app and play your toy keyboard

---

## 📱 Browser Support

Recommended browsers:

* Google Chrome
* Microsoft Edge

Web MIDI support may not work properly in Firefox.

---

## ⚠️ Limitations

This project is experimental and designed mainly for learning and creative exploration.

Toy keyboards for children often produce:

* unstable frequencies
* harmonics
* noisy speaker output
* inaccurate tuning

Because of this:

* note detection may occasionally be inaccurate
* chords are not supported
* some latency may occur
