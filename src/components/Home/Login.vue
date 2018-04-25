<template>
  <div class="page-container">
    <md-toolbar class="md-primary">
      <md-button
        class="md-icon-button"
        @click="showNavigation = true">
        <md-icon>menu</md-icon>
      </md-button>
      <span class="md-title">XaFF</span>
    </md-toolbar>

    <md-drawer :md-active.sync="showNavigation">
      <md-toolbar
        class="md-transparent"
        md-elevation="0">
        <span class="md-title">XaFF</span>
      </md-toolbar>

      <md-list>
        <md-list-item>
          <md-icon>home</md-icon>
          <span
            to="/"
            class="md-list-item-text">Home</span>
        </md-list-item>
      </md-list>
    </md-drawer>

    <md-content>
      <form
        novalidate
        class="md-layout"
        @submit.prevent="validateUser">
        <md-card class="md-layout-item md-with-hover md-size-40 md-small-size-100">
          <md-card-media md-ratio="16:9">
            <img
              src="./../../assets/img/cover.jpg"
              alt="Login header">
          </md-card-media>

          <md-card-header>
            <div class="md-title">Login</div>
          </md-card-header>

          <md-card-content>
            <md-field :class="getValidationClass('email')">
              <label for="email">Email</label>
              <md-input
                type="email"
                name="email"
                id="email"
                autocomplete="email"
                v-model="form.email"
                :disabled="sending" />
              <span
                class="md-error"
                v-if="!$v.form.email.required">The email is required</span>
              <span
                class="md-error"
                v-else-if="!$v.form.email.email">Invalid email</span>
            </md-field>
            <md-field :class="getValidationClass('password')">
              <label for="password">Password</label>
              <md-input
                type="password"
                name="password"
                id="password"
                autocomplete="password"
                v-model="form.password"
                :disabled="sending" />
              <span
                class="md-error"
                v-if="!$v.form.password.required">The password is required</span>
              <span
                class="md-error"
                v-else-if="!$v.form.password.minlength">Invalid password lenght</span>
            </md-field>
          </md-card-content>

          <md-progress-bar
            md-mode="indeterminate"
            v-if="sending" />

          <md-card-actions>
            <md-button to="/">Cancel</md-button>
            <md-button
              type="submit"
              class="md-primary"
              :disabled="sending">Login</md-button>
          </md-card-actions>
        </md-card>
      </form>
    </md-content>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import {
  required,
  email,
  minLength
} from 'vuelidate/lib/validators';
import auth from '../../auth';

export default {
  mixins: [validationMixin],
  data: () => ({
    form: {
      email: null,
      password: null
    },
    sending: false,
    lastUser: null,
    showNavigation: false
  }),
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(3)
      }
    }
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        };
      }
    },
    clearPassword() {
      this.$v.$reset();
      this.form.password = null;
    },
    async userLogin() {
      this.sending = true;
      await auth.login(this, this.form, '/panel/ryt');
      this.sending = false;
      this.clearPassword();
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.userLogin();
      }
    }
  },
  async created() {
    this.authenticated = await auth.checkAuth();
    if (this.authenticated) {
      this.$router.push('/panel/ryt');
    }
  }
};
</script>

<style lang="scss" scoped>
  .page-container {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .md-content {
      flex: 1;
      display: flex;
      justify-content: center;
      flex-direction: column;
      background-color: lightgrey;

      .md-card {
        margin: auto;
      }
    }

    form {
      margin: auto;
      width: 100%;
    }
  }
  .md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }
</style>
