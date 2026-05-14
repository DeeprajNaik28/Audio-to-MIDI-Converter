import { useRef, useState } from "react";
import { PitchDetector } from "pitchy";
import { WebMidi } from "webmidi";

import Piano from "./components/Piano";

export default function App() {
  const [note, setNote] = useState("--");
  const [frequency, setFrequency] =
    useState("--");

  const [status, setStatus] =
    useState("Idle");

  const [midiStatus, setMidiStatus] =
    useState("Disconnected");

  const [listening, setListening] =
    useState(false);

  const animationRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);

  const noteStrings = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  function frequencyToMidi(freq) {
    return Math.round(
      12 * Math.log2(freq / 440) + 69
    );
  }

  function midiToNoteName(midi) {
    const note = noteStrings[midi % 12];

    const octave =
      Math.floor(midi / 12) - 1;

    return `${note}${octave}`;
  }

  async function setupMidi() {
    try {
      await WebMidi.enable();

      const output = WebMidi.outputs.find(
        (o) => o.name.includes("ToyMIDI")
      );

      if (!output) {
        setMidiStatus(
          "ToyMIDI port not found"
        );

        return null;
      }

      setMidiStatus("Connected");

      return output;
    } catch (err) {
      console.error(err);

      setMidiStatus("MIDI Failed");

      return null;
    }
  }

  async function startListening() {
    if (listening) return;

    try {
      setListening(true);

      const midiOutput =
        await setupMidi();

      setStatus(
        "Requesting microphone..."
      );

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        );

      streamRef.current = stream;

      const audioContext =
        new AudioContext();

      audioContextRef.current =
        audioContext;

      const source =
        audioContext.createMediaStreamSource(
          stream
        );

      const analyser =
        audioContext.createAnalyser();

      analyser.fftSize = 2048;

      source.connect(analyser);

      const detector =
        PitchDetector.forFloat32Array(
          analyser.fftSize
        );

      const input = new Float32Array(
        analyser.fftSize
      );

      let stableNote = null;
      let stableCount = 0;
      let lastSentNote = null;
      let lastMidiTime = 0;

      setStatus("Listening...");

      function detectPitch() {
        analyser.getFloatTimeDomainData(
          input
        );

        const [pitch, clarity] =
          detector.findPitch(
            input,
            audioContext.sampleRate
          );

        const now = Date.now();

        if (
          clarity > 0.97 &&
          pitch > 80 &&
          pitch < 1200
        ) {
          const midi =
            frequencyToMidi(pitch);

          const noteName =
            midiToNoteName(midi);

          setFrequency(
            pitch.toFixed(1)
          );

          setNote(noteName);

          if (
            noteName === stableNote
          ) {
            stableCount++;
          } else {
            stableNote = noteName;
            stableCount = 1;
          }

          if (
            stableCount >= 8 &&
            noteName !== lastSentNote &&
            now - lastMidiTime > 700
          ) {
            if (midiOutput) {
              midiOutput.playNote(
                noteName,
                {
                  duration: 180,
                }
              );

              lastSentNote =
                noteName;

              lastMidiTime = now;
            }
          }
        }

        animationRef.current =
          requestAnimationFrame(
            detectPitch
          );
      }

      detectPitch();
    } catch (error) {
      console.error(error);

      setStatus(
        "Microphone denied"
      );

      setListening(false);
    }
  }

  function stopListening() {
    if (animationRef.current) {
      cancelAnimationFrame(
        animationRef.current
      );
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) =>
          track.stop()
        );
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setListening(false);

    setStatus("Stopped");

    setMidiStatus("Disconnected");

    setNote("--");

    setFrequency("--");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #020617, #0f172a, #1e293b)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily:
          "Inter, Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background:
            "rgba(15,23,42,0.92)",
          backdropFilter: "blur(10px)",
          borderRadius: "28px",
          padding: "30px",
          border:
            "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 0 50px rgba(99,102,241,0.15)",
          color: "white",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          <h1
            style={{
              fontSize: "34px",
              marginBottom: "8px",
color: "white",
            }}
          >
            🎹 Toy Keyboard MIDI
          </h1>

          <p
            style={{
              opacity: 0.75,
              fontSize: "15px",
            }}
          >
            Experimental audio-to-MIDI
            converter
          </p>
        </div>

        <div
          style={{
            background:
              "linear-gradient(to bottom right, #1e293b, #0f172a)",
            borderRadius: "22px",
            padding: "30px",
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              fontSize: "82px",
              fontWeight: "bold",
              lineHeight: 1,
              textShadow:
                "0 0 20px rgba(99,102,241,0.6)",
            }}
          >
            {note}
          </div>

          <div
            style={{
              marginTop: "12px",
              fontSize: "18px",
              opacity: 0.8,
            }}
          >
            {frequency} Hz
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              background: "#111827",
              padding: "16px",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                opacity: 0.7,
                fontSize: "14px",
              }}
            >
              Status
            </div>

            <div
              style={{
                marginTop: "6px",
                fontWeight: "bold",
              }}
            >
              {status}
            </div>
          </div>

          <div
            style={{
              background: "#111827",
              padding: "16px",
              borderRadius: "16px",
            }}
          >
            <div
              style={{
                opacity: 0.7,
                fontSize: "14px",
              }}
            >
              MIDI
            </div>

            <div
              style={{
                marginTop: "6px",
                fontWeight: "bold",
              }}
            >
              {midiStatus}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "28px",
          }}
        >
          <button
            onClick={startListening}
            disabled={listening}
            style={{
              flex: 1,
              padding: "15px",
              border: "none",
              borderRadius: "16px",
              background: listening
                ? "#374151"
                : "#6366f1",
              color: "white",
              fontWeight: "bold",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            Start
          </button>

          <button
            onClick={stopListening}
            disabled={!listening}
            style={{
              flex: 1,
              padding: "15px",
              border: "none",
              borderRadius: "16px",
              background: !listening
                ? "#374151"
                : "#ef4444",
              color: "white",
              fontWeight: "bold",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            Stop
          </button>
        </div>

        <Piano activeNote={note} />
      </div>
    </div>
  );
}