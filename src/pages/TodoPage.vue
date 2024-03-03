<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-page-container>
      <q-page>
        <p v-if="loading">Loading...</p>

        <q-card
          class="my-card"
          v-for="todo in todos"
          :key="todo.name"
          flat
          bordered
        >
          <q-card-section>
            <div class="text-overline text-orange-9">
              {{ todo.remind_date?.toDate().toLocaleDateString() }}
            </div>
            <div class="text-h5 q-mt-sm q-mb-xs">{{ todo.name }}</div>
            <div class="text-caption text-grey">
              {{ todo.description }}
            </div>
          </q-card-section>
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
      </q-page>
    </q-page-container>
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

watch(prompt, (prompt) => {
  console.log("prompt", prompt);
  // fires on nested property mutations
  // Note: `newValue` will be equal to `oldValue` here
  // because they both point to the same object!
});

// const saveTodo = async () => {
//   try {
//     const datas = {
//       name: name.value,
//       description: description.value,
//       remind_date: Timestamp.fromDate(new Date(remind_date.value)),
//     };

//     console.log("datas", datas);
//     // query to get all docs in 'countries' collection
//     await addDoc(collection(firebaseDatabase, "todos"), datas)
//       .then((docRef) => {
//         console.log("Document written with ID: ", docRef.id);
//         prompt.value = false;
//         console.log("prompt", docRef);
//       })
//       .catch((error) => {
//         console.error("Error adding document: ", error);
//       });
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   } finally {
//     // Set loading to false after the fetch operation completes
//   }
// };

// Call the fetchUsers function when the component is mounted
onMounted(() => {
  fetchTodos();
  console.log("prompt", prompt.value);
  console.log("auth", auth);
});
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 350px
</style>
