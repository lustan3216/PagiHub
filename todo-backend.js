const asd = [
  {
    user_id: '',    // pk
    id: 'ulid',       // gsi
    updated_at: '',  // sk
    type: 0,
    lock_id: '',
    children: [
      {
        id: 'ulid',
        user_id: '',
        type: 1,
        parent_id: ''
      },
      'Component ulid'
    ]
  },

  {
    user_id: '',    // pk
    id: 'ulid',       // gsi
    updatedAt: '',  // sk
    type: 2,
    lock_id: '',
    tags: [],
    name: '',
    description: '',
    likeCount: '',
    forkCount: '',
    likeUserIds: [],
    forkUserIds: [],
    children: []
  }
]

const tags = [
  {
    name: 'tag',
    useCount: ''
  }
]

const search = [
  {
    name: 'tag.tag1', // 'partition_key'
    likeCount: '',    // gsi
    forkCount: '',    // gsi
    updatedAt: '',    // gsi
    componentSetId: '' // 'sort_key'
  },
  {
    name: 'tag2.tag5.tag7',
    component_set_id: ''
  }
]

// IAM user
// Root
// 319924209672
// AKIAUU7HYBAEHOMSPVER
// +suj0WAUUANEhKy/P7EmV5J3EaPPfHvQh9U20YRk

// publish / componsent update node / asset / GetUserPicture
