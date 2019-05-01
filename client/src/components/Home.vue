<template>
  <div class="home">
    <a-row type="flex" justify="center" align="middle" style="height: 100%">
      <a-col :span="8">
        <a-table
          v-if="token"
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
          <a-row
            type="flex"
            justify="space-between"
            slot="footer"
            slot-scope="dataSource"
            align="middle"
          >
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
        <a-card v-else>
          <a-form :form="form" layout="vertical" @submit.prevent="handleSubmit">
            <a-form-item
              label="Email"
            >
              <a-input
                v-decorator="[
                  'email',
                  {rules: [{ required: true, message: 'Please input your email' }]}
                ]"
              />
            </a-form-item>
            <a-form-item
              label="Password"
            >
              <a-input
                type="password"
                v-decorator="[
                  'password',
                  {rules: [{ required: true, message: 'Please input your password' }]}
                ]"
              />
            </a-form-item>
            <a-form-item
            >
              <a-button type="primary" html-type="submit">Submit</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import TodoList from "./TodoList.vue";
import TodoItem from "./TodoItem.vue";
import axios from 'axios';
import jwt from 'jsonwebtoken';
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
const todos = [
  {
    id: 1,
    title: "Learn Node",
    isComplete: false
  },
  {
    id: 2,
    title: "Learn Vue",
    isComplete: false
  },
  {
    id: 3,
    title: "Learn React",
    isComplete: false
  }
];
export default {
  name: "Home",
  data() {
    return {
      todos: [],
      columns,
      selectedRowKeys: [],
      input: "",
      filter: "all",
      token: '',
      tableLoading: false
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {});
  },
  created() {
    // this.todos = todos.map(item => {
    //   item.hover = false;
    //   return item;
    // });
  },
  mounted() {
    const token = localStorage.getItem('token');
    if(token) {
      this.token = token;
      this.fetchData();
    }
  },
  components: {
    TodoList,
    TodoItem
  },
  methods: {
    fetchData() {
      const token = localStorage.getItem('token');
      if(token) {
        this.tableLoading = true;
        const user = jwt.decode(token);
        axios.get(`http://localhost:3000/users/${user.id}`).then(({ data }) => {
          this.todos = data.user.todos;
          this.tableLoading = false;
        })
      }
    },
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
    handleSubmit(e) {
      const { form: { validateFields } } = this;
      // return console.log(this.form);
      validateFields((errs, { email, password }) => {
        if(email && password) {
          axios.post('http://localhost:3000/auth', {
            email,
            password
          }).then(({ data }) => {
            if(data.token) {
              localStorage.setItem('token', data.token);
              this.token = data.token;
              this.fetchData();
            };
          })
        }
      })
    },
    onSelectAll(selected, selectedRows) {
      this.todos.map(item => {
        item.isComplete = selected;
        return item;
      });
    },
    onRowSelect({ id }, selected) {
      this.todos = this.todos.map(item => {
        if (item.id === id) item.isComplete = selected;
        return item;
      });
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
    },
    deleteTodo(id) {
      const itemIndex = this.todos.findIndex(item => item.id === id);
      this.todos.splice(itemIndex, 1);
    }
  }
};
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
