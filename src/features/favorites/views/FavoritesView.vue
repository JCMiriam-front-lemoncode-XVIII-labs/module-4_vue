<template>
  <section class="favorites" aria-labelledby="favorites-title">
    <header class="page-heading">
      <p class="page-heading__eyebrow">Tu recetario personal</p>
      <h1 id="favorites-title">Platos favoritos</h1>
      <p>Guarda aquí esos platos que siempre apetece repetir.</p>
    </header>

    <div class="empty-state">
      <span class="empty-state__icon" aria-hidden="true">
        <span class="material-icons-outlined">favorite_border</span>
      </span>
      <h2>Tu lista está esperando su primer favorito</h2>
      <p>Cuando guardes un plato frecuente, aparecerá aquí para que puedas reutilizarlo.</p>
      <RouterLink class="empty-state__link" to="/">Volver al plan semanal</RouterLink>
    </div>
  </section>
</template>

<style scoped src="./FavoritesView.styles.scss" lang="scss"></style>
