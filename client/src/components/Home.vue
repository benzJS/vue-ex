<template>
  <div class="home">
    <a-row type="flex" justify="center">
      <a-col :span="8">
        <a-table :dataSource="todos" :columns="columns" bordered :pagination="false" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
            <a-input-search v-model="input" slot="customHeader" @search="addTodo()">
              <a-icon type="plus" slot="enterButton"></a-icon>
            </a-input-search>
            <div slot="customTitle" slot-scope="text, record" @mouseenter="handleHover(record.id)" @mouseleave="handleLeave(record.id)" >
              <a-row type="flex" justify="space-between">
                <span>{{text}}</span>
                <a-icon v-if="record.isComplete" type="close-circle"></a-icon>
              </a-row>
            </div>
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
    key: 'id',
    slots: {
      title: 'customHeader'
    },
    scopedSlots: {
      customRender: 'customTitle'
    }
  }
]
export default {
  name: 'Home',
  data () {
    return {
      todos: [
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
      ],
      columns,
      selectedRowKeys: [],
      input: ''
    }
  },
  components: {
    TodoList,
    TodoItem
  },
  methods: {
    onSelectChange(selectedRowKeys) {
      console.log(selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    handleHover(id) {
      this.todos = this.todos.map(item => {
        if(item.id === id) item.isComplete = true;
        return item;
      });
    },
    handleLeave(id) {
      this.todos = this.todos.map(item => {
        if(item.id === id) item.isComplete = false;
        return item;
      });
    },
    addTodo() {
      this.todos.push({
        id: this.todos[this.todos.length - 1].id + 1,
        title: this.input,
        isComplete: false
      });
      this.input = '';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
