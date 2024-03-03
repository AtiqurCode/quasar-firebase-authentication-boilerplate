<template>
  <q-page class="q-pa-md row justify-center items-center">
    <q-card
      style="width: 400px; max-width: 100%; max-width: 469px; margin: 0 auto"
      class="text-center"
      flat
    >
      <q-card-section class="text-primary q-mb-xl">
        <div class="text-h4 text-bold">Login</div>
      </q-card-section>
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-input
          v-model="email"
          label="Email"
          hint="Your registed email"
          lazy-rules
          outlined
          :rules="[
            (val) => (val && val.length > 0) || 'Please type your email',
          ]"
        />

        <q-input
          :type="isPwd ? 'password' : 'text'"
          v-model="password"
          hint="Password you set"
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
            /> </template
        ></q-input>

        <q-toggle v-model="accept" label="I accept the license and terms" />

        <div>
          <q-btn label="Reset" type="reset" color="primary" flat class="" />
          <q-btn label="Login" @click="signIn" type="submit" color="primary" />
        </div>
      </q-form>

      <q-card-section class="text-caption">
        Don't have an account?
        <q-btn
          flat
          dense
          no-caps
          size="0.75rem"
          class="q-py-none"
          color="primary"
          label="Register Now"
          @click="router.push({ name: 'register' })"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useQuasar, LocalStorage, Cookies } from "quasar";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../boot/firestore";

const $q = useQuasar();
const router = useRouter();

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
      message: "Submitted your info",
    });
  }
};

const onReset = () => {
  email.value = null;
  password.value = null;
  accept.value = false;
};

const signIn = async () => {
  // get the auth api
  await signInWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log(data);
      LocalStorage.set("user", data.user);
      Cookies.set("logToken", data._tokenResponse.idToken, { path: "/" });
      $q.notify({
        color: "green-6",
        textColor: "white",
        icon: "cloud_done",
        message: "User signed in successfully!",
      });
      router.push("/");
    })
    .catch((error) => {
      $q.dialog({
        title: "Alert",
        message: error.message,
      })
        .onOk(() => {
          // console.log('OK')
        })
        .onCancel(() => {
          // console.log('Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    });
};
</script>
