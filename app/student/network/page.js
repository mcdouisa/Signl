'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const GROUP_COLORS = {
  self: '#3b82f6',
  endorsed: '#06b6d4',
  endorser: '#10b981',
  peer: '#6b7280',
  nominated: '#f59e0b'
}

const GROUP_LABELS = {
  self: 'You',
  endorsed: 'You Endorsed',
  endorser: 'Endorsed You',
  peer: 'Peers',
  nominated: 'Your Nominees'
}

// Simple force-directed graph drawn on canvas
function NetworkCanvas({ nodes, edges, width, height }) {
  const canvasRef = useRef(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const positionsRef = useRef({})
  const animRef = useRef(null)

  // Initialize positions
  useEffect(() => {
    if (!nodes.length) return
    const positions = {}
    const centerX = width / 2
    const centerY = height / 2

    nodes.forEach((node, i) => {
      if (node.id === 'you') {
        positions[node.id] = { x: centerX, y: centerY, vx: 0, vy: 0 }
      } else {
        const angle = (i / nodes.length) * Math.PI * 2
        const radius = 120 + Math.random() * 80
        positions[node.id] = {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          vx: 0, vy: 0
        }
      }
    })
    positionsRef.current = positions

    // Run simulation
    let iteration = 0
    const maxIterations = 200

    const simulate = () => {
      if (iteration >= maxIterations) {
        draw()
        return
      }

      const pos = positionsRef.current
      const damping = 0.85
      const repulsion = 2000
      const attraction = 0.008
      const centerPull = 0.001

      // Reset forces
      nodes.forEach(n => { pos[n.id].vx = 0; pos[n.id].vy = 0 })

      // Repulsion between all nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = pos[nodes[i].id], b = pos[nodes[j].id]
          const dx = b.x - a.x, dy = b.y - a.y
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1)
          const force = repulsion / (dist * dist)
          const fx = (dx / dist) * force, fy = (dy / dist) * force
          a.vx -= fx; a.vy -= fy
          b.vx += fx; b.vy += fy
        }
      }

      // Attraction along edges
      edges.forEach(e => {
        const a = pos[e.from], b = pos[e.to]
        if (!a || !b) return
        const dx = b.x - a.x, dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const force = dist * attraction
        const fx = (dx / dist) * force, fy = (dy / dist) * force
        a.vx += fx; a.vy += fy
        b.vx -= fx; b.vy -= fy
      })

      // Center pull
      nodes.forEach(n => {
        const p = pos[n.id]
        p.vx += (centerX - p.x) * centerPull
        p.vy += (centerY - p.y) * centerPull
      })

      // Apply velocities
      nodes.forEach(n => {
        const p = pos[n.id]
        if (n.id === 'you') { p.x = centerX; p.y = centerY; return }
        p.x += p.vx * damping
        p.y += p.vy * damping
        p.x = Math.max(40, Math.min(width - 40, p.x))
        p.y = Math.max(40, Math.min(height - 40, p.y))
      })

      iteration++
      if (iteration < maxIterations) {
        animRef.current = requestAnimationFrame(simulate)
      }
      if (iteration % 5 === 0 || iteration >= maxIterations) draw()
    }

    simulate()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [nodes, edges, width, height])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const pos = positionsRef.current
    const dpr = window.devicePixelRatio || 1

    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, width, height)

    // Draw edges
    edges.forEach(e => {
      const a = pos[e.from], b = pos[e.to]
      if (!a || !b) return
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.lineWidth = 1.5
      ctx.stroke()
    })

    // Draw nodes
    nodes.forEach(node => {
      const p = pos[node.id]
      if (!p) return
      const r = node.size / 2.5
      const color = GROUP_COLORS[node.group] || '#6b7280'
      const isHovered = hoveredNode === node.id

      // Glow effect
      if (isHovered || node.id === 'you') {
        ctx.beginPath()
        ctx.arc(p.x, p.y, r + 8, 0, Math.PI * 2)
        ctx.fillStyle = color + '20'
        ctx.fill()
      }

      // Node circle
      ctx.beginPath()
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
      ctx.fillStyle = color + (isHovered ? 'ff' : 'cc')
      ctx.fill()
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()

      // Label
      ctx.font = `${isHovered || node.id === 'you' ? 'bold ' : ''}11px Inter, system-ui, sans-serif`
      ctx.textAlign = 'center'
      ctx.fillStyle = isHovered || node.id === 'you' ? '#fff' : '#9ca3af'
      ctx.fillText(node.label, p.x, p.y + r + 16)

      // Score badge for hovered
      if (isHovered && node.score > 0) {
        ctx.font = 'bold 10px Inter, system-ui, sans-serif'
        ctx.fillStyle = color
        ctx.fillText(`Score: ${node.score}`, p.x, p.y + r + 28)
      }
    })
  }, [nodes, edges, width, height, hoveredNode])

  useEffect(() => { draw() }, [draw])

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const pos = positionsRef.current

    let found = null
    for (const node of nodes) {
      const p = pos[node.id]
      if (!p) continue
      const r = node.size / 2.5 + 5
      if (Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2) < r) {
        found = node.id
        break
      }
    }
    if (found !== hoveredNode) setHoveredNode(found)
  }

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredNode(null)}
      className="cursor-pointer"
    />
  )
}

export default function NetworkPage() {
  const router = useRouter()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [networkData, setNetworkData] = useState(null)

  useEffect(() => {
    const session = localStorage.getItem('signl_session')
    if (!session) { router.push('/student/login'); return }
    try {
      const { student: s } = JSON.parse(session)
      setStudent(s)
      fetchNetwork(s)
    } catch { router.push('/student/login') }
  }, [router])

  const fetchNetwork = async (s) => {
    try {
      const res = await fetch(`/api/student/network?studentId=${s.id}&college=${encodeURIComponent(s.college)}&major=${encodeURIComponent(s.major)}`)
      const data = await res.json()
      if (data.success) setNetworkData(data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-black/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/"><img src="/logo.png.png" alt="Signl" className="h-14 object-contain" /></Link>
          <div className="flex items-center space-x-4">
            <Link href="/student/dashboard" className="text-gray-400 hover:text-white text-sm font-medium">Dashboard</Link>
            <Link href="/student/peers" className="text-gray-400 hover:text-white text-sm font-medium">Peers</Link>
            <Link href="/student/settings" className="text-gray-400 hover:text-white text-sm font-medium">Settings</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Your Network</h1>
          <p className="text-gray-400 mt-1">See how you're connected to peers in {student?.major} @ {student?.college}</p>
        </div>

        {/* Stats Bar */}
        {networkData?.stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-white">{networkData.stats.totalConnections}</div>
              <div className="text-xs text-gray-500">Total Connections</div>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-cyan-400">{networkData.stats.endorsementsGiven}</div>
              <div className="text-xs text-gray-500">Endorsements Given</div>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-green-400">{networkData.stats.endorsementsReceived}</div>
              <div className="text-xs text-gray-500">Endorsements Received</div>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-amber-400">{networkData.stats.nominations}</div>
              <div className="text-xs text-gray-500">Nominees</div>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-purple-400">{networkData.stats.networkDensity}</div>
              <div className="text-xs text-gray-500">Network Density</div>
            </div>
          </div>
        )}

        {/* Graph */}
        <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 mb-6">
          {networkData?.nodes?.length > 0 ? (
            <NetworkCanvas
              nodes={networkData.nodes}
              edges={networkData.edges}
              width={Math.min(900, typeof window !== 'undefined' ? window.innerWidth - 80 : 900)}
              height={500}
            />
          ) : (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🔗</div>
              <h2 className="text-xl font-bold text-white mb-2">Build Your Network</h2>
              <p className="text-gray-400 mb-4">Start endorsing peers to see your network graph come to life.</p>
              <Link href="/student/peers" className="inline-block bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold">Endorse Peers</Link>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6 justify-center">
          {Object.entries(GROUP_COLORS).map(([key, color]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
              <span className="text-sm text-gray-400">{GROUP_LABELS[key]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
