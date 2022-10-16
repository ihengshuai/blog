<template>
  <div>
    <VPTeamMembers :size="size" :members="members" />
  </div>
</template>

<script setup>
import { VPTeamMembers } from "vitepress/theme";
import svgs from "./svg.js";

defineProps({
  size: {
    type: String,
    default: "small",
  },
  members: Array,
});
</script>
