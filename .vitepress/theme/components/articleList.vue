<template>
  <div class="article-page">
    <div class="search-box">
      <input
        v-model="keyword"
        type="text"
        class="search-input"
        placeholder="按标题搜索文章..."
      />
    </div>
    <div class="wrapper" v-for="(item, index) in filteredList" :key="index">
      <div class="article">
        <div class="title">标题{{ index + 1 }}: <span><a :href="item.href" target="_blank">{{ item.title }}</a></span></div>
      </div>
    </div>
  </div>
</template>
<script setup name="article-list">
import Data from './acticle.json'
import { ref, computed } from 'vue'

const articleList = ref(Data)
const keyword = ref('')

const filteredList = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  if (!k) return articleList.value
  return articleList.value.filter((item) =>
    item.title.toLowerCase().includes(k)
  )
})
</script>
<style scoped>
.article-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.search-box {
  margin-bottom: 0.5rem;
}
.search-input {
  width: 100%;
  max-width: 400px;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  outline: none;
  transition: border-color 0.2s;
}
.search-input::placeholder {
  color: var(--vp-c-text-3);
}
.search-input:focus {
  border-color: var(--vp-c-brand-1);
}
.wrapper {
  display: flex;
}
</style>