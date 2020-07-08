<template>
  <v-row style="display:block" align="center" justify="center">
    <v-row v-for="(row, index) in rows" :key="index" align="center" justify="center">
      <v-col style="max-width:13%; padding:0">
        <v-select
          :id="row.id"
          v-model="row.field"
          :items="allFields"
          label="Choose field"
          item-text="Choose field"
          style="max-width:100%;"
          clearable
          required
        ></v-select>
      </v-col>
      <v-col style="max-width:10%;padding:0">
        <v-select
          :id="row.id"
          v-model="row.filter"
          :items="allFilters"
          label="Select filter"
          item-text="name"
          item-value="string"
          style="max-width:100%; margin-left: 4%"
          clearable
          required
        ></v-select>
      </v-col>
      <v-col style="max-width:18%;padding:0">
        <v-text-field
          :id="row.id"
          required
          placeholder="Enter search keyword..."
          style="max-width:100%; margin-left: 4%"
          v-model="row.keyWord"
        ></v-text-field>
      </v-col>
      <v-btn style="background:none; box-shadow:none" @click="removeRow(index)">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
    </v-row>
    <v-btn style="background:none; box-shadow:none" @click="addRow()">
      <v-icon>mdi-plus</v-icon>Add field
    </v-btn>
    <v-btn @click="search()">Search</v-btn>
  </v-row>
</template>

<script>
export default {
  props: ["allFields", "allFilters"],
  data: () => ({
    rowCounter: 0,
    rows: [
      {
        id: 0,
        field: null,
        filter: null,
        keyWord: null
      }
    ]
  }),
  methods: {
    addRow() {
      this.rows.push({
        id: ++this.rowCounter,
        field: null,
        filter: null,
        keyWord: null
      });
    },
    removeRow(index) {
      this.rows.splice(index, 1);
    },
    search() {
      this.$emit("clicked", this.rows);
      console.log(this.rows);
    }
  }
};
</script>