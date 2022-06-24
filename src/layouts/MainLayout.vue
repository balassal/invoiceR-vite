<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> invoiceR </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      :width="drawerWidth"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header> </q-item-label>

        <q-item
          v-for="(item, index) in menu"
          :key="index"
          :to="item.route"
          exact
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ item.title }}</q-item-label>
            <q-item-label caption>{{ item.subtitle }}</q-item-label>
          </q-item-section>
        </q-item>
        <!-- <q-item to="/invoices" exact>
          <q-item-section avatar>
            <q-icon name="receipt" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Invoices</q-item-label>
            <q-item-label caption>List of invoices</q-item-label>
          </q-item-section>
        </q-item> -->
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { getMainMenu, getSettingsMenu } from "src/store/menu";

const route = useRoute();
const leftDrawerOpen = ref(false);
const drawerWidth = 225;

const menu = computed(() => {
  return route.fullPath.startsWith("/settings")
    ? getSettingsMenu()
    : getMainMenu();
});

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>
