import { MessageBubble } from "./MessageBubble"

export function MessageList({ items }) {
  return (
    <div className="space-y-4">
      {items.map((m, i) => (
        <MessageBubble key={i} role={m.role} content={m.content} />
      ))}
    </div>
  )
}
