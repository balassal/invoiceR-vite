<template>
  <div class="row items-center q-pa-sm">
    <div class="col-3">Language</div>
    <div class="col-9">
      <q-select
        class="q-pb-none"
        dense
        ref="langSelect"
        :readonly="!props.editable"
        :options="languages"
        v-model="selectedLang"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getLanguages } from "../store/language";

const props = defineProps({
  editable: {
    type: Boolean,
    required: false,
    default: true,
  },
  language: {
    type: [Object, null],
    required: true,
  },
});

const emit = defineEmits(["update:language"]);

const languages = ref(null);
const langSelect = ref(null);
const selectedLang = computed({
  get() {
    return props.language;
  },
  set(val) {
    emit("update:language", val);
  },
});

onMounted(async () => {
  languages.value = await getLanguages();
  selectedLang.value = languages.value.find((l) => l.shortCode == "hu");
});
</script>
