<template>
  <q-layout view="lHh Lpr lFf">
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

        <q-toolbar-title> Quasar & Firebase </q-toolbar-title>

        <div>
          <q-btn
            @click.prevent="logOut"
            flat
            round
            color="white"
            icon="logout"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item class="text-h6" header>
          {{ log_email ?? "User have no email" }}
        </q-item>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { LocalStorage, Cookies } from "quasar";
import { useRouter } from "vue-router";
import { auth } from "../boot/firestore";
import { signOut } from "firebase/auth";

const router = useRouter();

const linksList = [
  {
    title: "Dashboard",
    caption: "Dashboard",
    icon: "dashboard",
    link: "/",
  },
  {
    title: "Todo",
    caption: "Todos",
    icon: "task",
    link: "/todos",
  },
];

const leftDrawerOpen = ref(false);
const log_email = ref(null);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const loginEmail = async () => {
  try {
    let storageUser = LocalStorage.getAll();
    log_email.value = storageUser.user.email;
  } catch (error) {
    console.error("Login Email Error: ", error);
  } finally {
    // Set loading to false after the fetch operation completes
  }
};

const logOut = async () => {
  try {
    await signOut(auth)
      .then(() => {
        console.log("User successfully signed out");
        // Sign-out successful.
      })
      .catch((error) => {
        console.error("Logout Error: ", error);
      });

    // console.log("User successfully signed out");
  } catch (error) {
    console.error("Logout Error: ", error);
  }

  Cookies.remove("logToken");
  LocalStorage.remove("user");
  router.push("/auth/login");
};

onMounted(() => {
  loginEmail();
});
</script>
