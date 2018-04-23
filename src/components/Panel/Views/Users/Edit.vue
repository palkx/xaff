<template>
  <div class="page-container">
    <form
      novalidate
      class="md-layout"
      @submit.prevent="validate()"
      @change="changed()">
      <md-card class="md-layout-item md-with-hover md-size-75 md-small-size-100">

        <md-card-header>
          <div class="md-title">Editing user {{ form.name ? form.name : form.username }}</div>
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
              @change="passwordChanged = true"
              type="password"
              name="password"
              id="password"
              v-model="form.password"
              :disabled="loading" />
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
            :disabled="loading || !isChanged">Edit</md-button>
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
  minLength
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
        password: null
      },
      userOld: {},
      isChanged: false,
      passwordChanged: false,
      currentUser: '',
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
      }
    }
  },
  methods: {
    changed() {
      if (!(JSON.stringify(this.form) === this.userOld) || this.form.password) {
        this.isChanged = true;
      } else {
        this.isChanged = false;
      }
    },
    async edit() {
      if (this.isChanged) {
        this.loading = true;
        this.form.changedBy = this.currentUser.username;
        try {
          const response = await this.$http.put(`${this.apiEndpoint}/users/id/${this.id}`, this.form, { headers: await auth.getAuthHeader() });
          if (response.status === 200) {
            this.$notify({
              'group': 'responses',
              'type': 'success',
              'animation-type': 'velocity',
              'title': 'Users',
              'text': 'User edited successfully',
              'reverse': true
            });
            this.loading = false;
            if ((this.form._id === this.id) && this.passwordChanged) {
              auth.logout();
              this.$router.push('/');
            } else {
              this.$router.push('/panel/users');
            }
          }
        } catch (e) {
          this.loading = false;
          this.$notify({
            'group': 'responses',
            'type': 'error',
            'animation-type': 'velocity',
            'title': 'Users',
            'text': 'Error when editing user data',
            'reverse': true
          });
        }
      }
    },
    validate() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.edit();
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
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  async created() {
    this.loading = true;
    this.currentUser = auth.getUser();
    try {
      const response = await this.$http.get(`${this.apiEndpoint}/users/id/${this.id}`, { headers: await auth.getAuthHeader() });
      this.form = response.body;
      this.userOld = JSON.stringify(this.form);
      this.loading = false;
    } catch (e) {
      this.loading = false;
      this.$notify({
        'group': 'responses',
        'type': 'error',
        'animation-type': 'velocity',
        'title': 'Users',
        'text': 'Error when loading user data',
        'reverse': true
      });
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

