// this is a patch response example

export const responseExample = [
  // global - trigger a complete refetch
  { entity: 'global', action: 'complete refetch' },

  // announcement related patches
  {
    entity: 'announcement',
    action: 'create',
    payload: {
      id: '1',
      subject: 'the announcement subject',
      body: 'bla bla bla',
      publishStart: new Date(),
      publishEnd: new Date(Date.now() + 1000 * 3600 * 24),
      priority: 'low',
      sendAlert: false,
      audience: 'all staff'
    }
  },
  {
    entity: 'announcement',
    action: 'modify',
    payload: {
      sendAlert: true
    }
  },
  {
    entity: 'announcement',
    action: 'delete',
    payload: { id: '1' }
  },

  // authenticate or allow if the logged in user is the same as the personId
  {
    entity: 'announcement.confirmation',
    action: 'create',
    payload: {
      announcementId: '1',
      personId: 1859,
      timestamp: new Date(Date.now() - 1000 * 3600)
    }
  },

  // authenticate
  {
    // this patch does not provide sufficient information for getting the exact
    // list of who didn't read the announcement, and should serve as a trigger
    // for a specific query.
    entity: 'announcement.audience',
    action: 'modify',
    payload: { count: 124 }
  },

  // chat related patches

  // triggered when a new user is created
  // authenticate
  { entity: 'chat', action: 'create', payload: { userId: '123' } },
  // authenticate or allow when userId or chatUserId is the same as the logged in user
  {
    entity: 'chat.message',
    action: 'create',
    payload: {
      chatUserId: '123',
      userId: '123',
      content: 'Good day.',
      timestamp: new Date()
    }
  },

  // authenticate or allow when userId or chatUserId is the same as the logged in user
  {
    entity: 'chat',
    action: 'modify',
    payload: { chatUserId: '123', userId: '123', lastReadTimestamp: new Date() }
  },
  // authenticate or allow when userId or chatUserId is the same as the logged in user
  {
    entity: 'chat',
    action: 'modify',
    payload: { chatUserId: '123', userId: '123', isTyping: true }
  },

  // user related patches
  {
    entity: 'user',
    action: 'modify',
    payload: { profilePicture: 'https://bla.bla.jpg' }
  },
  { eneity: 'user.preferences', action: 'create', payload: { darkMode: true } },

  // registration related patches

  // authenticate
  {
    entity: 'registration',
    action: 'create',
    payload: {
      // all registration data
    }
  },
  // authenticate
  {
    entity: 'registration',
    action: 'modify',
    payload: { departureDate: new Date(Date.now() + 1000 * 3600 * 24 * 4) }
  }
]
