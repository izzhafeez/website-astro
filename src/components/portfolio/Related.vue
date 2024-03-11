<template>
  <div><a :href="link" class="button text-xs" :class="color">{{ label }} <i v-if="link" class="fa-solid fa-link"></i></a></div>
</template>

<script>
import { toName } from 'utils/string';
import skillsData from 'data/portfolio/skills.json';
export default {
  name: 'Related',
  props: ['text'],
  computed: {
    color() {
      return 'bg-ew-300/20 dark:bg-ew-300/20 text-ew-600 dark:text-ew-100 py-1 px-2 rounded-xl';
    },

    label() {
      const splitted = this.text.split('/');
      if (splitted.length === 1) {
        return skillsData[splitted[0]].title || toName(splitted[0]);
      }
      return toName(splitted[1].split('#')[1]);
    },

    link() {
      const splitted = this.text.split('/');
      if (splitted.length === 1) {
        return null;
      }
      const type = splitted[1].split('#')[0];
      return '/' + this.text;
    }
  }
}
</script>
