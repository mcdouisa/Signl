import { NextResponse } from 'next/server'
import { db } from '../../../../lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'

export async function PUT(request) {
  try {
    const body = await request.json()
    const { studentId, emailNotifications } = body

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 })
    }
    if (typeof emailNotifications !== 'boolean') {
      return NextResponse.json({ error: 'emailNotifications must be a boolean' }, { status: 400 })
    }

    if (!db) {
      return NextResponse.json({ success: true, message: 'Settings updated (development mode)' })
    }

    const studentRef = doc(db, 'students', studentId)
    await updateDoc(studentRef, { emailNotifications, updatedAt: new Date().toISOString() })

    return NextResponse.json({ success: true, message: 'Notification settings updated' })
  } catch (error) {
    console.error('Notification settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
