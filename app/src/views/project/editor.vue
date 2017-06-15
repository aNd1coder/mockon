<template>
  <div class="document-editor">
    <div class="page-header">
      <h1 class="pull-left">
        {{ api.name }}接口文档
        <el-tag type="primary">{{ project.base_url + api.path }}</el-tag>
      </h1>
      <el-button class="pull-right" type="primary" @click="handleSubmit">
        <i class="fa fa-floppy-o"></i>保存文档
      </el-button>
    </div>
    <el-tabs :active-name="design">
      <el-tab-pane label="设计模式" name="design">
        <div id="module-container" class="module-container">
          <div class="component component-textarea">
            <el-editor :toolbar="[]" :placeholder="'Start typing markdown here...'"></el-editor>
          </div>
          <div class="component component-header">
            <el-input type="text" placeholder="Header Title..."></el-input>
          </div>
          <div class="component component-callout">
            <div class="block-callout block-edit-callout">
              <div class="block-callout-icons">
                <a class="fa fa-info-circle on" title="Info"></a>
                <a class="fa fa-exclamation-circle" title="Warning"></a>
                <a class="fa fa-exclamation-triangle" title="Danger"></a>
                <a class="fa fa-check-square" title="Success"></a>
              </div>
              <input type="text" placeholder="Message Title">
              <el-editor :toolbar="[]" :placeholder="'Message body (markdown allowed)'"></el-editor>
            </div>
          </div>
          <div class="component component-parameters">
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column prop="name" label="名称"></el-table-column>
              <el-table-column prop="type" label="类型"></el-table-column>
              <el-table-column prop="length" label="长度"></el-table-column>
              <el-table-column prop="default_value" label="默认值" inline-template>
                <span>{{ row.default_value || '无' }}</span>
              </el-table-column>
              <el-table-column prop="required" label="必填" inline-template>
                <span>{{ row.required }}</span>
              </el-table-column>
              <el-table-column prop="description" label="描述"></el-table-column>
            </el-table>
          </div>
          <div class="component component-image">
            image
          </div>
          <div class="component component-embed">
            embed
          </div>
        </div>
        <ul id="dropbox" class="dropbox">
          <li class="item">
            <a href="javascript:;">Header</a>
          </li>
          <li class="item">
            <a href="javascript:;">Code Sample</a>
          </li>
          <li class="item">
            <a href="javascript:;">Callout</a>
          </li>
          <li class="item">
            <a href="javascript:;">Table</a>
          </li>
          <li class="item">
            <a href="javascript:;">Image</a>
          </li>
          <li class="item">
            <a href="javascript:;">Embed</a>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="编辑模式" name="edit">
        <el-editor :autofocus="true"></el-editor>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/babel">
  import Vue from 'vue'
  import { mapGetters, mapActions } from 'vuex'
  import ElEditor from '../../components/editor.vue'

  export default {
    components: {
      ElEditor
    },
    data() {
      return {
        tableData: [
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            default_value: '',
            required: true,
            description: '项目名称',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '1000',
            default_value: '',
            required: false,
            description: '项目描述',
          },
        ]
      }
    },
    computed: mapGetters(['user', 'project', 'api']),
    beforeRouteEnter({ params: { api_id } }, from, next) {
      next(async(vm) => {
        await vm.fetchApi({ id: api_id })
      })
    },
    mounted() {
      Vue.nextTick(function () {
        let container = $('#module-container')

        container.sortable({
          connectWith: '.module-container',
          placeholder: 'component ui-sortable-placeholder'
        })
      })
    },
    methods: {
      ...mapActions(['fetchApi', 'updateApi']),
      handleSubmit() {

      }
    },
  }
</script>
<style lang="scss">
  .document-editor {
    .page-header {
      border-bottom: none;

      .el-tag {
        vertical-align: 2px;
      }
    }
    .el-tabs {
      width: 100%;
    }
    .el-tabs__header {
      padding-left: 0;
      margin-bottom: 0;
    }
    .el-tab-pane {
      padding: 0;
    }
    .editor-toolbar, .CodeMirror {
      border: none !important;
      border-radius: 0 !important;
    }
    .CodeMirror-fullscreen {
      border: 1px solid #d0d0d0 !important;
    }
  }
  .module-container {
    padding: 30px 170px 30px 30px;

    .component {
      margin: 0 50px 30px 0;
    }
    .component-header {
      border-bottom: 1px solid #d0d0d0;

      input {
        width: 100%;
        border: 0;
        outline: 0;
        background-color: transparent;
        padding: 0 0 6px;
        font-weight: bold;
        color: #444;
        font-size: 18px;
      }
    }
    .el-table {
      border-width: 1px;
    }
    .editor-toolbar,
    .CodeMirror {
      padding: 0;
      background-color: transparent;
    }
    .CodeMirror,
    .CodeMirror-scroll {
      min-height: 40px !important;
    }
    .component-textarea:hover {
      outline: 1px solid #eee!important;
    }
    .ui-sortable-placeholder {
      height: 40px;
      border: 2px dashed #ddd;
    }
  }
  .dropbox {
    position: fixed;
    top: 200px;
    right: 30px;
    width: 160px;
    font-size: 0;

    .item {
      font-size: 12px;
      background-color: #efefef;
      border-radius: 5px;
      width: 74px;
      height: 69px;
      display: inline-block;
      margin: 5px 0 0 5px;
      z-index: 100;
      vertical-align: top;

      a {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 3px;
        border: 1px solid #e3e3e3;
        background-color: #fff;
        cursor: move;
        color: #aba9a9;
        text-align: center;
        font-size: 10px;
        width: 74px;
        height: 69px;
        line-height: 69px;
      }
    }
  }
  .block-edit-callout {
    border-left: 4px solid #5bc0de;
    background-color: #f4f8fa;
    padding: 15px;

    input, textarea {
      border: 0 none;
      background-color: transparent;
      font-weight: bold;
      margin: 10px 0;
      width: 100%;
      color: #5bc0de;
      resize: none;

      &:focus {
        outline: 0;
      }
    }

    &.type-warning {
      background-color: #fcf8f2;
      border-color: #f0ad4e;

      input {
        color: #f0ad4e;
      }
    }

    &.type-danger {
      background-color: #fdf7f7;
      border-color: #d9534f;

      input {
        color: #d9534f;
      }
    }

    &.type-success {
      background-color: #f3f8f3;
      border-color: #50af51;

      input {
        color: #50af51;
      }
    }

    .block-callout-icons {
      .fa {
        color: rgba(0, 0, 0, 0.3);
        padding-right: 5px;
        opacity: 0.5;

        .on {
          color: #5bc0de;
          opacity: 1;

          &.fa-exclamation-circle {
            color: #f0ad4e;
          }

          &.fa-exclamation-triangle {
            color: #f0ad4e;
          }

          &.fa-exclamation-square {
            color: #f0ad4e;
          }
        }
      }
    }
  }
</style>
