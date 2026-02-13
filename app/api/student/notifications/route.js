import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { collection, query, where, getDocs, doc, updateDoc, addDoc, orderBy, limit, writeBatch } from 'firebase/firestore'

// GET - Fetch notifications for a student
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const maxResults = parseInt(searchParams.get('limit') || '20')

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }

    if (!db) {
      return NextResponse.json({
        success: true,
        notifications: [
          {
            id: 'mock-1',
            type: 'nomination_received',
            title: 'New Nomination!',
            message: 'Alex Johnson nominated you for their project team.',
            read: false,
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 'mock-2',
            type: 'endorsement_received',
            title: 'New Endorsement!',
            message: 'Sarah Williams endorsed your Leadership and Communication skills.',
            read: false,
            createdAt: new Date(Date.now() - 7200000).toISOString()
          },
          {
            id: 'mock-3',
            type: 'profile_view',
            title: 'Profile Viewed',
            message: 'A company viewed your profile.',
            read: true,
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 'mock-4',
            type: 'milestone',
            title: 'Milestone Reached!',
            message: 'Your peer score reached 85! You\'re in the top 20% of your major.',
            read: true,
            createdAt: new Date(Date.now() - 172800000).toISOString()
          }
        ],
        unreadCount: 2
      })
    }

    const notificationsRef = collection(db, 'notifications')
    let notifQuery

    if (unreadOnly) {
      notifQuery = query(
        notificationsRef,
        where('studentId', '==', studentId),
        where('read', '==', false),
        orderBy('createdAt', 'desc'),
        limit(maxResults)
      )
    } else {
      notifQuery = query(
        notificationsRef,
        where('studentId', '==', studentId),
        orderBy('createdAt', 'desc'),
        limit(maxResults)
      )
    }

    const snapshot = await getDocs(notifQuery)
    const notifications = []
    let unreadCount = 0

    snapshot.forEach(doc => {
      const data = doc.data()
      notifications.push({ id: doc.id, ...data })
      if (!data.read) unreadCount++
    })

    return NextResponse.json({ success: true, notifications, unreadCount })
  } catch (error) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

// PUT - Mark notifications as read
export async function PUT(request) {
  try {
    const body = await request.json()
    const { studentId, notificationIds, markAllRead } = body

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }

    if (!db) {
      return NextResponse.json({ success: true, message: 'Notifications marked as read (dev mode)' })
    }

    if (markAllRead) {
      const notificationsRef = collection(db, 'notifications')
      const unreadQuery = query(
        notificationsRef,
        where('studentId', '==', studentId),
        where('read', '==', false)
      )
      const snapshot = await getDocs(unreadQuery)
      const batch = writeBatch(db)
      snapshot.forEach(docSnap => {
        batch.update(doc(db, 'notifications', docSnap.id), { read: true })
      })
      await batch.commit()
    } else if (notificationIds && notificationIds.length > 0) {
      const batch = writeBatch(db)
      for (const id of notificationIds) {
        batch.update(doc(db, 'notifications', id), { read: true })
      }
      await batch.commit()
    }

    return NextResponse.json({ success: true, message: 'Notifications updated' })
  } catch (error) {
    console.error('Notification update error:', error)
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 })
  }
}
