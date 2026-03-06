'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import CompanyLayout from '../CompanyLayout'

const TEMPLATES = [
  { id: 1, name: 'Initial Outreach', subject: 'Interested in connecting!', body: "Hi {name},\n\nWe came across your profile on Signl and were impressed by your peer validations. We'd love to learn more about your experience and career goals.\n\nWould you be open to a quick chat?\n\nBest,\n{company}" },
  { id: 2, name: 'Interview Invite', subject: 'Interview Invitation', body: "Hi {name},\n\nThank you for your interest in {company}. We'd like to invite you for an interview to discuss the {role} position.\n\nPlease let us know your availability for next week.\n\nBest,\n{company}" },
  { id: 3, name: 'Request Introduction', subject: 'Introduction Request', body: "Hi {nominator},\n\nWe noticed you nominated {name} on Signl. We're interested in connecting with them about opportunities at {company}.\n\nWould you be willing to make an introduction?\n\nThank you,\n{company}" },
  { id: 4, name: 'Follow Up', subject: 'Following up', body: "Hi {name},\n\nJust wanted to follow up on my previous message. We're still very interested in learning more about you.\n\nLet me know if you'd like to chat!\n\nBest,\n{company}" },
]

export default function MessagesPage() {
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState([])
  const [selectedConvo, setSelectedConvo] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [showNewMessage, setShowNewMessage] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [newRecipient, setNewRecipient] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [customTemplates, setCustomTemplates] = useState([])
  const [showSaveTemplate, setShowSaveTemplate] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('signl_company_session') || '{}')
    setCompanyName(session.company?.name || 'Your Company')
    const saved = JSON.parse(localStorage.getItem('signl_messages') || '[]')
    setConversations(saved)
    const savedTemplates = JSON.parse(localStorage.getItem('signl_custom_templates') || '[]')
    setCustomTemplates(savedTemplates)

    const toId = searchParams.get('to')
    if (toId) {
      setShowNewMessage(true)
      setNewRecipient(toId)
    }
  }, [searchParams])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedConvo])

  const saveConversations = (updated) => {
    setConversations(updated)
    localStorage.setItem('signl_messages', JSON.stringify(updated))
  }

  const startConversation = () => {
    if (!newRecipient.trim() || !newMessage.trim()) return
    const convo = {
      id: Date.now().toString(),
      recipientName: newRecipient,
      subject: newSubject || 'New Message',
      messages: [
        {
          id: '1',
          from: 'company',
          text: newMessage,
          timestamp: new Date().toISOString(),
        }
      ],
      lastMessage: newMessage,
      lastMessageAt: new Date().toISOString(),
      unread: false,
    }
    const updated = [convo, ...conversations]
    saveConversations(updated)
    setSelectedConvo(convo)
    setShowNewMessage(false)
    setNewRecipient('')
    setNewSubject('')
    setNewMessage('')
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConvo) return
    const updated = conversations.map(c => {
      if (c.id === selectedConvo.id) {
        const msg = {
          id: Date.now().toString(),
          from: 'company',
          text: newMessage,
          timestamp: new Date().toISOString(),
        }
        const updatedConvo = {
          ...c,
          messages: [...c.messages, msg],
          lastMessage: newMessage,
          lastMessageAt: new Date().toISOString(),
        }
        setSelectedConvo(updatedConvo)
        return updatedConvo
      }
      return c
    })
    saveConversations(updated)
    setNewMessage('')
  }

  const applyTemplate = (template) => {
    let body = template.body
    body = body.replace(/{company}/g, companyName)
    body = body.replace(/{name}/g, selectedConvo?.recipientName || newRecipient || '[Student Name]')
    setNewMessage(body)
    if (template.subject) setNewSubject(template.subject)
    setShowTemplates(false)
  }

  const saveAsTemplate = () => {
    if (!templateName.trim() || !newMessage.trim()) return
    const tmpl = { id: Date.now(), name: templateName, subject: newSubject, body: newMessage }
    const updated = [...customTemplates, tmpl]
    setCustomTemplates(updated)
    localStorage.setItem('signl_custom_templates', JSON.stringify(updated))
    setShowSaveTemplate(false)
    setTemplateName('')
  }

  const deleteTemplate = (id) => {
    const updated = customTemplates.filter(t => t.id !== id)
    setCustomTemplates(updated)
    localStorage.setItem('signl_custom_templates', JSON.stringify(updated))
  }

  const deleteConversation = (convoId) => {
    const updated = conversations.filter(c => c.id !== convoId)
    saveConversations(updated)
    if (selectedConvo?.id === convoId) setSelectedConvo(null)
  }

  const allTemplates = [...TEMPLATES, ...customTemplates]

  return (
    <CompanyLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
            <p className="text-gray-400">Communicate with students and nominators</p>
          </div>
          <button
            onClick={() => { setShowNewMessage(true); setSelectedConvo(null) }}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all"
          >
            + New Message
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: '60vh' }}>
          {/* Conversation List */}
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/[0.06]">
              <div className="text-sm font-semibold text-white">{conversations.length} Conversation{conversations.length !== 1 ? 's' : ''}</div>
            </div>
            <div className="divide-y divide-white/[0.04] max-h-[60vh] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">No conversations yet</div>
              ) : (
                conversations.map(convo => (
                  <div
                    key={convo.id}
                    onClick={() => { setSelectedConvo(convo); setShowNewMessage(false) }}
                    className={`p-4 cursor-pointer hover:bg-white/[0.03] transition-colors ${selectedConvo?.id === convo.id ? 'bg-white/[0.05]' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white truncate">{convo.recipientName}</span>
                      <button onClick={e => { e.stopPropagation(); deleteConversation(convo.id) }} className="text-gray-600 hover:text-red-400 flex-shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 truncate">{convo.lastMessage}</div>
                    <div className="text-xs text-gray-600 mt-1">{new Date(convo.lastMessageAt).toLocaleDateString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Area */}
          <div className="lg:col-span-2 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-xl flex flex-col">
            {showNewMessage ? (
              /* New Message Form */
              <div className="flex-1 p-6">
                <h3 className="text-lg font-bold text-white mb-4">New Message</h3>
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">To (Student Name)</label>
                    <input type="text" value={newRecipient} onChange={e => setNewRecipient(e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600" placeholder="Student name" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Subject</label>
                    <input type="text" value={newSubject} onChange={e => setNewSubject(e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600" placeholder="Message subject" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-gray-500">Message</label>
                      <button onClick={() => setShowTemplates(!showTemplates)} className="text-xs text-teal-400 hover:underline">Use Template</button>
                    </div>
                    <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 resize-none h-40" placeholder="Type your message..." />
                  </div>
                </div>

                {/* Templates Dropdown */}
                {showTemplates && (
                  <div className="mb-4 bg-white/[0.03] border border-white/[0.08] rounded-lg p-3 max-h-60 overflow-y-auto">
                    <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Templates</div>
                    {allTemplates.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer">
                        <button onClick={() => applyTemplate(t)} className="text-sm text-gray-300 hover:text-white text-left flex-1">{t.name}</button>
                        {customTemplates.find(ct => ct.id === t.id) && (
                          <button onClick={() => deleteTemplate(t.id)} className="text-gray-600 hover:text-red-400 ml-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button onClick={startConversation} className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all">Send</button>
                  <button onClick={() => setShowSaveTemplate(true)} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white">Save as Template</button>
                  <button onClick={() => setShowNewMessage(false)} className="px-4 py-2.5 border border-white/10 rounded-lg text-gray-400">Cancel</button>
                </div>

                {/* Save Template Modal */}
                {showSaveTemplate && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowSaveTemplate(false)}>
                    <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                      <h3 className="text-lg font-bold text-white mb-4">Save as Template</h3>
                      <input type="text" value={templateName} onChange={e => setTemplateName(e.target.value)} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 mb-4" placeholder="Template name" />
                      <div className="flex gap-2">
                        <button onClick={saveAsTemplate} className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg font-medium">Save</button>
                        <button onClick={() => setShowSaveTemplate(false)} className="px-4 py-2 border border-white/10 rounded-lg text-gray-400">Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : selectedConvo ? (
              /* Conversation View */
              <>
                <div className="p-4 border-b border-white/[0.06]">
                  <div className="text-sm font-semibold text-white">{selectedConvo.recipientName}</div>
                  <div className="text-xs text-gray-500">{selectedConvo.subject}</div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[45vh]">
                  {selectedConvo.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.from === 'company' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-xl px-4 py-2.5 ${msg.from === 'company' ? 'bg-teal-600/20 border border-teal-500/20' : 'bg-white/5 border border-white/10'}`}>
                        <p className="text-sm text-white whitespace-pre-wrap">{msg.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(msg.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-white/[0.06]">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <textarea
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 resize-none h-10 min-h-[40px]"
                        placeholder="Type a message..."
                      />
                    </div>
                    <button onClick={() => setShowTemplates(!showTemplates)} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white" title="Templates">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10M4 18h6" /></svg>
                    </button>
                    <button onClick={sendMessage} className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700">Send</button>
                  </div>
                  {showTemplates && (
                    <div className="mt-2 bg-white/[0.03] border border-white/[0.08] rounded-lg p-2">
                      {allTemplates.map(t => (
                        <button key={t.id} onClick={() => applyTemplate(t)} className="block w-full text-left text-sm text-gray-400 hover:text-white p-2 rounded hover:bg-white/5">{t.name}</button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <p className="text-gray-500">Select a conversation or start a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CompanyLayout>
  )
}
