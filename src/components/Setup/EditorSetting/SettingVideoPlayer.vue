<template>
  <rules-generator
    :id="id"
    :rules="spec"
  />
</template>

<script>
import RulesGenerator from './Common/RulesGenerator'
import { string, select, assignDefaultValue, boolean } from './utils/ruleTool'
import { required } from '@/validator'

export const defaultSetting = {
  provider: 'youtube',
  embedId: 'bTqVqk7FSmY',
  controls: [
    'play-large',
    'play',
    'progress',
    'current-time',
    'mute',
    'volume',
    'captions',
    'settings',
    'pip',
    'airplay',
    'fullscreen'
  ],
  autoplay: false,
  settings: ['captions', 'quality', 'speed', 'loop'],
  // iconUrl: undefined,
  blankVideo: 'https://cdn.plyr.io/static/blank.mp4',
  volume: true,
  muted: false,
  clickToPlay: true,
  disableContextMenu: true,
  hideControls: true,
  resetOnEnd: false,
  // ratio: { w: 16, h: 9 },
  fullscreen: { enabled: true, fallback: true, iosNative: true }
}

export default {
  name: 'SettingVideoPlayer',
  components: { RulesGenerator },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      spec: assignDefaultValue(
        [
          select('provider', {
            options: ['youtube', 'vimeo']
          }),
          string('embedId', {
            validate: [required],
            props: {
              type: 'textarea',
              row: 3,
              resize: 'vertical'
            }
          }),
          select('controls', {
            options: defaultSetting.controls,
            props: {
              multiple: true
            }
          }),
          // url('iconUrl'),
          boolean('autoplay'),
          boolean('muted'),
          boolean('clickToPlay'),
          boolean('hideControls'),
          boolean('resetOnEnd')
        ],
        defaultSetting
      )
    }
  }
}
</script>
