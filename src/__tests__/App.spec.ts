import { describe, it, expect } from 'vitest'

import { shallowMount } from '@vue/test-utils'
import { RouterView } from 'vue-router'
import App from '../app/App.vue'

describe('App', () => {
  it('renders the active route', () => {
    const wrapper = shallowMount(App)

    expect(wrapper.findComponent(RouterView).exists()).toBe(true)
  })
})
