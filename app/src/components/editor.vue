<template>
  <textarea ref="editor"></textarea>
</template>
<script type="text/babel">
  import simplemde from 'simplemde'
  import '../../node_modules/simplemde/dist/simplemde.min.css'
  import { marked } from '../utils'

  function noop() {
  }

  export default {
    name: 'el-editor',
    props: {
      autofocus: {
        type: Boolean,
        default: false
      },
      value: {
        type: String,
        default: ''
      },
      toolbar: {
        type: Array,
        default: function () {
          return [
            'bold',
            'italic',
            'strikethrough',
            'heading',
            //'heading-smaller',
            //'heading-bigger',
            //'heading-2',
            //'heading-3',
            'code',
            'quote',
            'unordered-list',
            'ordered-list',
            'clean-block',
            'link',
            'image',
            'table',
            'horizontal-rule',
            'preview',
            'side-by-side',
            'fullscreen',
            //'guide',
          ]
        }
      },
      placeholder: {
        type: String,
        default: ''
      },
      uniqueId: {
        type: String,
        default: ''
      },
      onTyping: {
        type: Function,
        default: noop
      }
    },
    mounted() {
      let self = this

      this.mde = new simplemde({
        autofocus: this.autofocus,
        element: this.$refs.editor,
        toolbar: this.toolbar,
        status: false,
        placeholder: this.placeholder,
        indentWithTabs: true,
        autoDownloadFontAwesome: false,
        previewRender: function (plainText) {
          return marked(plainText)
        },
        autosave: {
          enabled: !!this.uniqueId,
          unique_id: this.uniqueId,
          delay: 5000,
        },
        spellChecker: false
      })

      this.mde.value(this.value)
      this.mde.codemirror.on('change', function () {
        self.handleTyping(self.mde.value())
      })
    },
    watch: {
      value(newVal) {
        this.mde.value(newVal)
        // this.mde.autoFormatRange(
        //   {
        //     line: 0,
        //     ch: 0
        //   },
        //   {
        //     line: this.mde.lineCount(),
        //     ch: this.mde.getTextArea().value.length
        //   }
        // )
      }
    },
    beforeDestroy() {
      this.mde.toTextArea()
    },
    methods: {
      handleTyping(value) {
        this.onTyping(value)
      }
    }
  }
</script>
<style lang="scss">
  .editor-toolbar {
    line-height: 1em !important;
    border: 1px solid #c0ccda !important;
    border-bottom: none !important;
    clear: both;
    background-color: #fff;

    &:before {
      margin-bottom: 5px !important;
    }

    &:after {
      margin-top: 5px !important;
    }

    &.fullscreen {
      top: 60px !important;
      border-radius: 0;
      border: none;
    }

    a {
      &.active, &:hover {
        color: #20a0ff !important;
        background: transparent !important;
        border-color: transparent !important;
      }
      &:focus {
        outline: none;
      }
    }
  }
  .CodeMirror,
  .CodeMirror-scroll {
    min-height: 100px !important;
  }
  .CodeMirror-fullscreen,
  .editor-preview-side {
    top: 110px !important;
  }
  .CodeMirror {
    border-color: #c0ccda !important;

    .CodeMirror-code {
      .cm-url {
        color: #20a0ff !important;
      }
    }
  }
  .editor-preview {
    a {
      color: #20a0ff
    }
  }
</style>
