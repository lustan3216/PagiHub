<template>
  <div v-show="visible">
    <!-- Load Facebook SDK for JavaScript -->
    <div id="fb-root" />
    <!-- Your Chat Plugin code -->
    <div
      class="fb-customerchat"
      attribution="setup_tool"
      page_id="100384305207740"
      theme_color="#0095F9"
    />
  </div>
</template>

<script>
export default {
  name: 'FacebookChat',
  data() {
    return {
      promiseFB: null,
      visible: false
    }
  },
  watch: {
    '$route.meta.noFbChat': {
      handler(noFbChat) {
        this.visible = !noFbChat
      },
      immediate: true
    }
  },
  created() {
    window.fbAsyncInit = () => {
      window.FB.init({
        xfbml: true,
        version: 'v8.0'
      })
    }
    ;(function(d, s, id) {
      const fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) return
      const js = d.createElement(s)
      js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js'
      fjs.parentNode.insertBefore(js, fjs)
    })(document, 'script', 'facebook-jssdk')
  },
  methods: {
    // load() {
    //   this.promiseFB = new Promise((resolve, reject) => {})
    // },
    // try(noFbChat) {
    //   if (noFbChat) {
    //     this.close()
    //   }
    //   else {
    //     this.open()
    //   }
    // },
    // async open() {
    //   const fb = await this.promiseFB
    //   fb.CustomerChat.show()
    //   fb.CustomerChat.hideDialog()
    // },
    // async close() {
    //   const fb = await this.promiseFB
    //   fb.CustomerChat.hide()
    // }
  }
}
</script>
