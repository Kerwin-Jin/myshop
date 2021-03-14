<template>
    <div>
        {{token}}
        <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script>
export default {
    data(){
        return{
            token:window.sessionStorage.getItem('token')
        }
    },
    methods:{
        logout(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        }
    }
}
</script>