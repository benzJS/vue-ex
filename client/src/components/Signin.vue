<template>
    <a-card>
        <a-form :form="form" layout="vertical" @submit.prevent="handleSubmit(form.validateFields)">
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
</template>

<script>
export default {
    name: 'Signin',
    data() {
        return {
        }
    },
    beforeCreate(){
        this.form = this.$form.createForm(this, {});
    },
    created() {
        // console.log(this.form);
    },
    props: ['handleSubmit']
}
</script>

