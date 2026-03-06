'use client'

import { useState, useEffect } from 'react'
import CompanyLayout from '../CompanyLayout'

const DEFAULT_COLUMNS = [
  { id: 'interested', label: 'Interested', color: 'teal' },
  { id: 'reachedOut', label: 'Reached Out', color: 'blue' },
  { id: 'interviewing', label: 'Interviewing', color: 'purple' },
  { id: 'offerExtended', label: 'Offer Extended', color: 'amber' },
  { id: 'hired', label: 'Hired', color: 'green' },
]

const COLOR_MAP = {
  teal: 'bg-teal-400',
  blue: 'bg-blue-400',
  purple: 'bg-purple-400',
  amber: 'bg-amber-400',
  green: 'bg-green-400',
}

export default function PipelinePage() {
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)
  const [pipeline, setPipeline] = useState({})
  const [notes, setNotes] = useState({})
  const [dragging, setDragging] = useState(null)
  const [editingNote, setEditingNote] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [showAddColumn, setShowAddColumn] = useState(false)
  const [newColumnName, setNewColumnName] = useState('')

  useEffect(() => {
    const savedPipeline = JSON.parse(localStorage.getItem('signl_pipeline') || '{}')
    setPipeline(savedPipeline)
    const savedNotes = JSON.parse(localStorage.getItem('signl_private_notes') || '{}')
    setNotes(savedNotes)
    const savedColumns = localStorage.getItem('signl_pipeline_columns')
    if (savedColumns) {
      try { setColumns(JSON.parse(savedColumns)) } catch {}
    }
  }, [])

  const savePipeline = (updated) => {
    setPipeline(updated)
    localStorage.setItem('signl_pipeline', JSON.stringify(updated))
  }

  const saveColumns = (updated) => {
    setColumns(updated)
    localStorage.setItem('signl_pipeline_columns', JSON.stringify(updated))
  }

  const moveCandidate = (candidateId, fromColumn, toColumn) => {
    if (fromColumn === toColumn) return
    const updated = { ...pipeline }
    const candidate = (updated[fromColumn] || []).find(c => c.id === candidateId)
    if (!candidate) return
    updated[fromColumn] = (updated[fromColumn] || []).filter(c => c.id !== candidateId)
    if (!updated[toColumn]) updated[toColumn] = []
    updated[toColumn].push({ ...candidate, movedAt: new Date().toISOString() })
    savePipeline(updated)
  }

  const removeCandidate = (candidateId, column) => {
    const updated = { ...pipeline }
    updated[column] = (updated[column] || []).filter(c => c.id !== candidateId)
    savePipeline(updated)
  }

  const saveNote = (studentId) => {
    const updated = { ...notes, [studentId]: noteText }
    setNotes(updated)
    localStorage.setItem('signl_private_notes', JSON.stringify(updated))
    setEditingNote(null)
    setNoteText('')
  }

  const addColumn = () => {
    if (!newColumnName.trim()) return
    const colors = ['teal', 'blue', 'purple', 'amber', 'green']
    const newCol = {
      id: newColumnName.toLowerCase().replace(/\s+/g, '_'),
      label: newColumnName,
      color: colors[columns.length % colors.length],
    }
    saveColumns([...columns, newCol])
    setNewColumnName('')
    setShowAddColumn(false)
  }

  const removeColumn = (colId) => {
    saveColumns(columns.filter(c => c.id !== colId))
    const updated = { ...pipeline }
    delete updated[colId]
    savePipeline(updated)
  }

  const handleDragStart = (candidateId, fromColumn) => {
    setDragging({ candidateId, fromColumn })
  }

  const handleDrop = (toColumn) => {
    if (dragging) {
      moveCandidate(dragging.candidateId, dragging.fromColumn, toColumn)
      setDragging(null)
    }
  }

  const totalCandidates = Object.values(pipeline).reduce((sum, col) => sum + (col?.length || 0), 0)

  return (
    <CompanyLayout>
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Talent Pipeline</h1>
            <p className="text-gray-400">{totalCandidates} candidate{totalCandidates !== 1 ? 's' : ''} across {columns.length} stages</p>
          </div>
          <button
            onClick={() => setShowAddColumn(true)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors"
          >
            + Add Column
          </button>
        </div>

        {/* Add Column Modal */}
        {showAddColumn && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowAddColumn(false)}>
            <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-white mb-4">Add Pipeline Column</h3>
              <input
                type="text"
                value={newColumnName}
                onChange={e => setNewColumnName(e.target.value)}
                placeholder="Column name (e.g., Phone Screen)"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 mb-4"
              />
              <div className="flex gap-2">
                <button onClick={addColumn} className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700">Add</button>
                <button onClick={() => setShowAddColumn(false)} className="px-4 py-2 border border-white/10 rounded-lg text-gray-400">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Note Editing Modal */}
        {editingNote && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setEditingNote(null)}>
            <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-white mb-2">Private Note</h3>
              <p className="text-sm text-gray-400 mb-4">{editingNote.name}</p>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Add internal notes..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-gray-600 resize-none h-32 mb-4"
              />
              <div className="flex gap-2">
                <button onClick={() => saveNote(editingNote.id)} className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700">Save</button>
                <button onClick={() => setEditingNote(null)} className="px-4 py-2 border border-white/10 rounded-lg text-gray-400">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: '60vh' }}>
          {columns.map(column => (
            <div
              key={column.id}
              className="flex-shrink-0 w-72 bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-col"
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(column.id)}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${COLOR_MAP[column.color] || 'bg-gray-400'}`} />
                  <span className="text-sm font-semibold text-white">{column.label}</span>
                  <span className="text-xs text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">
                    {(pipeline[column.id] || []).length}
                  </span>
                </div>
                {!DEFAULT_COLUMNS.find(c => c.id === column.id) && (
                  <button onClick={() => removeColumn(column.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>

              {/* Candidates */}
              <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                {(pipeline[column.id] || []).map(candidate => (
                  <div
                    key={candidate.id}
                    draggable
                    onDragStart={() => handleDragStart(candidate.id, column.id)}
                    className="bg-white/[0.04] border border-white/[0.08] rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-white/15 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium text-white">{candidate.name}</div>
                        <div className="text-xs text-gray-500">{candidate.major}</div>
                      </div>
                      <div className="text-sm font-bold text-teal-400">{candidate.peerScore}</div>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">{candidate.gradYear}</div>

                    {notes[candidate.id] && (
                      <div className="text-xs text-amber-400/70 bg-amber-500/5 rounded p-1.5 mb-2 truncate">
                        {notes[candidate.id]}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex gap-1">
                        {/* Move left */}
                        {columns.indexOf(column) > 0 && (
                          <button
                            onClick={() => moveCandidate(candidate.id, column.id, columns[columns.indexOf(column) - 1].id)}
                            className="text-gray-600 hover:text-white p-1"
                            title={`Move to ${columns[columns.indexOf(column) - 1].label}`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                          </button>
                        )}
                        {/* Move right */}
                        {columns.indexOf(column) < columns.length - 1 && (
                          <button
                            onClick={() => moveCandidate(candidate.id, column.id, columns[columns.indexOf(column) + 1].id)}
                            className="text-gray-600 hover:text-white p-1"
                            title={`Move to ${columns[columns.indexOf(column) + 1].label}`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                          </button>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => { setEditingNote(candidate); setNoteText(notes[candidate.id] || '') }}
                          className="text-gray-600 hover:text-amber-400 p-1"
                          title="Add note"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button
                          onClick={() => removeCandidate(candidate.id, column.id)}
                          className="text-gray-600 hover:text-red-400 p-1"
                          title="Remove"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {(pipeline[column.id] || []).length === 0 && (
                  <div className="text-center py-8 text-gray-600 text-xs">
                    Drag candidates here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CompanyLayout>
  )
}
