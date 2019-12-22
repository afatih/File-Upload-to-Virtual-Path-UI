<template>
  <div class="file">
    <form @submit.prevent="onSubmit" enctype="multipart/form-data">
      <div class="fields">
        <label for="file">Upload File</label>
        <input class="form-control" required type="file" ref="file" id="file" @change="onSelect" />
      </div>
      <div class="fields">
        <label for="path">Upload Path</label>
        <input
          class="form-control"
          required
          type="text"
          v-model="path"
          placeholder="Folder1/User/Soft/"
          id="path"
        />
        <div class="pathMessage">{{pathMessage}}</div>
      </div>
      <div class="fields">
        <button type="submit" class="btn btn-info">Submit</button>
      </div>
    </form>
    <notifications group="foo" />
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "FileUpload",

  data() {
    return {
      file: "",
      path: "",
      pathMessage: ""
    };
  },
  methods: {
    onSelect() {
      const file = this.$refs.file.files[0];
      this.file = file;
    },
    onSubmit() {
      const formData = new FormData();
      if (!/\/$/.test(this.path)) {
        this.pathMessage =
          "*Seçilen dosyanın yükleneceği yol '/' simgesi ile bitmeli";
        return;
      }
      if (/^\//.test(this.path)) {
        this.pathMessage =
          "*Seçilen dosyanın yükleneceği yol '/' simgesi ile başlamamalı";
        return;
      }
      formData.append("file", this.file);
      formData.append("path", this.path);

      axios
        .post("http://localhost:2525/api/folder", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            path: this.path
          }
        })
        .then(() => {
          this.refreshNodes();
          this.pathMessage = "";
          this.path = "";
          const inputFile = this.$refs.file;
          inputFile.type = "text";
          inputFile.type = "file";
          this.$notify({
            group: "foo",
            title: "Success",
            type: "success",
            text: "file uploaded successfully"
          });
        })
        .catch(e => {
          this.$notify({
            group: "foo",
            title: "Error",
            type: "error",
            text: "Error Message=" + e
          });
        });
    },
    refreshNodes: function() {
      this.$emit("nodesChanged");
    }
  }
};
</script>


<style scoped>
.fields > :first-child {
  margin-top: 20px;
}
.pathMessage {
  color: red;
}
</style>