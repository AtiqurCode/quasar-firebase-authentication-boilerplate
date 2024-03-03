<template>
  <q-page class="flex-center">
    <div class="q-pa-md row items-start q-gutter-md">
      <p v-if="loading">Loading...</p>
      <q-p class="text-h3" v-if="log_email">{{ log_email }}</q-p>
      <q-card class="my-card" v-for="user in users" :key="user.name">
        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
          <div class="absolute-bottom">
            <div class="text-h6">{{ user.name }}</div>
            <div class="text-subtitle2">{{ user.email }}</div>
          </div>
        </q-img>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { firebaseDatabase } from "/src/boot/firestore.js";
import { collection, getDocs, query } from "firebase/firestore";
import { ref, onMounted } from "vue";

const users = ref([]);
const loading = ref(true);

const fetchUsers = async () => {
  try {
    // query to get all docs in 'countries' collection
    const querySnap = await getDocs(
      query(collection(firebaseDatabase, "users"))
    );

    // add each doc to 'countries' array
    querySnap.forEach((doc) => {
      users.value.push(doc.data());
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    // Set loading to false after the fetch operation completes
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers(); // Call the fetchUsers function when the component is mounted
});
</script>

<style>
.my-card {
  width: 100%;
  max-width: 250px;
}
</style>
