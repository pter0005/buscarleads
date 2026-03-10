'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Zap, Bot, User, Loader2, X, MessageSquare, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
  search?: { nicho: string; cidade: string }
}

interface AiChatProps {
  onSearch: (nicho: string, cidade: string) => void
  loading?: boolean
}

export function AiChat({ onSearch, loading }: AiChatProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Olá! 👋 Sou o assistente da **NEW Agency**.\n\nMe diga qual nicho e cidade você quer prospectar:\n\n> "Barbearias em Arujá"\n> "Salões de cabeleireiro em Guarulhos"\n> "Restaurantes em Mogi das Cruzes"`,
    },
  ])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = async () => {
    const msg = input.trim()
    if (!msg || thinking) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setThinking(true)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history }),
      })
      const data = await res.json()

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        search: data.search,
      }])

      // Se detectou busca, dispara automaticamente
      if (data.type === 'search_trigger' && data.search) {
        setTimeout(() => {
          onSearch(data.search.nicho, data.search.cidade)
          setOpen(false)
        }, 1200)
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erro ao conectar. Tente novamente.' }])
    } finally {
      setThinking(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const triggerSearch = (nicho: string, cidade: string) => {
    onSearch(nicho, cidade)
    setOpen(false)
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer',
          open
            ? 'bg-surface-card border border-surface-border text-gray-400 rotate-0'
            : 'bg-brand text-surface hover:bg-brand-dim hover:scale-105'
        )}
      >
        {open ? <X className="w-5 h-5" /> : <MessageSquare className="w-6 h-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-surface animate-pulse" />
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[520px] bg-surface-card border border-surface-border rounded-2xl flex flex-col shadow-2xl shadow-black/50 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-surface-border bg-surface-elevated">
            <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-surface" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Assistente SWAS</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Online • NEW Agency
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-brand/20 border border-brand/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-brand" />
                  </div>
                )}
                <div className={cn(
                  'max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-brand text-surface font-medium rounded-tr-sm'
                    : 'bg-surface-elevated border border-surface-border text-gray-300 rounded-tl-sm'
                )}>
                  {/* Markdown simples */}
                  {msg.content.split('\n').map((line, j) => (
                    <p key={j} className={line.startsWith('>') ? 'pl-2 border-l-2 border-brand/40 text-brand/80 text-xs my-0.5' : 'my-0.5'}>
                      {line.replace(/\*\*(.*?)\*\*/g, '$1').replace(/^> /, '')}
                    </p>
                  ))}
                  {/* Botão de busca se detectou intenção */}
                  {msg.search && (
                    <button
                      onClick={() => triggerSearch(msg.search!.nicho, msg.search!.cidade)}
                      className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-brand text-surface text-xs font-bold rounded-lg hover:bg-brand-dim transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      Buscar {msg.search.nicho} em {msg.search.cidade}
                    </button>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-surface-elevated border border-surface-border flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
            {thinking && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-lg bg-brand/20 border border-brand/30 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-brand" />
                </div>
                <div className="bg-surface-elevated border border-surface-border rounded-2xl rounded-tl-sm px-3 py-2">
                  <Loader2 className="w-4 h-4 text-brand animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-surface-border">
            <div className="flex gap-2 items-end">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ex: barbearias em Arujá..."
                rows={1}
                className="flex-1 bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand/50 resize-none transition-colors duration-200"
              />
              <button
                onClick={send}
                disabled={!input.trim() || thinking}
                className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center hover:bg-brand-dim transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4 text-surface" />
              </button>
            </div>
            <p className="text-xs text-gray-700 text-center mt-1.5">Enter para enviar • powered by NEW Agency</p>
          </div>
        </div>
      )}
    </>
  )
}
