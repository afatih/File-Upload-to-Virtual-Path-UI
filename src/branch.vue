<template lang="pug">
  ul
    li
      

      .branch(@click="createNewNode", :class="{ link: (nodes.length > 0) }")
        template(v-if="nodes.length > 0")
          template(v-if="open")
            fa(:icon="opened").minus-square
          template(v-else)
            fa(:icon="closed").plus-square
          span {{ text }}
        template(v-else-if="link && link.value")
          router-link(:to="{ [link.key]: link.value }", v-if="link.type === 'router-link'").value
            fa(:icon="defaultIcon")
            | {{ text }}
          a(:href="link.value", target="_blank" v-else).value
            fa(:icon="defaultIcon")
            | {{ text }}
          span(@click="deleteFolder(link.type)",  v-show="editable").edit Delete
        template(v-else)
          span {{ text }}
      draggable(:list="nodes", :group="{ name: 'g1' }", v-if="draggable")
        branch(
          v-for="(t, i) in nodes",
          :nodes.sync="t.nodes",
          :text="t.text",
          :type="t.type",
          :link="t.link",
          :class="{ open, first: i === 0 && !checkLast(i), last: checkLast(i) }",
          v-if="nodes",
          :closed="closed",
          :opened="opened",
          :defaultIcon="defaultIcon",
          :editable="editable",
          :key="i"
        ).node
      template(v-else)
        branch(
          v-for="(t, i) in nodes",
          :nodes.sync="t.nodes",
          :text="t.text",
          :type="t.type",
          :link="t.link",
          :class="{ open, first: i === 0 && !checkLast(i), last: checkLast(i) }",
          v-if="nodes",
          :closed="closed",
          :opened="opened",
          :defaultIcon="defaultIcon",
          :editable="editable",
          :key="i"
        ).node
</template>

<script>
  import draggable from 'vuedraggable'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {bus} from './main'

  export default {
    name: 'Branch',
    props: {
      text: {
        type: String,
        required: true,
        default: () => ''
      },
      nodes: {
        type: Array,
        default: () => []
      },
      type: {
        type: String,
        default: () => ''
      },
      link: {
        type: Object,
        default: () => ({})
      },
      closed: {
        // type: String | Object | Array
        type: String 
      },
      opened: {
        // type: String | Object | Array
        type: String 
      },
      defaultIcon: {
        // type: String | Object | Array
        type: String 
      },
      editable: {
        type: Boolean,
        default: () => true
      },
      draggable: {
        type: Boolean,
        default: () => false
      }
    },
    data: () => ({
      open: false,
      clicks: 0,
      timer: null,
      newNode: {
        text: 'Google',
        link: {
          type: 'link',
          key: '',
          value: 'https://www.google.com'
        }
      },
      creating: false,
      editing: false,
      urlRegex: new RegExp(/^(https?:\/\/)?(www\.|[a-z\d]+\.)?[a-z]+(\.[a-z]{2,3}|:\d{2,5})(\.[a-z]{2,3})?(\/([\w\d]+)?)*((\?|&)[\w\d]+=[\w\d]+)*/)
    }),
    methods: {
      createNewNode () {
        if (this.editable) {
          this.clicks++
          if (this.clicks === 1) {
            const app = this
            this.timer = setTimeout(() => {
              app.toggle()
              app.clicks = 0
            }, 250);
          } else {
            clearTimeout(this.timer)
            this.clicks = 0
            this.creating = true
          }
        } else {
          this.toggle
        }
      },
      cancel () {
        this.creating = false
        this.newNode = {
          text: 'Google',
          link: {
            type: 'link',
            key: '',
            value: 'https://www.google.com'
          }
        }
      },
      edit () {
        this.editing = false
        this.$emit('nodes', this.nodes)
      },
      save () {
        if (this.newNode.link.type === 'link')
          delete this.newNode.link.key
        this.nodes.push(this.newNode)
        this.creating = false
        this.newNode = {
          text: 'Google',
          type: 'link',
          value: 'https://www.google.com'
        }
        this.$emit('nodes', this.nodes)
      },
      toggle () {
        this.open = !this.open
      },
      checkLast (i) {
        return (i + 1) === this.nodes.length
      },
      deleteFolder(id){
          bus.$emit('deleteBranch',id)
      }
    },
    components: {
      draggable,
      "fa":FontAwesomeIcon
    }
  }
</script>

<style lang="sass" scoped>
svg
  margin-right: .5em

#tree .treeview

ul
  font-weight: bold
  list-style: none
  margin: 0
  padding-left: 20px
  white-space: nowrap

.branch
  // background-color: #36404a
  color: white
  cursor: pointer
  display: inline-flex
  align-items: center
  width: 100%
  text-transform: initial

.minus-square
  color: orange

.plus-square
  color: lightgreen

.value
  color: lightblue

.node
  height: 0
  opacity: 0
  visibility: hidden
  transition: all .5s ease-in-out
  text-transform: capitalize

  &.open
    height: 100%
    opacity: 1
    visibility: visible

.modal-mask
  background-color: rgba(0, 0, 0, .7)
  cursor: pointer
  display: flex
  justify-content: center
  align-items: center
  position: fixed
  z-index: 9998
  top: 0
  left: 0
  height: 100%
  width: 100%
  transition: opacity .3s ease;

  .modal-container
    background-color: white
    border-radius: 2px
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33)
    cursor: default
    font-family: Helvetica, Arial, sans-serif
    margin: 40px auto 0
    padding: 20px 30px
    transition: all .3s ease

    .modal-content
      border-radius: 10px
      color: black
      margin: 1em
      padding: 1em
      width: 800px

      h1
        margin: 0

      form
        display: flex
        flex-wrap: wrap
        justify-content: flex-end
        width: 100%
        input
          border: 1px solid rgba(0, 0, 0, .5)
          border-radius: 5px
          font-size: 16px
          font-weight: bold
          margin: 1em 0
          padding: .2em .5em
          height: 30px
          width: 100%
        button
          background: none
          border-radius: 5px
          cursor: pointer
          font-size: 16px
          font-weight: bold
          height: 30px
          width: 80px
          transition: all .3s ease-in-out

          &.save
            border: 3px solid #3498db
            color: #3498db
            margin-left: 1em
            &:hover
              background-color: #3498db
          
          &.cancel
            border: 3px solid #f39c12
            color: #f39c12
            &:hover
              background-color: #f39c12

          &:hover
            color: white

.modal-enter, .modal-leave-active
  opacity: 0

.modal-enter .modal-container, .modal-leave-active .modal-container
  transform: scale(1.1)

.edit
  color: orange
  margin-left: auto
  margin-right: 1em

  &:hover
    text-decoration: underline
</style>
