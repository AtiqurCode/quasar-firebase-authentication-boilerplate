<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 500px" class="q-pa-md">
      <q-form class="q-gutter-md">
        <q-input
          filled
          v-model="name"
          label="Your tasks name"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        />

        <q-input
          filled
          type="textarea"
          v-model="description"
          label="Your tasks description"
          lazy-rules
        />

        <q-input filled v-model="remind_date">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="remind_date" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="remind_date" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup @click="closeDialog" />
          <q-btn
            label="Update"
            type="submit"
            @click.prevent="updateTodoData(todo_id)"
            color="primary"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import { firebaseDatabase } from "/src/boot/firestore.js";
import {
  collection,
  Timestamp,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useQuasar } from "quasar";

const name = ref("");
const todo_id = ref(null);
const description = ref("");
const remind_date = ref("");
const isOpen = ref(false);
const $q = useQuasar();

const closeDialog = () => {
  isOpen.value = false;
};

const props = defineProps({
  updateTodo: Object,
});

const updateTodoData = async (todoId) => {
  const updatedData = {
    name: name.value,
    description: description.value,
    remind_date: Timestamp.fromDate(new Date(remind_date.value)),
  };
  await getDocs(
    query(collection(firebaseDatabase, "todos"), where("id", "==", todoId))
  )
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((docSnapshot) => {
          const documentId = docSnapshot.id;
          updateDoc(doc(firebaseDatabase, "todos", documentId), updatedData)
            .then(() => {
              closeDialog();

              $q.notify({
                color: "green-5",
                textColor: "white",
                type: "positive",
                message: "Todo updated successfully!",
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

const parseTimestamp = (timestamp) => {
  // Create a new Date object from the timestamp in seconds
  const date = new Date(timestamp * 1000);

  // Get year, month (0-indexed), day, hours, minutes
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero for single-digit months
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Return the formatted date string
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

onMounted(() => {
  todo_id.value = props.updateTodo.id;
  name.value = props.updateTodo.name;
  description.value = props.updateTodo.description;
  remind_date.value = parseTimestamp(props.updateTodo.remind_date.seconds);
});
</script>
