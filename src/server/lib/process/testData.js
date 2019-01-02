

const settings = {
  timezone: 3,
  preferences: [ 'chess', 'music' ],
};

const t = [
  new Date('2018-08-08').getTime(), // 0
  new Date('2018-08-09').getTime(), // 1
  new Date('2018-08-10').getTime(), // 2
  new Date('2018-08-11').getTime(), // 3
  new Date('2018-08-12').getTime(), // 4
  new Date('2018-08-13').getTime(), // 5
  new Date('2018-08-14').getTime(), // 6
];

// 2 people, 2 notes each, 1 meeting in common
export default [
  // First user
  {
    _id: 'user-id-1',
    domain: ':people',
    siblings: [
      { _id: 'user-id-2', domain: ':people', timestamp: t[2] },
    ],
    relations: [
      { _id: 'note-id-1', domain: ':notes', timestamp: t[3] },
      { _id: 'note-id-2', domain: ':notes', timestamp: t[3] },
      { _id: 'meeting-id-1', domain: ':meetings', timestamp: t[4] },
    ],
    log: [], // creation date and more server-only control data
    attrs: [
      { key: 'name', value: 'José Manuel A.', timestamp: t[0] },
      { key: 'email', value: 'jma@gmail.com', timestamp: t[0] },
      { key: 'address.street', value: 'Los Mil', timestamp: t[1] },
      { key: 'address.street', value: 'Los Militares', timestamp: t[2] },
      { key: 'address.number', value: 5150, timestamp: t[2] },
      { key: 'settings|json', value: settings, timestamp: t[2] },
      { key: 'name', value: 'José Manuel Aguirre', timestamp: t[2] },
    ],
  },
  // Second user
  {
    _id: 'user-id-2',
    domain: ':people',
    siblings: [
      { _id: 'user-id-1', domain: ':people', timestamp: t[2] },
    ],
    relations: [
      { _id: 'note-id-3', domain: ':notes', timestamp: t[3] },
      { _id: 'note-id-4', domain: ':notes', timestamp: t[3] },
      { _id: 'meeting-id-1', domain: ':meetings', timestamp: t[4] },
    ],
    log: [], // creation date and more server-only control data
    attrs: [
      { key: 'name', value: 'Consuelo F', timestamp: t[0] },
      { key: 'email', value: 'cfc@gmail.com', timestamp: t[0] },
      { key: 'address.street', value: 'Los Mil', timestamp: t[1] },
      { key: 'address.street', value: 'Los Militares', timestamp: t[2] },
      { key: 'name', value: 'C. Flores', timestamp: t[2] },
    ],
  },
  // 4 notes
  ...[ 1, 2, 3, 4 ].map(num => {
    const user_id = num <= 2 ? 'user-id-1' : 'user-id-2';
    return {
      _id: `note-id-${num}`,
      domain: ':notes',
      relations: [],
      log: [],
      attrs: [
        { key: 'text', value: `This is note number --> ${num}`, timestamp: t[3] },
        { key: 'user_id', value: user_id, timestamp: t[3] },
      ],
    };
  }),
  // 1 meeting
  {
    _id: 'meeting-id-1',
    domain: ':meetings',
    relations: [
      ...[ 1, 2, 3, 4, 5, 6 ].map(num => ({
        _id: `chat-id-${num}`, domain: ':chats', timestamp: t[5],
      })),
    ],
    log: [], // creation date and more server-only control data
    attrs: [
      { key: 'title', value: 'AI initial meeting', timestamp: t[3] },
      { key: 'city', value: 'Santiago', timestamp: t[4] },
      { key: 'organizer_id', value: 'user-id-1', timestamp: t[4] },
      { key: 'attendees_id|json', value: [ 'user-id-2' ], timestamp: t[4] },
    ],
  },
  // 6 chats that belong to the meeting
  ...[ 1, 2, 3, 4, 5, 6 ].map(num => {
    const user_id = num <= 2 ? 'user-id-1' : 'user-id-2';
    return {
      _id: `chat-id-${num}`,
      domain: ':chats',
      relations: num === 1 ? [
        { _id: 'comment-id-1', domain: ':comments', timestamp: t[6] },
      ] : [],
      log: [],
      attrs: [
        { key: 'text', value: `Message number --> ${num}`, timestamp: t[5] },
        { key: 'user_id', value: user_id, timestamp: t[5] },
        { key: 'meeting_id', value: 'meeting-id-1', timestamp: t[5] },
      ],
    };
  }),
  // 1 chat have a comment child !
  {
    _id: 'comment-id-1',
    domain: ':comments',
    relations: [],
    log: [],
    attrs: [
      { key: 'text', value: 'Soy un comentario en español', timestamp: t[6] },
    ],
  }
];

