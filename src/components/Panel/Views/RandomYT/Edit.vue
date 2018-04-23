<template>
  <div class="page-container">
    <form
      novalidate
      class="md-layout"
      @submit.prevent="validate()"
      @change="changed()">
      <md-card class="md-layout-item md-with-hover md-size-75 md-small-size-100">

        <md-card-header>
          <div class="md-title">Editing video {{ form.videoId }}</div>
        </md-card-header>

        <md-card-content>
          <md-field :class="getValidationClass('friendlyName')">
            <label for="videoName">Video Name</label>
            <md-input
              type="text"
              name="friendlyName"
              id="friendlyName"
              v-model="form.friendlyName"
              :disabled="loading" />
            <span
              class="md-error"
              v-if="!$v.form.friendlyName.required">Video name is required</span>
          </md-field>
          <md-field :class="getValidationClass('videoId')">
            <label for="videoId">Video ID</label>
            <md-input
              type="text"
              name="videoId"
              id="videoId"
              v-model="form.videoId"
              :disabled="loading" />
            <span
              class="md-error"
              v-if="!$v.form.videoId.required">Video ID is required</span>
            <span
              class="md-error"
              v-else-if="!$v.form.videoId.minlength">Invalid video ID lenght</span>
            <span
              class="md-error"
              v-else-if="!$v.form.videoId.maxLength">Invalid video ID lenght</span>
          </md-field>
          <md-field :class="getValidationClass('start')">
            <label for="start">Video start</label>
            <md-input
              type="number"
              name="start"
              id="start"
              v-model="form.start"
              :disabled="loading" />
            <span
              class="md-error"
              v-if="!$v.form.start.min">Invalid video start time</span>
            <span
              class="md-error"
              v-else-if="!$v.form.start.max">Invalid video start time</span>
          </md-field>
          <md-field :class="getValidationClass('end')">
            <label for="start">Video end</label>
            <md-input
              type="number"
              name="end"
              id="end"
              v-model="form.end"
              :disabled="loading" />
            <span
              class="md-error"
              v-if="!$v.form.end.min">Invalid video end time</span>
            <span
              class="md-error"
              v-else-if="!$v.form.end.max">Invalid video end time</span>
          </md-field>
          <md-field :class="getValidationClass('likes')">
            <label for="start">Video likes</label>
            <md-input
              type="number"
              name="likes"
              id="likes"
              v-model="form.likes"
              :disabled="loading" />
            <span
              class="md-error"
              v-if="!$v.form.likes.min">Invalid video likes amount</span>
          </md-field>
          <md-field :class="getValidationClass('dislikes')">
            <label for="start">Video dislikes</label>
            <md-input
              type="number"
              name="dislikes"
              id="dislikes"
              v-model="form.stdislikesart"
              :disabled="loading" />
            <span
              class="md-error"
              v-if="!$v.form.dislikes.min">Invalid video dislikes amount</span>
          </md-field>
          <md-field :class="getValidationClass('reports')">
            <label for="start">Video reports</label>
            <md-input
              type="number"
              name="start"
              id="start"
              v-model="form.reports"
              :disabled="loading" />
            <span
              class="md-error"
              v-if="!$v.form.reports.min">Invalid video reports amount</span>
          </md-field>
        </md-card-content>

        <md-progress-bar
          md-mode="indeterminate"
          v-if="loading" />

        <md-card-actions>
          <md-button to="/panel/ryt">Cancel</md-button>
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
  minLength,
  maxLength,
  minValue,
  maxValue
} from 'vuelidate/lib/validators';

export default {
  mixins: [validationMixin],
  data() {
    return {
      form: {
        friendlyName: null,
        videoId: null,
        start: null,
        end: null,
        likes: null,
        dislikes: null,
        reports: null,
        disabled: null
      },
      videoOld: {},
      isChanged: false,
      loading: false,
      currentUser: ''
    };
  },
  validations: {
    form: {
      friendlyName: {
        required
      },
      videoId: {
        required,
        minLength: minLength(11),
        maxLength: maxLength(11)
      },
      start: {
        min: minValue(0),
        max: maxValue(6000)
      },
      end: {
        min: minValue(1),
        max: maxValue(6000)
      },
      likes: {
        min: minValue(0)
      },
      dislikes: {
        min: minValue(0)
      },
      reports: {
        min: minValue(0)
      }
    }
  },
  methods: {
    changed() {
      if (JSON.stringify(this.form) === this.videoOld) {
        this.isChanged = false;
      } else {
        this.isChanged = true;
      }
    },
    async edit() {
      if (this.isChanged) {
        this.loading = true;
        this.form.changedBy = this.currentUser.username;
        try {
          const response = await this.$http.put(`${this.apiEndpoint}/yrvs/id/${this.id}`, this.form, { headers: await auth.getAuthHeader() });
          if (response.status === 200) {
            this.$notify({
              'group': 'responses',
              'type': 'success',
              'animation-type': 'velocity',
              'title': 'RandomYT',
              'text': `Video with id \`${this.form.videoId}\`edited successfully`,
              'reverse': true
            });
            this.loading = false;
            this.$router.push('/panel/ryt');
          }
        } catch (e) {
          this.loading = false;
          this.$notify({
            'group': 'responses',
            'type': 'error',
            'animation-type': 'velocity',
            'title': 'RandomYT',
            'text': 'Error when editing video data',
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
    try {
      this.loading = true;
      this.currentUser = auth.getUser();
      const response = await this.$http.get(`${this.apiEndpoint}/yrvs/id/${this.id}`, { headers: await auth.getAuthHeader() });
      this.form = response.body;
      this.videoOld = JSON.stringify(this.form);
      this.loading = false;
    } catch (e) {
      this.loading = false;
      this.$notify({
        'group': 'responses',
        'type': 'error',
        'animation-type': 'velocity',
        'title': 'RandomYT',
        'text': 'Error when loading video data',
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


