'use client'
import { useState, useRef } from 'react'

export default function HomePage() {
  const [recording, setRecording] = useState(false)
  const [audioURL, setAudioURL] = useState('')
  const [transcript, setTranscript] = useState('')
  const [timer, setTimer] = useState(0)
  const mediaRecorder = useRef(null)
  const chunks = useRef([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      chunks.current = []

      mediaRecorder.current.ondataavailable = e => chunks.current.push(e.data)
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioURL(url)
      }

      mediaRecorder.current.start()
      setRecording(true)
      setTimer(0)
      const interval = setInterval(() => setTimer(prev => prev + 1), 1000)
      mediaRecorder.current.onstop = () => clearInterval(interval)
    } catch (err) {
      alert('Microphone access denied or error starting recording.')
      console.error(err)
    }
  }

  const stopRecording = () => {
    mediaRecorder.current?.stop()
    setRecording(false)
  }

  const uploadForTranscription = async () => {
    if (!audioURL) return alert('No audio recorded yet.')
    const blob = new Blob(chunks.current, { type: 'audio/webm' })
    const file = new File([blob], 'speech.webm', { type: 'audio/webm' })

    const form = new FormData()
    form.append('file', file)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/transcribe`, {
        method: 'POST',
        body: form,
      })
      const data = await res.json()
      setTranscript(data.transcript || 'Transcription result will appear here...')
    } catch (err) {
      console.error('Upload failed:', err)
    }
  }

  return (
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-semibold mb-6">🎤 Record and Transcribe</h2>

      <div className="flex justify-center gap-4 mb-6">
        {!recording ? (
          <button
            onClick={startRecording}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            Stop Recording ({timer}s)
          </button>
        )}
      </div>

      {audioURL && (
        <div className="mb-4">
          <audio controls src={audioURL} className="mx-auto mb-4"></audio>
          <button
            onClick={uploadForTranscription}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Upload & Transcribe
          </button>
        </div>
      )}

      {transcript && (
        <div className="mt-8 bg-white shadow p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">📝 Transcribed Text:</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{transcript}</p>
        </div>
      )}
      <div className="text-4xl font-bold text-pink-600">Tailwind Working 🎉</div>
    </div>
  )
}
