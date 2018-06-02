<template>
  <div class="page-container">
    <form
      novalidate
      class="md-layout"
      @submit.prevent="validate()">
      <md-card class="md-layout-item md-with-hover md-size-80 md-small-size-100">

        <md-card-header>
          <div class="md-title">Adding video</div>
        </md-card-header>

        <md-card-content>
          <md-field :class="getValidationClass('videoId')">
            <label for="videoId">Video ID</label>
            <md-input
              type="text"
              name="videoId"
              id="videoId"
              maxlength="11"
              v-model="form.videoId"
              @input="getVideo($event)"
              :disabled="adding" />
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
          <md-field :class="getValidationClass('friendlyName')">
            <label for="friendlyName">Video Name</label>
            <md-input
              type="text"
              name="friendlyName"
              id="friendlyName"
              v-model="form.friendlyName"
              :disabled="adding || !loaded" />
            <span
              class="md-error"
              v-if="!$v.form.friendlyName.required">Video name is required</span>
          </md-field>
          <md-field :class="getValidationClass('start')">
            <label for="start">Video start</label>
            <md-input
              type="number"
              name="start"
              id="start"
              min="0"
              v-model="form.start"
              :disabled="adding || !loaded" />
            <span
              class="md-error"
              v-if="!$v.form.start.min">Invalid video start time</span>
            <span
              class="md-error"
              v-else-if="!$v.form.start.max">Invalid video start time</span>
          </md-field>
          <md-field :class="getValidationClass('end')">
            <label for="end">Video end</label>
            <md-input
              type="number"
              name="end"
              id="end"
              v-model="form.end"
              :disabled="adding || !loaded" />
            <span
              class="md-error"
              v-if="!$v.form.end.min">Invalid video end time</span>
            <span
              class="md-error"
              v-else-if="!$v.form.end.max">Invalid video end time</span>
          </md-field>
          <md-field :class="getValidationClass('likes')">
            <label for="likes">Video likes</label>
            <md-input
              type="number"
              name="likes"
              id="likes"
              v-model="form.likes"
              :disabled="adding || !loaded" />
            <span
              class="md-error"
              v-if="!$v.form.likes.min">Invalid video likes amount</span>
          </md-field>
          <md-field :class="getValidationClass('dislikes')">
            <label for="dislikes">Video dislikes</label>
            <md-input
              type="number"
              name="dislikes"
              id="dislikes"
              v-model="form.dislikes"
              :disabled="adding || !loaded" />
            <span
              class="md-error"
              v-if="!$v.form.dislikes.min">Invalid video dislikes amount</span>
          </md-field>
          <md-field :class="getValidationClass('reports')">
            <label for="reports">Video reports</label>
            <md-input
              type="number"
              name="reports"
              id="reports"
              v-model="form.reports"
              :disabled="adding || !loaded" />
            <span
              class="md-error"
              v-if="!$v.form.reports.min">Invalid video reports amount</span>
          </md-field>
        </md-card-content>
        <md-progress-bar
          md-mode="indeterminate"
          v-if="adding || fetchingVideo" />
        <md-card-actions>
          <md-button to="/panel/ryt">Cancel</md-button>
          <md-button
            type="submit"
            class="md-primary"
            :disabled="adding || !loaded">Add</md-button>
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
      video: null, // Saves response about video
      inputTimer: null, // Timer that launches when user finishes input videoID
      loaded: false, // True when video information retrieved
      fetchingVideo: false, // True when video information loading
      adding: false, // True when awaiting response from api
      currentUser: null
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
    async add() {
      this.adding = true;
      this.form.changedBy = this.currentUser.username;
      try {
        const response = await this.$http.post(`${this.apiEndpoint}/yrvs`, this.form, { headers: await auth.getAuthHeader() });
        if (response.status === 200) {
          this.$notify({
            'group': 'responses',
            'type': 'success',
            'animation-type': 'velocity',
            'title': 'RandomYT',
            'text': 'Video successfully added',
            'reverse': true
          });
          this.adding = false;
          this.$router.push('/panel/ryt');
        }
      } catch (e) {
        this.adding = false;
        switch (e.status) {
        case 400:
          this.$notify({
            'group': 'responses',
            'type': 'error',
            'animation-type': 'velocity',
            'title': 'RandomYT',
            'text': 'Error when adding a video',
            'reverse': true
          });
          break;
        case 401:
          this.$notify({
            'group': 'responses',
            'type': 'error',
            'animation-type': 'velocity',
            'title': 'RandomYT',
            'text': `Video with id \`${this.video.videoId}\` already existing`,
            'reverse': true
          });
          break;
        default:
          this.$notify({
            'group': 'responses',
            'type': 'error',
            'animation-type': 'velocity',
            'title': 'RandomYT',
            'text': 'Undefined error',
            'reverse': true
          });
          break;
        }
      }
    },
    async getVideo(id) {
      if (this.loaded) {
        this.loaded = false;
      }
      if (this.inputTimer) {
        clearTimeout(this.inputTimer);
        this.inputTimer = null;
      }
      this.inputTimer = await setTimeout(async () => {
        this.fetchingVideo = true;
        const response = await this.$http.get(`${this.gApiEndpoint}?id=${id}&key=${this.gApiKey}&part=snippet`);
        if (response.status === 200) {
          if (response.body.items[0]) {
            this.video = response.body;
            this.form.friendlyName = this.video.items[0].snippet.title;
            this.form.likes = 0;
            this.form.dislikes = 0;
            this.form.reports = 0;
            this.loaded = true;
            setTimeout(() => {
              this.fetchingVideo = false;
            }, 300);
            return true;
          }
        }
        this.$notify({
          'group': 'responses',
          'type': 'error',
          'animation-type': 'velocity',
          'title': 'RandomYT',
          'text': 'Cant load this video, sorry',
          'reverse': true
        });
        setTimeout(() => {
          this.fetchingVideo = false;
        }, 300);
        return false;
      }, 800);
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

