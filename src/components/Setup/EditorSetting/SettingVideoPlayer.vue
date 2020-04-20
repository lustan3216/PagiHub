<template>
  <setting-generator
    :id="id"
    :spec="spec"
  />
</template>

<script>
import SettingGenerator from './Common/SettingGenerator'
import { string, select, assignDefaultValue, url, boolean } from './utils/util'
import { required } from './utils/validation'

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
  displayDuration: false,
  fullscreen: { enabled: true, fallback: true, iosNative: false }
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
          select('provider', {
            options: ['youtube', 'vimeo']
          }),
          string('embedId', {
            validate: [required]
          }),
          select('controls', {
            options: defaultSetting.controls,
            props: {
              multiple: true
            }
          }),
          select('settings', {
            options: defaultSetting.settings,
            props: {
              multiple: true
            }
          }),
          // url('iconUrl'),
          boolean('autoplay'),
          boolean('volume'),
          boolean('muted'),
          boolean('clickToPlay'),
          boolean('disableContextMenu'),
          boolean('hideControls'),
          boolean('resetOnEnd'),
          boolean('displayDuration'),
          boolean('enabled', { path: 'fullscreen', title: 'Fullscreen allow' }),
          boolean('iosNative', {
            path: 'fullscreen',
            title: 'Fullscreen iOS support'
          })
        ],
        defaultSetting
      )
    }
  }
}
</script>
