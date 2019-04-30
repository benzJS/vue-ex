<template>
  <div class="home">
    <a-row type="flex" justify="center" align="middle" style="height: 100%">
      <a-col :span="8">
        <a-table
          bordered
          :dataSource="getData()"
          :columns="columns"
          :pagination="false"
          :rowSelection="{hideDefaultSelections: true, selectedRowKeys: selectedRowKeys, onChange: onSelectChange, onSelect: onRowSelect, onSelectAll}"
          :rowKey="record => record.id"
        >
            <a-input-search v-model="input" slot="customHeader" @search="addTodo()">
              <a-icon type="plus" slot="enterButton"></a-icon>
            </a-input-search>
            <div slot="customTitle" slot-scope="text, record" @mouseenter="handleHover(record.id)" @mouseleave="handleLeave(record.id)" >
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
                  <span style="text-transform: capitalize">{{filter}}</span> <a-icon type="down" />
                </a-button>
              </a-dropdown>
            </a-row>
        </a-table>
        <!-- <todo-list :dataSource="todos">
          <span slot-scope="slotProps" slot="text">
            {{slotProps}}
          </span>
        </todo-list> -->
      </a-col>
    </a-row>
  </div>
</template>

<script>
import TodoList from './TodoList.vue';
import TodoItem from './TodoItem.vue';
const columns = [
  {
    dataIndex: 'title',
    slots: {
      title: 'customHeader'
    },
    scopedSlots: {
      customRender: 'customTitle'
    },
  }
];
const todos = [
  {
      id: 1,
      title: 'Learn Node',
      isComplete: false
  },
  {
      id: 2,
      title: 'Learn Vue',
      isComplete: false
  },
  {
      id: 3,
      title: 'Learn React',
      isComplete: false
  }
]
export default {
  name: 'Home',
  data() {
    return {
      todos: [],
      columns,
      selectedRowKeys: [],
      input: '',
      filter: 'all'
    }
  },
  created() {
    this.todos = todos.map(item => {
      item.hover = false;
      return item;
    })
  },
  components: {
    TodoList,
    TodoItem
  },
  methods: {
    getData() {
      switch(this.filter) {
        case 'active': return this.todos.filter(item => !item.isComplete); break;
        case 'completed': return this.todos.filter(item => item.isComplete); break;
        default: return this.todos
      }
    },
    onSelectAll(selected, selectedRows) {
      this.todos.map(item => {
        item.isComplete = selected;
        return item;
      })
    },
    onRowSelect({ id }, selected) {
      this.todos = this.todos.map(item => {
        if(item.id === id) item.isComplete = selected;
        return item;
      });
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleFilter({ item, key }) {
      this.filter = key;
    },
    handleHover(id) {
      this.todos = this.todos.map(item => {
        if(item.id === id) item.hover = true;
        return item;
      });
    },
    handleLeave(id) {
      this.todos = this.todos.map(item => {
        if(item.id === id) item.hover = false;
        return item;
      });
    },
    addTodo() {
      this.todos.push({
        id: this.todos.length < 1 ? 1 : this.todos[this.todos.length - 1].id + 1,
        title: this.input,
        isComplete: false
      });
      this.input = '';
    },
    deleteTodo(id) {
      const itemIndex = this.todos.findIndex(item => item.id === id);
      this.todos.splice(itemIndex, 1);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .home {
    height: 100%;
  }
  .completed {
    text-decoration: line-through;
  }
</style>
