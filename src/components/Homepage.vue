<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4"></v-col>
      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">Specimen search engine</h2>
      </v-col>
      <Search @clicked="search" :allFields="allFields" :allFilters="allFilters" />

      <v-col align="center" justify="center" class="mb-5" cols="12">
        <v-pagination :length="totalPages" total-visible="8" v-model="page" @input="pageChange"></v-pagination>
        <v-btn v-if="searchView" @click="clear(); searchView = false">Clear</v-btn>
        <h1 class="loadingH1" v-if="!specimens">No results found</h1>
        <h1 class="loadingH1" v-if="loading">Loading...</h1>
        <v-simple-table dense v-if="specimens && !loading" class="table">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Specimen id</th>
                <th class="text-left">Locality latitude</th>
                <th class="text-left">Locality longitude</th>
                <th class="text-left">Locality EN</th>
              </tr>
            </thead>
            <tbody>
              <tr
                @click="$router.push({name: 'DetailView', params: {id: specimen.id, lastApi: latestApi}})"
                v-for="specimen in specimens"
                :key="specimen.id"
              >
                <td>{{specimen.specimen_id}}</td>
                <td>{{specimen.locality__latitude}}</td>
                <td>{{specimen.locality__longitude}}</td>
                <td>{{specimen.locality__locality_en}}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-pagination v-if="!loading" :length="totalPages" total-visible="8" v-model="page" @input="pageChange"></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import Search from "@/components/Search";
export default {
  name: "HelloWorld",
  components: {
    Search
  },
  data: () => ({
    specimens: null,
    totalPages: null,
    page: 1,
    allFilters: null,
    allFields: null,
    searchView: false,
    latestApi: null,
    loading: false
  }),
  mounted() {
    this.startingData();
  },
  methods: {

    //Resets to main page
    async clear() {
      let firstData = null;
      let startingApi =
        "https://api.geocollections.info/specimen/?paginate_by=50&page=1";
      await axios.get(startingApi).then(response => {
        firstData = response.data;
      });
      this.latestApi = startingApi
      this.specimens = firstData.results;
      this.totalPages = Math.ceil(firstData.count / 50);
      this.searchView = false
      this.page = 1
    },

    //Search function
    async search(rows) {
      let searchResults = null;
      let check = true;
      let searchApi = `https://api.geocollections.info/specimen/?paginate_by=50`;
      rows.forEach(element => {
        if (
          element.field === null ||
          element.filter === null ||
          element.keyWord === null ||
          element.keyWord === ""
        ) {
          check = false;
        } else {
          searchApi =
            searchApi +
            `&${element.field}__${element.filter}=${element.keyWord}`;
        }
      });
      if (check === false || rows.length < 1) {
        alert("Please fill all fields");
        return;
      }
      this.loading = true;
      await axios.get(searchApi).then(response => {
        searchResults = response.data;
      });
      this.loading = false; 
      this.latestApi = searchApi;
      this.searchView = true;
      this.totalPages = Math.ceil(searchResults.count / 50);
      this.specimens = searchResults.results;
    },
    
    //Loads in first data
    //Sets fields and filters
    async startingData() {
      let firstData = null;
      this.page = 1;
      console.log(this.$route.params.lastApi);
      let startingApi =
        "https://api.geocollections.info/specimen/?paginate_by=50&page=1";
      if (this.$route.params.lastApi) {
        this.searchView = true;
        startingApi = this.$route.params.lastApi;
        this.latestApi = this.$route.params.lastApi;
      }
      await axios.get(startingApi).then(response => {
        firstData = response.data;
      });
      this.specimens = firstData.results;
      this.totalPages = Math.ceil(firstData.count / 50);
      this.allFields = Object.keys(this.specimens[0]);
      this.allFilters = [
        {
          id: 1,
          name: "exact",
          string: "exact"
        },
        {
          id: 2,
          name: "contains",
          string: "contains"
        },
        {
          id: 3,
          name: "starts with",
          string: "startswith"
        },
        {
          id: 4,
          name: "ends with",
          string: "endswith"
        }
      ];
    },

    //Pagination function
    async pageChange(page) {
      let data = null;
      if (this.searchView) {
        await axios.get(this.latestApi + `&page=${page}`).then(response => {
          data = response.data;
        });
      } else {
        await axios
          .get(
            `https://api.geocollections.info/specimen/?paginate_by=50&page=${page}`
          )
          .then(response => {
            data = response.data;
          });
      }
      this.specimens = data.results;
    }
  }
};
</script>

<style scoped lang="scss">

.loadingH1 {
  padding-top:5%;
}
.table {
  max-width:40%;
}

</style>
