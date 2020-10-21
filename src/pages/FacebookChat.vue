<template>
  <div>
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
  created() {
    window.fbAsyncInit = function() {
      FB.init({
        xfbml: true,
        version: 'v8.0'
      })

      FB.CustomerChat.show({ shouldShowDialog: true })
    }
    ;(function(d, s, id) {
      var js
      var fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) return
      js = d.createElement(s)
      js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js'
      fjs.parentNode.insertBefore(js, fjs)
    })(document, 'script', 'facebook-jssdk')
  }
}
</script>
