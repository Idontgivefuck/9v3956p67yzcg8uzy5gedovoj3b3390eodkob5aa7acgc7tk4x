<template>
  <div class="flex flex-col items-center mb-2">
    <div class="relative">
      <div class="rounded-full bg-gray-200 w-24 h-24 flex items-center justify-center">
        <img
          referrerpolicy="no-referrer"
          :src="realmoji.media.url"
          class="rounded-full object-cover w-full h-full"
/>
      </div>
      <span class="absolute top-[50%] left-[50%] transform[-translate-x-1/2] transform[-translate-y-1/2] text-5xl">
        {{ realmoji.emoji }}
      </span>
    </div>
    <span class="font-bold ml-4">{{ realmoji.user.username }}</span>
  </div>
</template>

<script>
export default {
  props: ["realmoji"],
};
</script>
