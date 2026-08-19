import { describe, it, expect } from 'vitest'

import { shallowMount } from '@vue/test-utils'
import App from '../app/App.vue'
import AppLayout from '../common/layouts/AppLayout.vue'

describe('App', () => {
  it('renders the application layout', () => {
    const wrapper = shallowMount(App)

    expect(wrapper.findComponent(AppLayout).exists()).toBe(true)
  })
})
