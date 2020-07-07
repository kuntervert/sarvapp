<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4"></v-col>
      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">Specimen search engine</h2>
      </v-col>
      <v-col align="center" justify="center" class="mb-5" cols="12">
        <v-row align="center" justify="center">
          <v-select
            v-model="selectedField"
            :items="allFields"
            label="Choose field"
            item-text="Choose field"
            style="max-width:10%;"
            clearable
          ></v-select>
          <v-select
            v-model="selectedFilter"
            :items="allFilters"
            label="Select filter"
            item-text="name"
            item-value="string"
            style="max-width:10%; margin-left: 1%"
            clearable
          ></v-select>
          <v-text-field
            placeholder="Enter search keyword..."
            style="max-width:15%; margin-left: 1%"
            v-model="keyWord"
          >kirj sii</v-text-field>
        </v-row>
        <v-btn @click="search()">Otsi</v-btn>
        <v-pagination :length="totalPages" total-visible="8" v-model="page" @input="pageChange"></v-pagination>
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
export default {
  name: "HelloWorld",

  data: () => ({
    specimens: null,
    totalPages: null,
    page: 1,
    allFilters: null,
    allFields: null,
    selectedFilter: null,
    selectedField: null,
    keyWord: null
  }),
  mounted() {
    this.startingData();
  },
  methods: {
    async search() {
      let searchResults = null;
      let filter = this.selectedFilter;

      let field = this.selectedField;
      let key = this.keyWord;
      if (typeof key === "number") {
        filter = "i" + filter;
      }
      console.log(filter);
      console.log(key);
      if (filter && field && key) {
        await axios
          .get(
            `https://api.geocollections.info/specimen/?${field}__${filter}=${key}`
          )
          .then(response => {
            searchResults = response.data;
          });
      } else {
        return;
      }
      console.log(searchResults);
      this.totalPages = Math.ceil(searchResults.count / 50);
      this.specimens = searchResults.results;
    },
    async startingData() {
      let firstData = null;
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
      await axios
        .get(
          `https://api.geocollections.info/specimen/?paginate_by=50&page=${page}`
        )
        .then(response => {
          data = response.data;
        });
      console.log(data);
      this.specimens = data.results;
    }
  }
};
</script>
