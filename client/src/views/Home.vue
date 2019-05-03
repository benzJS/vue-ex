<template>
  <div class="home">
    <a-row type="flex" justify="center" align="middle" style="height: 100%">
      <a-col :span="8">
        <TodoList v-if="token" :dataSource="todos" :tableLoading="tableLoading" :onDataChange="onDataChange" />
        <Signin v-else :handleSubmit="handleSubmit" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import axios from 'axios';
import jwt from 'jsonwebtoken';

import TodoList from '../components/TodoList';
import Signin from '../components/Signin';

export default {
  name: "Home",
  data() {
    return {
      token: '',
      tableLoading: false,
      todos: []
    };
  },
  components: {
    TodoList,
    Signin
  },
  mounted() {
    this.checkToken();
  },
  methods: {
    checkToken() {
      const token = localStorage.getItem('token');
      if(token) {
        this.token = token;
        this.fetchData();
      }
    },
    fetchData() {
      this.tableLoading = true;
      const user = jwt.decode(this.token);
      axios.get(
        `http://localhost:3000/users/${user.id}/todos`,
        {
          headers: {
            'x-access-token': this.token
          },
          validateStatus: () => true
        }
      ).then(res => {
        const { data: { data } } = res;
        if(res.status === 200) {
          this.tableLoading = false;
          this.todos = data.todos;
        } else {
          this.tableLoading = false;
          this.token = '';
          localStorage.removeItem('token');
        }
      });
    },
    onDataChange(data) {
      this.todos = data;
      const user = jwt.decode(this.token);
      axios.put(
        `http://localhost:3000/users/${user.id}/todos`,
        {
          todos: this.todos
        },
        {
          headers: {
            'x-access-token': this.token
          },
          validateStatus: () => true
        }
      ).then(res => {
          if(res.status === 200) {
            console.log('OK')
          } else {
            console.log(res.data)
          }
        })
    },
    handleSubmit(validateFields) {
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
