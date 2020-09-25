<template>
  <tip>
    Choose a <b>username</b> to make public url prettier.
    <dialog-username
      text="Choose here"
      type="text"
    />
  </tip>
</template>

<script>
import { mapState } from 'vuex'
import Tip from '@/components/Tip/Tip'
import DialogUsername from '@/components/Setup/DialogUsername'

export default {
  name: 'TipUsername',
  components: {
    Tip,
    DialogUsername
  },
  computed: {
    ...mapState('user', ['username', 'userId'])
  }
}
</script>
