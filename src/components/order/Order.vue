<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
    

        <!-- 卡片区域 -->
        <el-card>
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 订单列表区域 -->
            <el-table :data="orderList" border stripe>
                <el-table-column type="index" width="50" label="#"></el-table-column>
                <el-table-column prop="order_number" label="订单编号"></el-table-column>
                <el-table-column prop="order_price" label="订单价格"></el-table-column>
                <el-table-column prop="pay_status" label="是否付款">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.pay_status==='0'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货"></el-table-column>
                <el-table-column label="下单时间">
                    <template slot-scope="scope">
                        {{scope.row.create_time|dataFilter}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox">编辑</el-button>
                        <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox">定位</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页功能 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[10, 50, 100, 200]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>


        <!-- 修改地址的对话框 -->
        <el-dialog title="修改地址" :visible.sync="editAddressVisible" width="50%" @close='addressDialogClosed'>
            <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                    <el-input v-model="addressForm.address1"></el-input>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editAddressVisible = false">取 消</el-button>
                <el-button type="primary" @click="editAddressVisible = false">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 展示进度的对话框 -->
        <el-dialog title="物流信息" :visible.sync="progressVisible" width="50%">
            <el-timeline>
                <el-timeline-item
                    v-for="(activity, index) in activities"
                    :key="index"
                    :timestamp="activity.time">
                    {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>   
</template>

<script>
export default {
    data(){
        return{
            // 请求参数
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },

            // 数据总条数
            total:0,

            orderList:[],

            editAddressVisible:false,
            progressVisible:false,

            addressForm:{
                address1:'',
                address2:''
            },
            addressFormRules:{
                address1:[
                    { required: true, message: '请选择省市区/县', trigger: 'blur' }
                ],
                address2:[
                    { required: true, message: '请填写详细地址', trigger: 'blur' },
                ]
            },
            
            // 时间线
            activities: [{
                time:'2018-05-10 09:39:00',
                context:'已签收，感谢使用顺丰，期待再次为您服务'
                },
                {
                time:'2018-05-10 08:23:00',
                context:'[北京市]北京海淀育新小区营业点派送员 顺丰速运 95338正在为您派件'
                },
                {
                time:'2018-05-10 07:32:00',
                context:'快件到达 [北京海淀育新小区营业点]'
                }
            ]
            

        }
    },
    methods:{
        // 获取订单列表
        async getOrderData(){
            let {data:res} = await this.$http.get('orders',{params:this.queryInfo});
            if(res.meta.status!==200){
                return this.$message.errro('获取订单列表失败')
            }

            this.total = res.data.total;
            this.orderList = res.data.goods;
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getOrderData()
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getOrderData()
        },

        //展示修改的对话框
        showBox(){

            this.editAddressVisible = true
        },

        //展示进度对话框
        async showProgressBox(){
            
            this.progressVisible = true
        },

        // 关闭对话框的时候清空表单
        addressDialogClosed(){
            this.$refs.addressFormRef.resetFields()
        }
    },
    mounted(){
        this.getOrderData()
    }
}
</script>
<style scoped>
    .el-pagination{
        margin-top: 20px;
    }
</style>
