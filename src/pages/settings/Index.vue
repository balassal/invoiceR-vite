<template>
  <q-page padding>
    <div class="row justify-center q-gutter-sm">
      <div v-for="item in items" class="col-3">
        <q-card class="cursor-pointer" @click="navigate(item)">
          <q-card-section class="text-center">
            <q-icon class="q-mr-sm" :name="item.icon" size="sm" />
            <span class="text-subtitle1">
              {{ item.title }}
            </span>
          </q-card-section>
          <q-card-section class="text-center">
            <span class="subtitle2">
              {{ item.subtitle }}
            </span>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { getSettingsMenu } from "src/store/menu";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const items = ref([]);
const router = useRouter();

onMounted(() => {
  items.value = getSettingsMenu();
});

const navigate = (item) => {
  router.push({ path: item.route });
};
</script>
