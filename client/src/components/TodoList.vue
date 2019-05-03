<template>
  <a-table
    bordered
    :loading="tableLoading"
    :dataSource="getDataSource()"
    :columns="columns"
    :pagination="false"
    :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, onSelect: onRowSelect, onSelectAll}"
    :rowKey="record => record.id"
  >
    <a-input-search v-model="input" slot="customHeader" @search="addTodo()">
      <a-icon type="plus" slot="enterButton"></a-icon>
    </a-input-search>
    <div
      slot="customTitle"
      slot-scope="text, record"
      @mouseenter="handleHover(record.id)"
      @mouseleave="handleLeave(record.id)"
    >
      <a-row type="flex" justify="space-between">
        <span :class="{completed: record.isComplete}">{{text}}</span>
        <span style="cursor: pointer" @click="deleteTodo(record.id)">
          <a-icon v-if="record.hover" type="close-circle"></a-icon>
        </span>
      </a-row>
    </div>
    <a-row type="flex" justify="space-between" slot="footer" slot-scope="dataSource" align="middle">
      <span>{{dataSource.length}} item(s)</span>
      <a-dropdown :trigger="['click']">
        <a-menu slot="overlay" :selectedKeys="[filter]" @click="handleFilter">
          <a-menu-item key="all">All</a-menu-item>
          <a-menu-item key="active">Active</a-menu-item>
          <a-menu-item key="completed">Completed</a-menu-item>
        </a-menu>
        <a-button>
          <span style="text-transform: capitalize">{{filter}}</span>
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </a-row>
  </a-table>
</template>

<script>
import Vue from 'vue';
import jwt from 'jsonwebtoken';
import axios from 'axios';
// import { Consumer } from '../contexts/AppContext';
const columns = [
  {
    dataIndex: "title",
    slots: {
      title: "customHeader"
    },
    scopedSlots: {
      customRender: "customTitle"
    }
  }
];
export default {
  name: "TodoList",
  data() {
    return {
      input: "",
      filter: "all",
      todos: [],
      columns
    }
  },
  computed: {
    selectedRowKeys: {
      get() {
        return this.todos
          .filter(item => item.isComplete)
          .map(item => this.todos.findIndex(i => i.id === item.id) + 1);
      },
      set() {

      }
    }
  },
  watch: {
    dataSource() {
      this.todos = this.dataSource;
    }
  },
  props: ['dataSource', 'tableLoading', 'onDataChange'],
  methods: {
    getDataSource() {
      switch (this.filter) {
        case "active":
          return this.todos.filter(item => !item.isComplete);
          break;
        case "completed":
          return this.todos.filter(item => item.isComplete);
          break;
        default:
          return this.todos;
      }
    },
    onSelectAll(selected, selectedRows) {
      this.todos.map(item => {
        item.isComplete = selected;
        return item;
      });
      this.onDataChange(this.todos.map(item => {
        delete item['hover'];
        return item;
      }));
    },
    onRowSelect({ id }, selected) {
      this.todos = this.todos.map(item => {
        if (item.id === id) item.isComplete = selected;
        return item;
      });
      this.onDataChange(this.todos.map(item => {
        delete item['hover'];
        return item;
      }));
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleFilter({ key }) {
      this.filter = key;
    },
    handleHover(id) {
      this.todos = this.todos.map(item => {
        if (item.id === id) item.hover = true;
        return item;
      });
    },
    handleLeave(id) {
      this.todos = this.todos.map(item => {
        if (item.id === id) item.hover = false;
        return item;
      });
    },
    addTodo() {
      this.todos.push({
        id:
          this.todos.length < 1 ? 1 : this.todos[this.todos.length - 1].id + 1,
        title: this.input,
        isComplete: false
      });
      this.input = "";
      this.onDataChange(this.todos.map(item => {
        delete item['hover'];
        return item;
      }));
    },
    deleteTodo(id) {
      const itemIndex = this.todos.findIndex(item => item.id === id);
      this.todos.splice(itemIndex, 1);
      this.onDataChange(this.todos.map(item => {
        delete item['hover'];
        return item;
      }));
    }
  }
};
</script>


