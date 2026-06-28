<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: IndexCollectionItem
}>()

const SLOT_COUNT = 6
const ROTATE_INTERVAL = 1100

const pool = computed(() =>
  props.page?.skills?.categories?.flatMap(category => category.items) ?? []
)

// One pointer (index into the skills pool) per visible tile. Pointers start on
// distinct residues (0..5) and only ever advance by SLOT_COUNT, so the six
// visible tiles never show the same skill at once as long as the pool length is
// a multiple of SLOT_COUNT.
const pointers = ref<number[]>(Array.from({ length: SLOT_COUNT }, (_, i) => i))
const hoveredSlot = ref<number | null>(null)

const visibleSkills = computed(() =>
  pointers.value.map(pointer => pool.value[pointer % (pool.value.length || 1)])
)

let timer: ReturnType<typeof setInterval> | null = null
let cursor = 0

onMounted(() => {
  if (pool.value.length <= SLOT_COUNT) return
  timer = setInterval(() => {
    const slot = cursor % SLOT_COUNT
    cursor++
    // Pause the tile the user is hovering so it can be read.
    if (hoveredSlot.value === slot) return
    pointers.value[slot] = (pointers.value[slot]! + SLOT_COUNT) % pool.value.length
  }, ROTATE_INTERVAL)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <UPageSection
    v-if="page?.skills"
    :title="page.skills.title"
    :description="page.skills.description"
    :ui="{
      container: 'px-0 pt-0! gap-6 sm:gap-6',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted'
    }"
  >
    <Motion
      :initial="{ opacity: 0, transform: 'translateY(20px)' }"
      :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
      :transition="{ delay: 0.1 }"
      :in-view-options="{ once: true }"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <div
          v-for="(skill, i) in visibleSkills"
          :key="i"
          class="group relative overflow-hidden rounded-2xl border border-default bg-elevated/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-elevated/70 hover:shadow-lg hover:shadow-primary/5"
          @mouseenter="hoveredSlot = i"
          @mouseleave="hoveredSlot = null"
        >
          <div
            class="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            :style="{ backgroundColor: skill?.color }"
          />
          <Transition name="skill-fade" mode="out-in">
            <div
              :key="skill?.name"
              class="relative"
            >
              <UIcon
                :name="skill?.icon"
                class="size-8 transition-transform duration-300 group-hover:scale-110"
                :style="{ color: skill?.color }"
              />
              <h3 class="mt-4 font-semibold text-highlighted">
                {{ skill?.name }}
              </h3>
              <p class="mt-1 min-h-[2.5rem] text-sm text-muted">
                {{ skill?.description }}
              </p>
            </div>
          </Transition>
        </div>
      </div>

      <ULink
        to="/skills"
        class="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-primary"
      >
        <UIcon name="i-lucide-plus" class="size-4" />
        More tools &amp; technologies in my toolbox
        <UIcon
          name="i-lucide-arrow-right"
          class="size-4 transition-transform duration-300 group-hover:translate-x-1"
        />
      </ULink>
    </Motion>
  </UPageSection>
</template>

<style scoped>
.skill-fade-enter-active,
.skill-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.skill-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.skill-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
