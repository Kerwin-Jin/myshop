<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <!-- 添加分类按钮 -->
            <el-row class="addCateBtn">
                <el-col :span="3">
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格区域 -->
            <tree-table
                :data="cateList"
                :columns="columns"
                :selection-type="false"
                :expand-type="false"
                :show-index="true"
                index-text="#"
                :border="true"
                :show-row-hover="false"
            >
                <!-- 这个模板表示是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i v-if="!scope.row.cate_deleted" class="el-icon-success" style="color:lightgreen"></i>
                    <i v-else class="el-icon-error" style="color:red"></i>
                </template>

                <!-- 这个模板表示排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level==1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>

                <!-- 这个模板表示操作 -->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </tree-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="30">
            </el-pagination>


            <!-- 添加商品对话框 -->
            <el-dialog
                title="添加分类"
                :visible.sync="isShowAddCate"
                width="50%"
                @close="closeAddCateDialog"
                >
                <!-- 添加分类的表单 -->
                <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                    <el-form-item label="分类名称：" prop="cat_name">
                        <el-input v-model="addCateForm.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类">
                        <el-cascader
                            v-model="selectedKeys"
                            :options="parentCateList"
                            :props="cascaderProps"
                            clearable
                            change-on-select
                            @change="parentCateChanged">
                        </el-cascader>
                    </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="isShowAddCate = false">取 消</el-button>
                    <el-button type="primary" @click="addCate">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            //商品列表
            cateList:[],

            //查询条件
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },

            // 表格列表
            columns:[
                {
                    label: '分类名称',
                    prop: 'cat_name',
                },
                {
                    label: '是否有效',
                    //表示将当前列定义为模板列
                    type:'template',

                    //表示当前这一列使用模板名称
                    template:'isok'

                },
                {
                    label: '排序',
                    //表示将当前列定义为模板列
                    type:'template',

                    //表示当前这一列使用模板名称
                    template:'order'

                },
                {
                    label: '操作',
                    //表示将当前列定义为模板列
                    type:'template',

                    //表示当前这一列使用模板名称
                    template:'opt'

                }
            ],

            //控制添加分类对话框是否显示
            isShowAddCate:false,


            //添加分类的表单数据对象
            addCateForm:{
                cat_name:'',
                cat_pid:0,
                cat_level:0
            },

            // 添加规则的名称
            addCateFormRules:{
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },

            // 父级分类列表
            parentCateList:[],


            // 级联选择器的配置对象
            cascaderProps:{
                expandTrigger:'hover',
                label:'cat_name',
                value:'cat_id',
                children:'children'
            },

            //选中的父级分类的Id数组
            selectedKeys:[]

        }
    },

    mounted(){
        this.getCateList()
    },

    methods:{

        // 获取商品列表
        getCateList(){
            this.$http.get('categories',this.queryInfo)
            .then(res=>{
                if(res.data.meta.status!==200)
                    return this.$message.error('获取商品列表失败')
                
                this.$message.success(res.data.meta.msg)
                this.cateList = res.data.data
            })
        },


        //每页条数改变
        handleSizeChange(newSize){
            this.queryInfo.pagesize  =  newSize
            this.getCateList()
        },

        handleCurrentChange(newPagenum){
            this.queryInfo.pagenum = newPagenum
            this.getCateList()
        },

        
        // 显示添加分类对话框
        showAddCateDialog(){
            //获取列表
            this.getParentCateList()
            // 显示对话框
            this.isShowAddCate = true
        },

        //获取前两级的分类列表
        getParentCateList(){
            this.$http.get('categories',{params:{type:2}})
            .then(res=>{
                if(res.data.meta.status!==200)
                    return this.$message.error('获取列表失败')
                
                //将获取到的列表数据进行保存
                this.parentCateList = res.data.data
            })
        },

        // 选择项发生变化触发这个函数
        parentCateChanged(){
            console.log(this.selectedKeys);
            //如果selectedKeys数组中的length大于0，证明选中了父级分类，反之，就说明没有选中任何父级分类
            if(this.selectedKeys.length>0){

                //父级分类的id永远等于数组的最后一项的值
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]

                // 当前添加分类的cat_level等于数组的长度
                //  0    1   2
                // 一级 二级 三级
                this.addCateForm.cat_level = this.selectedKeys.length

                return
            }else{
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },

        //点击按钮，添加新的分类
        addCate(){
            console.log(this.addCateForm);
            this.$refs.addCateFormRef.validate(valid=>{
                if(!valid){
                    return this.$message.error('请完善表单项')
                }

                this.$http.post('categories',this.addCateForm)
                .then(res=>{
                    if(res.data.meta.status!==201){
                        return this.$message.error('添加失败')
                    }

                    this.$message.success('添加分类成功')
                    this.getCateList()
                    this.isShowAddCate = false
                })

            })
        },

        //监听添加分类对话框的关闭事件，重置表单数据
        closeAddCateDialog(){
            
            this.$refs['addCateFormRef'].resetFields()

            this.selectedKeys = []
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0

        }
    }
}
</script>

<style scoped>
    .addCateBtn{
        margin-bottom: 10px;
    }
</style>