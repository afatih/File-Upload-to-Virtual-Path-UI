<template>
  <div>
    <tree-view :tree="tree"></tree-view>
  </div>
</template>

<script>
import TreeView from "../treeview.vue";

export default {
  components: {
    "tree-view": TreeView
  },
  name: "treeviewcustom",
  data() {
    return {
      tree: []
    };
  },
  methods: {
    refreshNodes: function() {
      this.$http
        .get("http://localhost:2525/api/nodes")
        .then(function(data) {
          this.tree = JSON.parse(JSON.stringify(data.body));
        })
        .catch(e => {
          this.$notify({
            group: "foo",
            title: "Error",
            type: "error",
            text: "Error Message=" + e
          });
        });
    }
  },
  mounted() {
    this.refreshNodes();
  }
};
</script>
