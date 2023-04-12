<template>

  <v-footer app padless absolute v-if="!isMessage" style="z-index: 998">
    <div class="footer-wrap">
      <div>
        ©{{ formatDate(blogInfo.websiteConfig.websiteCreateTime, "YYYY") }} -
        {{ new Date().getFullYear() }} By
        {{ blogInfo.websiteConfig.websiteAuthor }}
      </div>
      <a href="https://beian.miit.gov.cn/" target="_blank">
        {{ blogInfo.websiteConfig.websiteRecordNo }}
      </a>
    </div>
  </v-footer>


</template>

<script>
import store from "@/store";
import {formatDate} from "@/common/js/formatDate";
import {useRoute, useRouter} from "vue-router";
import {ref, watch} from "vue";

export default {
  name: 'Footer',
  setup() {
    let blogInfo = store.state.blogInfo
    let route = useRoute();
    let isMessage = ref(false)
    watch(route, (to) => {
      isMessage.value = false
      if (to.path == '/message')
        isMessage.value = true
    })
    return {
      blogInfo,
      isMessage,
      formatDate
    }
  },
};
</script>

<style scoped>
.footer-wrap {
  padding: 0;
  width: 100%;
  line-height: 2;
  position: relative;
  padding: 40px 20px;
  color: #eee;
  font-size: 14px;
  text-align: center;
  background: linear-gradient(-45deg, #ee7752, #ce3e75, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: Gradient 10s ease infinite;
}

.footer-wrap a {
  color: #eee !important;
}

@keyframes Gradient {
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
