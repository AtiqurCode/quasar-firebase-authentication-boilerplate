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
        <q-btn flat round icon="delete" @click="deleteTodo(todo.id)" />
        <q-btn flat round icon="edit" />
      </q-card-actions>
    </q-card>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="primary"
        @click="
          $q.dialog({ component: TodoCreate, props: { todoList: todos } })
        "
      />
    </q-page-sticky>
    <!-- Add a button to open a dialog with a toolbar -->
    <!-- <TodoCreate :promptValue="prompt" /> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { firebaseDatabase, auth } from "/src/boot/firestore.js";
import TodoCreate from "src/components/TodoCreate.vue";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

const todos = ref([]);
const loading = ref(true);
const $q = useQuasar();

/**
 * Fetch all todos from the database
 */
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

/**
 * Delete a todo from the database
 * @param {string} productId - The unique id of the todo to delete
 */
const deleteTodo = async (productId) => {
  await getDocs(
    query(collection(firebaseDatabase, "todos"), where("id", "==", productId))
  )
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((docSnapshot) => {
          const documentId = docSnapshot.id;
          deleteDoc(doc(firebaseDatabase, "todos", documentId))
            .then(() => {
              $q.notify({
                color: "red-5",
                textColor: "white",
                icon: "warning",
                message: "Todo deleted successfully!",
              });
            })
            .catch((error) => {
              console.error("Error deleting document:", error);
            });
        });
      } else {
        console.log(
          "No documents found with the specified unique field value."
        );
      }
    })
    .catch((error) => {
      console.error("Error searching for documents:", error);
    });
};

onMounted(() => {
  fetchTodos();
});
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 500px
</style>
