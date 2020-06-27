<template>
  <div id="crawl-status">
    <h3>
      Status: {{ crawlStatus || 'Go Home You\'re Drunk!' }}
      <span v-if="crawlStatus && crawlStatus !== 'Not Started!'">
        <!-- // {{ allVotes }} votes to move! -->
      </span>
    </h3>
    <button
      v-if="crawlStatus === 'Not Started!'"
      @click="changeStatus"
    >
      Start Crawl!
    </button>
    <button
      v-else-if="crawlStatus"
      @click="changeStatus"
    >
      Move On!
    </button>
    <!-- <button
      v-if="!hasVoted && crawlStatus && crawlStatus !== 'Not Started!'"
      @click="postVote"
    >
      Vote to Move!
    </button> -->
    <br /><br />
    <Participants
      :crawlId="crawlId"
      :crawlStatus="crawlStatus"
    />
  </div>
</template>

<script>
import axios from 'axios';
import Participants from './Participants.vue';

export default {
  name: 'CrawlStatus',
  components: {
    Participants,
  },
  props: {
    crawlId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      crawlStatus: 'Loading',
      // hasVoted: false,
      // allVotes: 0,
      user: this.$store.appUser,
    };
  },
  beforeMount() {
    this.getStatus();
    // this.getVote();
    // this.getAllVotes();
  },
  methods: {
    changeStatus() {
      return axios.post(`/api/status/change/${this.crawlId}`)
        .then(({ data }) => {
          console.log('changing status to:', data);
          this.crawlStatus = data;
        })
        .catch(err => console.error(err));
    },
    getStatus() {
      return axios.get(`/api/status/${this.crawlId}`)
        .then(({ data }) => {
          console.log('got status:', data);
          this.crawlStatus = data;
        })
        .catch(err => console.error(err));
    },
    // getVote() {
    //   if (this.user.Id) {
    //     return axios.get(`api/status/vote/${this.user.Id}/${this.crawlId}`)
    //       .then((result) => {
    //         console.log('getVotes result', result);
    //         // this.hasVoted = result;
    //       })
    //       .catch(err => console.error(err));
    //   }
    // },

    // getAllVotes() {
    //   return axios.get(`api/status/votes/${this.crawlId}`)
    //     .then((result) => {
    //       console.log('getAllVotes result', result);
    //       // this.allVotes = result;
    //     })
    //     .catch(err => console.error(err));
    // },

    // postVote() {
    //   if (this.user.Id) {
    //     return axios.post(`api/status/vote/${this.user.Id}`)
    //       .then((result) => {
    //         console.log('postVote result', result);
    //         // if the result implies you need to changeStatus, call that method here.
    //         // if (result) {
    //         //   this.changeStatus();
    //         //   this.allVotes = 0;
    //         // } else {
    //         //   this.allVotes += 1;
    //         //   this.hasVoted = false;
    //         // }
    //       })
    //       .catch(err => console.error(err));
    //   }
    // },
  },
};
</script>

<style scoped>
</style>
