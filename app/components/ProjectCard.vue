<script setup lang="ts">
interface OwnedItem {
  icon: string
  label: string
}

defineProps<{
  title: string
  tagline: string
  description: string
  icon: string
  owned: OwnedItem[]
  achievements: string[]
  tech: string[]
  liveUrl?: string
}>()
</script>

<template>
  <div
    class="rounded-2xl border border-default bg-elevated/40 p-6 sm:p-8 ring-1 ring-default/50 transition-shadow hover:shadow-lg"
  >
    <!-- Header -->
    <div class="flex items-start gap-4">
      <div
        class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/50 text-2xl font-bold text-inverted shadow-md shadow-primary/30"
      >
        {{ icon }}
      </div>
      <div>
        <h3 class="text-xl font-semibold text-highlighted sm:text-2xl">
          {{ title }}
        </h3>
        <p class="mt-1 text-sm text-muted sm:text-base">
          {{ tagline }}
        </p>
      </div>
    </div>

    <!-- Intro -->
    <p class="mt-5 text-sm leading-relaxed text-toned">
      {{ description }}
    </p>

    <div class="my-6 border-t border-default" />

    <!-- Owned + Achievements -->
    <div class="grid gap-8 sm:grid-cols-2">
      <div>
        <h4 class="text-xs font-semibold uppercase tracking-wider text-primary">
          What I Owned
        </h4>
        <ul class="mt-4 space-y-3">
          <li
            v-for="item in owned"
            :key="item.label"
            class="flex items-center gap-3 text-sm text-toned"
          >
            <UIcon
              :name="item.icon"
              class="size-4 shrink-0 text-primary"
            />
            {{ item.label }}
          </li>
        </ul>
      </div>

      <div>
        <h4 class="text-xs font-semibold uppercase tracking-wider text-primary">
          Key Achievements
        </h4>
        <ul class="mt-4 space-y-3">
          <li
            v-for="achievement in achievements"
            :key="achievement"
            class="flex items-start gap-3 text-sm text-toned"
          >
            <UIcon
              name="i-lucide-circle-check"
              class="mt-0.5 size-4 shrink-0 text-primary"
            />
            {{ achievement }}
          </li>
        </ul>
      </div>
    </div>

    <div class="my-6 border-t border-default" />

    <!-- Technology -->
    <h4 class="text-xs font-semibold uppercase tracking-wider text-primary">
      Technology
    </h4>
    <div class="mt-4 flex flex-wrap gap-2">
      <span
        v-for="item in tech"
        :key="item"
        class="rounded-lg bg-default px-3 py-1.5 text-xs font-medium text-toned ring-1 ring-default"
      >
        {{ item }}
      </span>
    </div>

    <!-- Footer links -->
    <div
      v-if="liveUrl"
      class="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-default pt-6"
    >
      <ULink
        :to="liveUrl"
        target="_blank"
        class="group inline-flex items-center gap-1 text-sm font-medium text-primary"
      >
        Live Product
        <UIcon
          name="i-lucide-arrow-up-right"
          class="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </ULink>
    </div>
  </div>
</template>
