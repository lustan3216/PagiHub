<template>
  <div>
    <setting-generator
      :id="id"
      :spec="basic"
    />
    <template v-if="currentProps.effect === 'fade'">
      <h4>Fade Effect</h4>
      <setting-generator
        :id="id"
        :spec="fadeEffect"
      />
    </template>

    <template v-if="currentProps.effect === 'cube'">
      <h4>Cube Effect</h4>
      <setting-generator
        :id="id"
        :spec="cubeEffect"
      />
    </template>

    <template v-if="currentProps.effect === 'coverflow'">
      <h4>Cover Flow Effect</h4>
      <setting-generator
        :id="id"
        :spec="coverflowEffect"
      />
    </template>

    <template v-if="currentProps.effect === 'flip'">
      <h4>Flip Effect</h4>
      <setting-generator
        :id="id"
        :spec="flipEffect"
      />
    </template>

    <h4>Breakpoints</h4>
    <setting-generator
      :id="id"
      :spec="breakpoints"
      class="breakpoints"
    />

    <h4>Navigation</h4>
    <setting-generator
      :id="id"
      :spec="navigation"
    />

    <h4>Pagination</h4>
    <setting-generator
      :id="id"
      :spec="pagination"
    />

    <h4>Scrollbar</h4>
    <setting-generator
      :id="id"
      :spec="scrollbar"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SettingGenerator from './Common/SettingGenerator'
import {
  assignDefaultValue,
  string,
  boolean,
  select,
  number
} from './utils/util'
import { required } from './utils/validation'
// data-swiper-parallax 在grid item設定
// speed: 600,
//   parallax: true,
// el: '.swiper-pagination-v', 要+id 因為會卡到nested問題
export const defaultSetting = {
  speed: 400,
  spaceBetween: 0,
  slidersPerView: 1,
  direction: 'horizontal', // horizontal
  centeredSlides: true,
  freeMode: true,
  mousewheel: true,
  grabCursor: true,
  loop: true,
  loopFillGroupWithBlank: true,
  effect: 'slide',
  autoHeight: true, // enable auto height
  zoom: false,
  navigation: {
    nextEl: null,
    prevEl: null,
    hideOnClick: true
  },
  scrollbar: {
    hide: true
  },
  pagination: {
    dynamicBullets: true,
    clickable: true
  },
  cubeEffect: {
    slideShadows: true,
    shadowOffset: 20,
    shadowScale: 0.94
  },
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true
  },
  keyboard: {
    enabled: true
  },
  autoplay: false
}
export default {
  name: 'SettingCarousel',
  components: { SettingGenerator },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    const data = {
      basic: assignDefaultValue(
        [
          select('effect', {
            options: ['slide', 'fade', 'cube', 'coverflow', 'flip']
          }),
          select('direction', {
            options: ['horizontal', 'vertical']
          }),
          number('speed', {
            props: { step: 100 },
            info: 'Duration of transition between slides (in ms)'
          }),
          number('delay', { path: 'autoplay' }),
          boolean('autoplay'),
          boolean('autoHeight', {
            info:
              'Set to true and slider wrapper will adopt its height to the height of the currently active slide'
          }),

          boolean('vertical'),
          boolean('freeMode', {
            info: 'If true then slides will not have fixed positions'
          }),
          boolean('mousewheel'),
          boolean('enabled', { path: 'keyboard', title: 'keyboard' }),
          boolean('loop', {
            info: 'Set to true to enable continuous loop mode'
          }),
          boolean('grabCursor', {
            info:
              'This option may a little improve desktop usability. If true, user will see the "grab" cursor when hover on Swiper'
          }),
          boolean('centeredSlides', {
            info:
              'If true, then active slide will be centered, not always on the left side.'
          })
        ],
        defaultSetting
      ),
      breakpoints: [
        {
          type: 'group',
          field: 'breakpoints',
          value: [],
          props: {
            rules: [
              string('Breakpoint', {
                value: '320',
                validate: [
                  required,
                  {
                    type: 'string',
                    pattern: /^@?\d+$/,
                    message: 'Only Allow number or ratio like this @0.75'
                  }
                ],
                info: 'Distance between slides in px.'
              }),
              number('spaceBetween', {
                value: 0,
                min: 0,
                info: 'Distance between slides in px.'
              }),
              number('slidesPerView', {
                value: 1,
                min: 0,
                info:
                  "Number of slides per view (slides visible at the same time on slider's container). \n If you use it with 'auto' value and along with loop: true then you need to specify loopedSlides parameter with amount of slides to loop \n slidesPerView: 'auto' is currently not compatible with multirow mode, when slidesPerColumn > 1"
              }),
              number('slidesPerColumn', {
                value: 1,
                min: 0,
                info:
                  'Number of slides per column, for multirow layout. \nslidesPerColumn > 1 is currently not compatible with loop mode (loop: true)'
              })
            ]
          }
        }
      ],
      navigation: assignDefaultValue(
        [
          select('nextEl', {
            path: 'navigation',
            title: 'nextElement',
            options: []
          }),
          select('prevEl', {
            path: 'navigation',
            title: 'prevElement',
            options: []
          }),
          boolean('hideOnClick', {
            path: 'navigation',
            info:
              "	Toggle navigation buttons visibility after click on Slider's container"
          })
        ],
        defaultSetting
      ),
      pagination: assignDefaultValue(
        [
          select('el', {
            path: 'pagination',
            options: []
          }),
          select('type', {
            path: 'pagination',
            options: ['progressbar', 'fraction']
          }),
          boolean('dynamicBullets', {
            path: 'pagination',
            info:
              '	Good to enable if you use bullets pagination with a lot of slides. So it will keep only few bullets visible at the same time.'
          }),
          number('dynamicMainBullets', {
            path: 'pagination',
            info:
              '	The number of main bullets visible when dynamicBullets enabled.'
          })
        ],
        defaultSetting
      ),
      scrollbar: assignDefaultValue(
        [
          select('el', {
            path: 'scrollbar',
            options: []
          }),
          boolean('draggable', {
            path: 'scrollbar'
          })
        ],
        defaultSetting
      ),
      fadeEffect: assignDefaultValue(
        [
          boolean('crossFade', {
            path: 'fadeEffect',
            info: 'Enables slides cross fade'
          })
        ],
        defaultSetting
      ),
      coverflowEffect: assignDefaultValue(
        [
          boolean('slideShadows', {
            path: 'coverflowEffect',
            info: '	Enables slides shadows'
          }),
          number('rotate', {
            path: 'coverflowEffect',
            info: '	Slide rotate in degrees'
          }),
          number('stretch', {
            path: 'coverflowEffect',
            info: 'Stretch space between slides (in px)'
          }),
          number('depth', {
            path: 'coverflowEffect',
            info: '	Depth offset in px (slides translate in Z axis)'
          }),
          number('modifier', {
            path: 'coverflowEffect',
            info: '	Effect multipler'
          })
        ],
        defaultSetting
      ),
      flipEffect: assignDefaultValue(
        [
          boolean('slideShadows', {
            path: 'flipEffect',
            info: '	Enables slides shadows'
          }),
          boolean('limitRotation', {
            path: 'flipEffect',
            info: 'Limit edge slides rotation'
          })
        ],
        defaultSetting
      ),
      cubeEffect: assignDefaultValue(
        [
          boolean('slideShadows', {
            path: 'cubeEffect',
            info: '	Enables slides shadows'
          }),
          boolean('shadow', {
            path: 'cubeEffect',
            info: 'Enables main slider shadow'
          }),
          number('shadowOffset', {
            path: 'cubeEffect',
            info: '	Main shadow offset in px'
          }),
          number('shadowScale', {
            path: 'cubeEffect',
            info: '	Main shadow scale ratio'
          })
        ],
        defaultSetting
      )
    }
    return data
  },
  computed: {
    currentProps() {
      return this.draftNodesMap[this.id].props || {}
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.breakpoints {
  .el-row.is-align-middle {
    padding: 5px 5px 0;
  }
  .el-form-item--mini {
    margin-bottom: 8px;
  }
  .el-col-2 {
    position: absolute;
    top: 0;
  }
  .el-col-2 > [class^='el-icon-'] {
    position: absolute;
    top: -10px;
    font-size: 18px !important;
  }
  .el-col-20 {
    width: 100%;
  }
  .el-icon-circle-plus-outline {
    left: 30px;
  }
}
</style>
