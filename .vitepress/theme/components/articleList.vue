<template >
  <div class="wrapper" v-for="(item, index) in articleList" :key="index">
    <div class="article">
      <div class="title">标题{{ index+ 1 }}: <span><a :href="item.href" target="_blank">{{ item.title }}</a></span></div>
    </div>
  </div>
</template>
<script setup name="article-list">
import Data from './acticle.json'
import { ref } from 'vue'

const articleList = ref(Data)
</script>
<style scoped>
.wrapper {
  display: flex;

}
.article {
  
}
</style>