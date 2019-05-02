<template>
  <div class="home">
    <a-row type="flex" justify="center" align="middle" style="height: 100%">
      <a-col :span="8">
        <TodoList  v-if="token" :data="todos" />
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
            <a-form-item>
              <a-button type="primary" html-type="submit">Submit</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import TodoList from '../components/TodoList';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Provider, Consumer } from '../contexts/AppContext';
export default {
  name: "Home",
  data() {
    return {
      token: '',
      tableLoading: false,
      todos: []
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {});
  },
  components: {
    TodoList,
    Provider,
    Consumer
  },
  mounted() {
    this.checkToken();
  },
  methods: {
    checkToken() {
      const token = localStorage.getItem('token');
      const decoded = jwt.decode(token);
      console.log(decoded);
      if(!decoded) {
        localStorage.removeItem('token');
        return;
      }
      this.token = token;
      this.fetchData();
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
        const { data } = res;
        if(res.status === 200) {
          this.todos = data.data.todos;
        } else {
          console.log(res.data);
        }
      });
    },
    handleSubmit(e) {
      const { form: { validateFields } } = this;
      validateFields((errs, { email, password }) => {
        if(email && password) {
          axios.post('http://localhost:3000/auth', {
            email,
            password
          }).then(({ data }) => {
            if(data.token) {
              localStorage.setItem('token', data.token);
              this.token = data.token;
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
