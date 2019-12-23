<template>
  <div id="app" >
    <div class="col-lg-8 col-md-7" style="float:left;margin-top:20px">
      <tree-view-custom ref="treeviewCustomComponent"></tree-view-custom>
    </div>
    <div class="col-lg-4 col-md-5" style="float:left">
      <file-upload @nodesChanged="onRefreshNode"></file-upload>
    </div>
    <notifications group="foo" />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import FileUpload from "./components/FileUpload.vue";
import TreeViewCustom from "./components/TreeViewCustom.vue";
import { bus } from "./main";
import axios from "axios";

export default {
  name: "app",
  components: {
    "file-upload": FileUpload,
    "tree-view-custom": TreeViewCustom
  },
  data() {
    return {
      tree: Array
    };
  },
  methods: {
    onRefreshNode: function() {
      this.$refs.treeviewCustomComponent.refreshNodes();
    }
  },
  mounted() {
    bus.$on("deleteBranch", data => {
      if (confirm('Are you sure you want to delete selected file?')) {
        axios
          .delete("http://localhost:2525/api/folder/" + data, { data: data })
          .then(() => {
            this.$notify({
              group: "foo",
              title: "Success",
              type: "success",
              text: "File deleted successfully"
            });
            this.$refs.treeviewCustomComponent.refreshNodes();
          })
          .catch(e => {
            this.$notify({
              group: "foo",
              title: "Error",
              type: "error",
              text: e
            });
          });
      }
    });
  }
};
</script>


<style scoped>
  #app>:first-child{
    float:left;
    margin-top:20px;
  }
  #app>:last-child{
    float:left
  }
</style>