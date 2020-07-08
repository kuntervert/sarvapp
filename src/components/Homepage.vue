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
        <v-btn v-if="searchView" @click="startingData(); searchView = false">Clear</v-btn>
        <h1 style="padding-top:5%" v-if="!specimens">No results found</h1>
        <v-simple-table v-if="specimens" style="max-width:40%">
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
                @click="$router.push({name: 'DetailView', params: {id: specimen.id}})"
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
    latestApi: null
  }),
  mounted() {
    this.startingData();
  },
  methods: {
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
      await axios.get(searchApi).then(response => {
        searchResults = response.data;
      });
      this.latestApi = searchApi;
      this.searchView = true;
      this.totalPages = Math.ceil(searchResults.count / 50);
      this.specimens = searchResults.results;
    },
    async startingData() {
      let firstData = null;
      this.page = 1;
      await axios
        .get("https://api.geocollections.info/specimen/?paginate_by=50&page=1")
        .then(response => {
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
