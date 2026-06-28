<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => {
  return queryCollection('index').first()
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const categoryIcons: Record<string, string> = {
  'Front-end Stack': 'i-lucide-layout-template',
  'Back-end Stack': 'i-lucide-server',
  'Databases': 'i-lucide-database',
  'Testing': 'i-lucide-flask-conical',
  'Integrations': 'i-lucide-puzzle',
  'CI/CD': 'i-lucide-git-branch',
  'DevOps (AWS)': 'i-lucide-cloud',
  'Others': 'i-lucide-sparkles'
}

useSeoMeta({
  title: 'Skills & Expertise',
  ogTitle: 'Skills & Expertise',
  description: 'Principal engineer and software architect skills across system design, front-end, back-end, databases, DevOps and cloud infrastructure.',
  ogDescription: 'Principal engineer and software architect skills across system design, front-end, back-end, databases, DevOps and cloud infrastructure.'
})
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      title="Skills & Expertise"
      description="A comprehensive overview of my technical skills and expertise across the full stack, from front-end frameworks to cloud infrastructure and DevOps."
      :ui="{
        title: 'mx-0! text-left',
        description: 'mx-0! text-left'
      }"
    />
    <UPageSection
      :ui="{
        container: 'pt-0!'
      }"
    >
      <div class="space-y-12">
        <Motion
          v-for="(category, index) in page.skills.categories"
          :key="index"
          :initial="{ opacity: 0, transform: 'translateY(20px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.05 * index }"
          :in-view-options="{ once: true }"
        >
          <div class="mb-5 flex items-center gap-3">
            <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <UIcon
                :name="categoryIcons[category.name] || 'i-lucide-code'"
                class="size-5 text-primary"
              />
            </div>
            <div>
              <h2 class="text-lg font-semibold text-highlighted">
                {{ category.name }}
              </h2>
              <p class="text-sm text-muted">
                {{ category.items.length }} {{ category.items.length === 1 ? 'skill' : 'skills' }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="(skill, skillIndex) in category.items"
              :key="skillIndex"
              class="group relative overflow-hidden rounded-2xl border border-default bg-elevated/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-elevated/70 hover:shadow-lg hover:shadow-primary/5"
            >
              <div
                class="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                :style="{ backgroundColor: skill.color }"
              />
              <div class="relative">
                <UIcon
                  :name="skill.icon"
                  class="size-8 transition-transform duration-300 group-hover:scale-110"
                  :style="{ color: skill.color }"
                />
                <h3 class="mt-4 font-semibold text-highlighted">
                  {{ skill.name }}
                </h3>
                <p class="mt-1 min-h-[2.5rem] text-sm text-muted">
                  {{ skill.description }}
                </p>
              </div>
            </div>
          </div>
        </Motion>
      </div>
    </UPageSection>
  </UPage>
</template>
