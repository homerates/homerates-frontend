import { marked } from "marked"

export function MessageBubble({ role, content }) {
  const isUser = role === "user"
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <div className="h-8 w-8 rounded-full bg-black text-white grid place-items-center">HR</div>}
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${isUser ? "bg-blue-600 text-white" : "bg-white border"}`}>
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: marked.parse(content || "") }}
        />
      </div>
      {isUser && <div className="h-8 w-8 rounded-full bg-blue-600 text-white grid place-items-center">You</div>}
    </div>
  )
}
