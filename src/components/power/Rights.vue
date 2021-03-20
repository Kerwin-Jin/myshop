<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-table :data="rightsList" style="width: 100%" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="authName" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="路径"></el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template slot-scope='scope'>
                        <el-tag v-if="scope.row.level=='0'">标签一</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level=='1'">标签二</el-tag>
                        <el-tag type="warning" v-else>标签三</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            rightsList:[]
        }
    },

    mounted(){
        this.getRightsList()
    },

    methods:{
        // 获取权限列表
        getRightsList(){
            this.$http.get('rights/list')
            .then(res=>{
                if(res.data.meta.status!==200) return this.$message.error("获取权限列表失败") 
                // 获取数据成功之后将数据保存下来
                this.rightsList = res.data.data
            })
        }
    }
    
}
</script>


<style>
    .el-breadcrumb{
        margin-bottom: 10px;
    }
    .el-card{
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    }
</style>