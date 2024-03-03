<template>
  <q-page class="q-pa-md row justify-center items-center">
    <q-card
      style="width: 400px; max-width: 100%; max-width: 469px; margin: 0 auto"
      class="text-center"
      flat
    >
      <q-card-section class="text-primary q-mb-xl">
        <div class="text-h4 text-bold">Register</div>
      </q-card-section>
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <!-- <q-input
          v-model="name"
          required
          label="Name"
          hint="Your name"
          lazy-rules
          outlined
          :rules="[(val) => (val && val.length > 0) || 'Please type your name']"
        /> -->
        <q-input
          v-model="email"
          required
          label="Email"
          hint="Your email"
          lazy-rules
          outlined
          :rules="[
            (val) => (val && val.length > 0) || 'Please type your email',
          ]"
        />

        <q-input
          :type="isPwd ? 'password' : 'text'"
          v-model="password"
          hint="Password you want to set"
          label="Password"
          outlined
          lazy-rules
          :rules="[
            (val) =>
              (val !== null && val !== '') || 'Please type your password',
          ]"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-checkbox
          v-model="accept"
          label="Accept terms and condition"
          color="primary"
        />

        <div>
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
          <q-btn
            @click="register"
            label="Register"
            type="submit"
            color="primary"
          />
        </div>
      </q-form>

      <q-card-section class="text-caption">
        Already Registered?
        <q-btn
          flat
          dense
          no-caps
          size="0.75rem"
          class="q-py-none"
          color="primary"
          label="Login"
          @click="router.push({ name: 'login' })"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../boot/firestore";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();

const name = ref(null);
const email = ref(null);
const password = ref(null);
const accept = ref(false);
const isPwd = ref(true);

const onSubmit = () => {
  if (accept.value !== true) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "You need to accept the license and terms first",
    });
  } else {
    $q.notify({
      color: "green-6",
      textColor: "white",
      icon: "cloud_done",
      message: "Submitted",
    });
    console.log("Submitted", name.value, email.value);
  }
};

const onReset = () => {
  name.value = null;
  email.value = null;
  password.value = null;
  accept.value = false;
};
const register = async () => {
  // get the auth api
  await createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log(data);
      $q.notify({
        color: "green-6",
        textColor: "white",
        icon: "cloud_done",
        message: "User registered successfully!",
      });
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log(error.code);
      alert(error.message);
    });
};
</script>
