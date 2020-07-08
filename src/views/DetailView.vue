<template>
  <v-col class="text-left">
    <v-btn @click="$router.push({name: 'Homepage', params: {lastApi: lastApi}})">
      <v-icon>mdi-arrow-left</v-icon>Return
    </v-btn>
    <v-col style="max-width:50%" class="mb-5" cols="12">
      <v-simple-table v-if="specimens">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Specimen properties</th>
              <th class="text-left">Values</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(value, key) in specimens[0]" :key="value">
              <td>{{key}}</td>
              <td>{{value}}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
  </v-col>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    specimens: null,
    lastApi: null,
  }),
  mounted() {
    this.getObjectData();
  },
  methods: {

    //Gets chosen object data
    async getObjectData() {
      let data = null;
      this.lastApi = this.$route.params.lastApi;
      let objectId = this.$route.params.id;
      await axios
        .get(`https://api.geocollections.info/specimen/?id__iexact=${objectId}`)
        .then(response => {
          data = response.data;
        });
      this.specimens = data.results;
    }
  }
};
</script>
