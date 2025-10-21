
'use client';
import { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import toast, { Toaster } from 'react-hot-toast';

export default function HomePage() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [transcript, setTranscript] = useState('');
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const timerInterval = useRef(null);
  const waveformRef = useRef(null);
  const waveSurfer = useRef(null);

  // 🌙 Dark Mode Toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // 🎧 Initialize WaveSurfer
  useEffect(() => {
    waveSurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#a78bfa',
      progressColor: '#f43f5e',
      cursorWidth: 0,
      height: 80,
      barWidth: 2,
    });
    return () => waveSurfer.current?.destroy();
  }, []);

  // 🎙️ Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = e => {
        if (e.data && e.data.size > 0) chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        clearInterval(timerInterval.current);
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        waveSurfer.current.load(url);
        toast.success('🎧 Recording stopped and waveform loaded!');
      };

      mediaRecorder.current.start();
      setRecording(true);
      setTimer(0);
      timerInterval.current = setInterval(() => setTimer(prev => prev + 1), 1000);
      toast('🎙️ Recording started!', { icon: '🔴' });
    } catch (err) {
      toast.error('Microphone access denied.');
      console.error(err);
    }
  };

  // ⏹️ Stop Recording
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
    setRecording(false);
  };

  // ☁️ Upload & Transcribe
  const uploadForTranscription = async () => {
    if (!chunks.current.length) return toast.error('No audio recorded yet!');

    const blob = new Blob(chunks.current, { type: 'audio/webm' });
    const file = new File([blob], 'speech.webm', { type: 'audio/webm' });

    const form = new FormData();
    form.append('file', file);

    try {
      setLoading(true);
      setTranscript('');
      toast.loading('⏳ Transcribing your audio...');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/transcribe`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      setTranscript(data.transcript || data.error || 'No transcript received.');
      toast.dismiss();
      toast.success('✅ Transcription complete!');
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error('❌ Upload or transcription failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${
        darkMode
          ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100'
          : 'bg-gradient-to-br from-indigo-100 via-white to-rose-100 text-gray-900'
      }`}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#fff',
            borderRadius: '10px',
            padding: '10px 15px',
          },
          success: {
            iconTheme: {
              primary: '#6366F1',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* 🌙 Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-md transition-all hover:scale-105"
        title="Toggle Dark Mode"
      >
        {darkMode ? '🌙' : '☀️'}
      </button>

      {/* 🏠 Main Container */}
      <div className="max-w-3xl mx-auto text-center pt-20 pb-16">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-500 to-rose-500 bg-clip-text text-transparent">
          🎤 Speech to Text Converter
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Record your voice, transcribe it instantly, and download your text.
        </p>

        {/* 🎙️ Record Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {!recording ? (
            <button
              onClick={startRecording}
              className="px-6 py-3 rounded-xl font-semibold text-white 
                         bg-gradient-to-r from-indigo-500 to-rose-500 
                         shadow-lg hover:shadow-rose-200 hover:scale-105 transition-all"
            >
              Start Recording 🎙️
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-6 py-3 rounded-xl font-semibold text-white 
                         bg-gradient-to-r from-rose-500 to-red-600 
                         shadow-lg hover:shadow-rose-300 hover:scale-105 transition-all"
            >
              Stop Recording ({timer}s)
            </button>
          )}
        </div>

        {/* 📈 Waveform Visualization */}
        <div ref={waveformRef} className="w-full mx-auto mb-4"></div>

        {/* 🎵 Audio Preview + Upload */}
        {audioURL && (
          <div className="mb-6">
            <audio controls src={audioURL} className="mx-auto mb-4 w-full max-w-md rounded-lg shadow"></audio>
            <button
              onClick={uploadForTranscription}
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white font-medium transition-all ${
                loading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-500 hover:to-rose-500 shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  Transcribing...
                </span>
              ) : (
                'Upload & Transcribe'
              )}
            </button>
          </div>
        )}

        {/* ✨ Compact & Scrollable Transcript Output */}
        {transcript && (
          <div className="mt-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-xl 
                          rounded-2xl p-6 border border-indigo-200/50 dark:border-gray-700 
                          transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]">
            <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-300 mb-3 
                           bg-gradient-to-r from-indigo-500 to-rose-500 bg-clip-text text-transparent">
              📝 Transcribed Text:
            </h3>

            {/* 🧾 Scrollable transcript box */}
            <div
              className="leading-relaxed whitespace-pre-wrap 
                         bg-gradient-to-r from-indigo-50 via-purple-50 to-rose-50 
                         dark:from-gray-800 dark:via-gray-900 dark:to-gray-800
                         text-gray-800 dark:text-gray-100 
                         border border-indigo-100 dark:border-gray-700
                         shadow-md rounded-xl p-4 font-medium tracking-wide
                         transition-all duration-300 hover:shadow-lg 
                         max-h-56 overflow-y-auto text-base sm:text-[15px]"
              style={{
                minHeight: '80px',
                lineHeight: '1.6',
              }}
            >
              {transcript}
            </div>

            {/* 📋 Copy & Download Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => navigator.clipboard.writeText(transcript)}
                className="px-4 py-2 text-sm font-medium text-white 
                           bg-gradient-to-r from-indigo-500 to-rose-500 
                           rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
              >
                📋 Copy
              </button>

              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(transcript)}`}
                download="transcript.txt"
                className="px-4 py-2 text-sm font-medium text-white 
                           bg-gradient-to-r from-purple-500 to-indigo-600 
                           rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
              >
                ⬇️ Download
              </a>
            </div>
          </div>
            
          )}
      </div>
    </div>
  );
}
