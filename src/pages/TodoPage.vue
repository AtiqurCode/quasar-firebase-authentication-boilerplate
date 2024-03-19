<template>
  <div class="q-pa-md column items-center">
    <p v-if="loading">Loading...</p>
    <q-card class="my-card q-mb-md" v-for="todo in todos" :key="todo.name">
      <q-card-section vertical>
        <div class="text-h5 q-mt-sm q-mb-xs">{{ todo.name }}</div>
        <div class="text-caption text-grey">
          {{ todo.description }}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn flat>
          {{ todo.remind_date?.toDate().toLocaleDateString() }}
        </q-btn>
        <q-btn flat round icon="delete" />
        <q-btn flat round icon="edit" />
      </q-card-actions>
    </q-card>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="primary"
        @click="$q.dialog({ component: TodoCreate })"
      />
    </q-page-sticky>
    <!-- Add a button to open a dialog with a toolbar -->
    <!-- <TodoCreate :promptValue="prompt" /> -->
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { firebaseDatabase, auth } from "/src/boot/firestore.js";
import TodoCreate from "src/components/TodoCreate.vue";
import {
  collection,
  getDocs,
  query,
  addDoc,
  Timestamp,
} from "firebase/firestore";

const todos = ref([]);
const loading = ref(true);
const prompt = ref(false);

const fetchTodos = async () => {
  try {
    // query to get all docs in 'countries' collection
    const querySnap = await getDocs(
      query(collection(firebaseDatabase, "todos"))
    );

    // add each doc to 'countries' array
    querySnap.forEach((doc) => {
      todos.value.push(doc.data());
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    // Set loading to false after the fetch operation completes
    loading.value = false;
  }
};

watch(prompt, (prompt) => {});

onMounted(() => {
  fetchTodos();
});
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 500px
</style>
