import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="text-center">
        <div className="flex justify-center gap-4 mb-8">
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="h-16 w-16 animate-spin-slow" alt="React logo" />
          </a>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Vite + React</h1>
        <div className="card bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            onClick={() => setCount((count) => count + 1)}
          >
            Count is {count}
          </button>
          <p className="mt-4 text-gray-600">
            Edit <code className="bg-gray-200 px-1 rounded">src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs text-gray-500 mt-8">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App