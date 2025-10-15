export default function AudioCard({ text, date, duration }) {
  return (
    <div className="bg-white shadow p-4 rounded-xl mb-3 hover:shadow-md transition">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">{date}</span>
        <span className="text-sm text-gray-500">{duration}s</span>
      </div>
      <p className="text-gray-800">{text}</p>
    </div>
  )
}
