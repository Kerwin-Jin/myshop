<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <!-- 搜索添加区域 -->
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList()">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="toAddPage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 数据展示 -->
            <el-table :data="goodsList" style="width: 100%" border stripe>
                <el-table-column type="index" label="#" width="60"></el-table-column>
                <el-table-column prop="goods_name" label="名称"></el-table-column>
                <el-table-column prop="goods_price" label="价格(元)" width="90"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="90"></el-table-column>
                <el-table-column prop="add_time" label="创建时间" width="120">
                    <template slot-scope="scope">
                        {{scope.row.add_time|dataFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
                
            </el-table>

            <!-- 页码区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[10, 50, 100, 200]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total" background>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            // 封装的请求参数
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            //保存获取到的数据
            goodsList:[],
            //总条数
            total:0
        }
    },

    methods:{
        // 获取商品列表
        async getGoodsList(){
            let {data:res} = await this.$http.get('goods',{
                params:this.queryInfo
            })

            if(res.meta.status!==200){
                return this.$message.error('获取失败')
            }

            this.goodsList = res.data.goods
            this.total = res.data.total
        },

        //当pageSize改变的时候执行该函数
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },

        //当当前页改变的时候执行该函数
        handleCurrentChange(currentPageNum){
            console.log(currentPageNum)
            this.queryInfo.pagenum = currentPageNum
            this.getGoodsList()
        },



        // 添加商品按钮点击
        toAddPage(){
            this.$router.push('/goods/add')
        },

        // 删除商品
        removeById(good_id){
            
            this.$confirm('此操作将永久删除该文件, 是否继续?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {

                // 向后端api发起删除请求
                this.$http.delete(`goods/${good_id}`)
                .then(res=>{
                    if(res.data.meta.status!==200){
                        return this.$message.error("删除失败")
                    }
                    this.$message.success(res.data.meta.msg)
                    this.getGoodsList()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        }
    },


    // 页面挂载的时候就获取商品列表
    mounted(){
        this.getGoodsList()
    }
}
</script>

<style scoped>
.el-pagination{
    margin-top: 10px;
}
</style>
