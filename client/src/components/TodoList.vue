<template>
    <ul>
        <li v-for="item in dataSource" :key="item.id">
            <slot :item="item.title" name="text">
                {{item.id}}
            </slot>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'TodoList',
    props: ['dataSource']
}
</script>


