import { useState } from "react"

export function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("")
  async function submit(e) {
    e.preventDefault()
    if (!value.trim()) return
    await onSend(value)
    setValue("")
  }
  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        className="flex-1 border rounded-xl px-3 py-2"
        placeholder="Ask about rates, loans, fees…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />
      <button
        className="rounded-xl px-4 py-2 bg-blue-600 text-white disabled:opacity-50"
        disabled={disabled}
      >
        Send
      </button>
    </form>
  )
}
