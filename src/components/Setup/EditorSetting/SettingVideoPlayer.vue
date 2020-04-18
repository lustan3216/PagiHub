<template>
  <setting-generator
    :id="id"
    :spec="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { string, select, assignDefaultValue } from './utils/util'
import { required } from './utils/validation'

const CONTROLS = 'controls'
const SETTINGS = 'settings'
const AUTOPAUSE = 'autopause'
const SEEKTIME = 'seekTime'
const VOLUME = 'volume'
const MUTED = 'muted'
const CLICKTOPLAY = 'clickToPlay'
const HIDECONTROLS = 'hideControls'
const RESETONEND = 'resetOnEnd'
const PROVIDER = 'provider'
const EMBED_ID = 'embedId'

export const defaultSetting = {
  [PROVIDER]: 'youtube',
  [EMBED_ID]: 'bTqVqk7FSmY'
}

export default {
  name: 'SettingVideoPlayer',
  components: { SettingGenerator },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      spec: assignDefaultValue(
        [
          select(PROVIDER, {
            options: ['youtube', 'vimeo']
          }),
          string(EMBED_ID, {
            validate: [required]
          })
        ],
        defaultSetting
      )
    }
  }
}
</script>
