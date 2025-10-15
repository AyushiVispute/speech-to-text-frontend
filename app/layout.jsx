import './globals.css'

export const metadata = {
  title: 'Speech-to-Text App',
  description: 'Convert your speech into text in real time',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <header className="bg-white shadow p-4 sticky top-0 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-600">Speech-to-Text</h1>
            <nav>
              <a href="/" className="mr-4 hover:text-blue-500">Home</a>
              <a href="/history" className="hover:text-blue-500">History</a>
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  )
}
