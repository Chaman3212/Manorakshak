import React, { useState } from 'react'

export default function App() {
  const [length, setLength] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function analyze() {
    try {
      setLoading(true)
      setError('')
      setLength(null)
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.body.innerText
      })
      setLength(result.length)
    } catch (e) {
      setError('Failed to analyze page')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="title">ManoRakshak</div>
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="muted" style={{ marginBottom: 8 }}>Analyze the current page for content length</div>
        <button className="btn" onClick={analyze} disabled={loading}>
          {loading ? 'Analyzing…' : 'Analyze Page'}
        </button>
      </div>
      <div className="card">
        {error && <div style={{ color: '#ef4444', marginBottom: 8 }}>{error}</div>}
        {length === null ? (
          <div className="muted">No analysis yet.</div>
        ) : (
          <div>Page text length: <strong>{length.toLocaleString()}</strong></div>
        )}
      </div>
    </div>
  )
} 