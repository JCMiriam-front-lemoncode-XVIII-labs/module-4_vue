import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

import MealForm from '@/features/meal-plan/components/meal-form/MealForm.vue'
import { useMealPlanStore } from '@/features/meal-plan/stores/meal-plan.store'

describe('MealForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds a meal and resets every field', async () => {
    const wrapper = mount(MealForm)
    const store = useMealPlanStore()
    const nameInput = wrapper.get<HTMLInputElement>('input[name="name"]')
    const daySelect = wrapper.get<HTMLSelectElement>('select[name="day"]')
    const categorySelect = wrapper.get<HTMLSelectElement>('select[name="category"]')

    await nameInput.setValue('Tortilla de patatas')
    await daySelect.setValue('friday')
    await categorySelect.setValue('dinner')
    await wrapper.get('form').trigger('submit')

    expect(store.meals).toHaveLength(1)
    expect(store.meals[0]).toMatchObject({
      name: 'Tortilla de patatas',
      day: 'friday',
      category: 'dinner',
    })
    expect(nameInput.element.value).toBe('')
    expect(daySelect.element.value).toBe('monday')
    expect(categorySelect.element.value).toBe('lunch')
  })

  it('shows an accessible error when the name is empty', async () => {
    const wrapper = mount(MealForm)
    const store = useMealPlanStore()

    await wrapper.get('form').trigger('submit')

    expect(wrapper.get('[role="alert"]').text()).toBe('Escribe el nombre del plato.')
    expect(wrapper.get('input[name="name"]').attributes('aria-invalid')).toBe('true')
    expect(store.meals).toEqual([])
  })
})
