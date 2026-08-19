<script setup lang="ts">
import Footer from '@/common/components/footer/Footer.vue'
import Header from '@/common/components/header/Header.vue'
</script>

<template>
  <div class="app-layout">
    <a class="skip-link" href="#main-content">Saltar al contenido</a>
    <Header />
    <main id="main-content" class="app-layout__main">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<style scoped src="./AppLayout.styles.scss" lang="scss"></style>
