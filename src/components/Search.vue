<template>
  <v-row class="mainRow" align="center" justify="center">
    <v-row v-for="(row, index) in rows" :key="index" align="center" justify="center">
      <v-col class="fieldCol">
        <v-select
          id="row.id"
          v-model="row.field"
          :items="allFields"
          label="Choose field"
          item-text="Choose field"
          clearable
          required
        ></v-select>
      </v-col>
      <v-col class="filterCol">
        <v-select
          id="row.id"
          v-model="row.filter"
          :items="allFilters"
          label="Select filter"
          item-text="name"
          item-value="string"
          clearable
          required
        ></v-select>
      </v-col>
      <v-col class="fieldCol">
        <v-text-field
          id="row.id"
          required
          clearable
          placeholder="Enter search keyword..."
          v-model="row.keyWord"
          @keyup.enter="search()"
        ></v-text-field>
      </v-col>
      <v-btn class="buttons" @click="removeRow(index)">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
    </v-row>
    <v-btn class="buttons" @click="addRow()">
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

    //Adds new search row
    addRow() {
      this.rows.push({
        id: ++this.rowCounter,
        field: null,
        filter: null,
        keyWord: null
      });
    },
    
    //Removes search row
    removeRow(index) {
      this.rows.splice(index, 1);
    },

    //Emits search info to Homepage functions
    search() {
      this.$emit("clicked", this.rows);
    }
  }
};
</script>

<style scoped lang="scss">

.mainRow {
  display: block;
}
.fieldCol {
  max-width: 15%;
  padding: 0;
  v-text-field {
    max-width: 100%;
    margin-left: 4%;
  }
  v-select {
    max-width: 100%;
  }
}
.filterCol {
  max-width: 12%;
  padding: 0;
  v-select {
    max-width: 100%;
    margin-left: 4%;
  }
}
.buttons {
  background: none !important; 
  box-shadow: none !important;
}

</style>