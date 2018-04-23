<template>
  <div class="page-container">
    <form
      novalidate
      class="md-layout"
      @submit.prevent="validate()">
      <md-card class="md-layout-item md-with-hover md-size-75 md-small-size-100">

        <md-card-header>
          <div class="md-title">Adding user</div>
        </md-card-header>

        <md-card-content>
          <md-field :class="getValidationClass('name')">
            <label for="name">User Name</label>
            <md-input
              type="text"
              name="name"
              id="name"
              v-model="form.name"
              :disabled="loading" />
            <span
              class="md-error"
              v-if="!$v.form.name.required">User name is required</span>
            <span
              class="md-error"
              v-else-if="!$v.form.name.minLength">User name is too short</span>
          </md-field>
          <md-field :class="getValidationClass('username')">
            <label for="username">Username</label>
            <md-input
              type="text"
              name="username"
              id="username"
              v-model="form.username"
              :disabled="loading" />
            <span
              class="md-error"
              v-if="!$v.form.username.required">Username is required</span>
            <span
              class="md-error"
              v-else-if="!$v.form.username.minLength">Username is too short</span>
          </md-field>
          <md-field :class="getValidationClass('email')">
            <label for="email">Email</label>
            <md-input
              type="email"
              name="email"
              id="email"
              v-model="form.email"
              :disabled="loading" />
            <span
              class="md-error"
              v-if="!$v.form.email.required">Email is required</span>
            <span
              class="md-error"
              v-else-if="!$v.form.email.email">Please input valid email</span>
          </md-field>
          <md-field :class="getValidationClass('roles')">
            <label for="roles">Roles (IN DEV)</label>
            <md-input
              type="text"
              name="roles"
              id="roles"
              v-model="form.end"
              :disabled="true" />
          </md-field>
          <md-field :class="getValidationClass('password')">
            <label for="password">Password</label>
            <md-input
              type="password"
              name="password"
              id="password"
              v-model="form.password"
              :disabled="loading" />
            <span
              class="md-error"
              v-if="!$v.form.password.required">Password is required</span>
            <span
              class="md-error"
              v-else-if="!$v.form.password.minLength">Password is too short</span>
          </md-field>
          <md-field :class="getValidationClass('repeatPassword')">
            <label for="repeatPassword">Repeat password</label>
            <md-input
              type="password"
              name="repeatPassword"
              id="repeatPassword"
              v-model="form.repeatPassword"
              :disabled="loading" />
            <span
              class="md-error"
              v-if="!$v.form.repeatPassword.required">Password repeat is required</span>
            <span
              class="md-error"
              v-else-if="!$v.form.repeatPassword.minLength">Password repeat is too short</span>
            <span
              class="md-error"
              v-else-if="!$v.form.repeatPassword.sameAs">Password repeat is not equal to password</span>
          </md-field>
        </md-card-content>

        <md-progress-bar
          md-mode="indeterminate"
          v-if="loading" />

        <md-card-actions>
          <md-button to="/panel/users">Cancel</md-button>
          <md-button
            type="submit"
            class="md-primary"
            :disabled="loading">Add</md-button>
        </md-card-actions>
      </md-card>
    </form>
  </div>
</template>

<script>
import auth from '../../../../auth';
import { validationMixin } from 'vuelidate';
import {
  required,
  email,
  minLength,
  sameAs
} from 'vuelidate/lib/validators';

export default {
  mixins: [validationMixin],
  data() {
    return {
      form: {
        name: null,
        username: null,
        email: null,
        roles: null,
        password: null,
        repeatPassword: null
      },
      currentUser: null,
      loading: false
    };
  },
  validations: {
    form: {
      name: {
        required,
        minLength: minLength(3)
      },
      username: {
        required,
        minLength: minLength(5)
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(8)
      },
      repeatPassword: {
        required,
        minLength: minLength(8),
        sameAs: sameAs('password')
      }
    }
  },
  methods: {
    async add() {
      this.loading = true;
      this.form.changedBy = this.currentUser.username;
      this.$v.$reset();
      this.form.repeatPassword = null;
      try {
        const response = await this.$http.post(`${this.apiEndpoint}/users`, this.form, { headers: await auth.getAuthHeader() });
        if (response.status === 200) {
          this.loading = false;
          this.$notify({
            'group': 'responses',
            'type': 'success',
            'animation-type': 'velocity',
            'title': 'Users',
            'text': 'User added successfully',
            'reverse': true
          });
          this.$router.push('/panel/users');
        }
      } catch (e) {
        this.loading = false;
        switch (e.status) {
        case 400:
          this.$notify({
            'group': 'responses',
            'type': 'error',
            'animation-type': 'velocity',
            'title': 'Users',
            'text': 'Error when adding a user',
            'reverse': true
          });
          break;
        case 401:
          this.$notify({
            'group': 'responses',
            'type': 'error',
            'animation-type': 'velocity',
            'title': 'Users',
            'text': 'User already existing',
            'reverse': true
          });
          break;
        default:
          this.$notify({
            'group': 'responses',
            'type': 'error',
            'animation-type': 'velocity',
            'title': 'Users',
            'text': 'Undefined error',
            'reverse': true
          });
          break;
        }
      }
    },
    validate() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.add();
      }
    },
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        };
      }
    }
  },
  async created() {
    this.currentUser = await auth.getUser();
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }

  .md-card {
    margin: auto;
  }
}
</style>

