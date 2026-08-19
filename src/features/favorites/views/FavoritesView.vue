<script setup lang="ts">
import { storeToRefs } from 'pinia'

import FavoriteCard from '@/features/favorites/components/favorite-card/FavoriteCard.vue'
import FavoriteForm from '@/features/favorites/components/favorite-form/FavoriteForm.vue'
import { useFavoritesStore } from '@/features/favorites/stores/favorites.store'

const favoritesStore = useFavoritesStore()
const { favorites, favoriteCount } = storeToRefs(favoritesStore)
</script>

<template>
  <section class="favorites" aria-labelledby="favorites-title">
    <header class="page-heading">
      <p class="page-heading__eyebrow">Tu recetario personal</p>
      <h1 id="favorites-title">Platos favoritos</h1>
      <p>Guarda aquí esos platos que siempre apetece repetir. Tienes {{ favoriteCount }}.</p>
    </header>

    <FavoriteForm />

    <div v-if="favorites.length" class="favorites-grid">
      <FavoriteCard
        v-for="favorite in favorites"
        :key="favorite.id"
        :favorite="favorite"
        @remove="favoritesStore.removeFavorite"
      />
    </div>

    <div v-else class="empty-state">
      <span class="empty-state__icon" aria-hidden="true">
        <span class="material-icons-outlined">favorite_border</span>
      </span>
      <h2>Tu lista está esperando su primer favorito</h2>
      <p>Cuando guardes un plato frecuente, aparecerá aquí para que puedas reutilizarlo.</p>
    </div>
  </section>
</template>

<style scoped src="./FavoritesView.styles.scss" lang="scss"></style>
