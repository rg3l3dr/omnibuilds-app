<template lang="html">
  <div class="ui grid">
    <div class="row" style='margin: 20px 0px 0px 0px'>
      <div class="four wide column">
        <div class='ui small top attached header'>
          <i class="fa fa-gear primary"></i>
          <div class="content">
            &nbsp
            Project Settings
          </div>
        </div>
        <div class="ui bottom attached clearing segment">
          <div class="ui secondary vertical menu">
            <router-link
              tag='a'
              class='item'
              :to=' this.designRoute + "/settings/basic"'
            >
              <a id='basic'>
                <i class="fa fa-info-circle"></i> &nbsp; Info
              </a>
            </router-link>
            <router-link tag='a' class='item' :to='this.designRoute + "/settings/revs"'>
              <a>
                <i class="fa-files-o icon"></i>
                Revisions
              </a>
            </router-link>
            <router-link
              v-if='!design.is_collaborator'
              tag='a'
              class='item'
              :to=' this.designRoute + "/settings/collaborators"'
            >
              <a>
                <i class="fa fa-users"></i> &nbsp; Collaborators
              </a>
            </router-link>
            <router-link
              v-if='!design.is_collaborator'
              tag='a'
              class='item'
              :to=' this.designRoute + "/settings/shares"'
            >
              <a>
                <i class="share icon"></i> &nbsp; Shares
              </a>
            </router-link>
            <router-link
              v-if='!design.is_collaborator'
              tag='a'
              class='item'
              :to='this.designRoute + "/settings/advanced"'
            >
              <a>
                <i class="warning sign icon"></i> &nbsp; Advanced
              </a>
            </router-link>
          </div>
        </div>
      </div><!-- /.col-xs-3 -->
      <div class="twelve wide column">
        <div class="tab-content">
          <transition name='fade'>
            <router-view name='settingsContent'></router-view>
          </transition>
        </div><!-- /.tab-content -->
      </div><!-- /.col-xs-9 -->
    </div>
  </div>

</template>

<script>

import { mapState, mapGetters } from 'vuex'
export default {
  name: 'home',
  data () {
    return {
    }
  },
  computed: {
    ...mapState([
      'session',
      'profile',
      'design',
      'designRefs',
    ]),
    ...mapGetters([
      'designRoute',
      'endpoint',
      'pre_endpoint'
    ])
  },
  methods: {

  },
  created: function() {
    // let refs_payload = {
    //   config: this.$route.params.config_slug ? this.$route.params.config_slug : null,
    //   rev: this.$route.params.rev_slug ? this.$route.params.rev_slug : null,
    //   change: this.$route.params.change ? this.$route.params.change : null,
    // }
    // this.$store.commit('setRefs', refs_payload)
  },
  mounted: function() {
  }
}
</script>

<style lang="css">
  .fade-enter-active, .fade-leave-active {
    transition-property: opacity;
    transition-duration: .25s;
  }

  .fade-enter-active {
    transition-delay: .25s;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }
</style>
