<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <!-- 警告区域 -->
            <el-row>
                <el-col :span="8">
                    <el-alert
                        title="注意！只允许第三级分类设置相关参数！"
                        type="warning"
                        effect="dark"
                        :show-icon="true"
                        :closable="false">
                    </el-alert>
                </el-col>
            </el-row>

            <!-- 选择商品分类区域 -->
            <el-row type="flex" justify="start" class="cate_row">
                <span>
                    选择商品分类： 
                </span>
                <!-- 级联选择框 -->
                 <el-cascader
                    v-model="selectedCateKeys"
                    :options="cateList"
                    :props="cateProps"
                    @change="handleChange">
                </el-cascader>
            </el-row>

            <!-- Tab标签页 -->
             <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 动态参数面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" :disabled='isBtnDisabled' @click="isShowDialog=true">添加参数</el-button>
                    <el-table :data="manyTabData" style="width: 100%" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item ,i) in scope.row.attr_vals" :key="i" closable @close="deleteTag(i,scope.row)">
                                    {{item}}
                                </el-tag>
                                <el-input
                                    class="tagInput"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                </el-input>
                                <el-button v-else size="small" @click="showTagInput(scope.row)">+新标签</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称" width="250"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                                {{scope.row.attr_name}}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!-- 添加属性面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" :disabled='isBtnDisabled' @click="isShowDialog=true">添加属性</el-button>
                    <el-table :data="onlyTabDate" style="width: 80%" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item ,i) in scope.row.attr_vals" :key="i" closable @close="deleteTag(i,scope.row)">
                                    {{item}}
                                </el-tag>
                                <el-input
                                    class="tagInput"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                </el-input>
                                <el-button v-else size="small" @click="showTagInput(scope.row)">+新标签</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="attr_name" label="属性名称" width="250"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                                {{scope.row.attr_name}}
                            </template>
                        </el-table-column>
                    </el-table> 
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加动态参数和静态属性对话框 -->
        <el-dialog
            :title="'添加'+addDialogTitle"
            :visible.sync="isShowDialog"
            width="30%"
            @close="addDialogClose">

            <!-- 添加数据的表单 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="addDialogTitle" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowDialog = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>


        <!-- 修改动态参数和静态属性对话框 -->
        <el-dialog
            :title="'修改'+addDialogTitle"
            :visible.sync="isShowEditDialog"
            width="30%"
            @close="editDialogClose">

            <!-- 修改数据的表单 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="addDialogTitle" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowEditDialog = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            cateList:[],

            //选中的值会被绑定到这个数组中
            selectedCateKeys:[],

            //级联属性
            cateProps:{
                expandTrigger: 'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },

            activeName:'many',

            //接收请求回来的数据
            manyTabData:[],
            onlyTabDate:[],

            //控制添加对话框隐藏与否
            isShowDialog:false,

            addForm:{
                attr_name:''
            },

            //添加参数表单对话框的校验规则
            addFormRules:{
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' }
                ]
            },

            //控制编辑对话框隐藏与否
            isShowEditDialog:false,

            //修改的表单数据对象
            editForm:{},

            editFormRules:{
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' }
                ]
            }
        }
    },
    computed:{
        isBtnDisabled(){
            if(this.selectedCateKeys.length!==3){
                return true
            }
            return false
        },
        cateId(){
            if(this.selectedCateKeys.length==3){
                return this.selectedCateKeys[2]
            }
            return null
        },
        //将添加对话框的标题设置为计算属性
        addDialogTitle(){
            if(this.activeName==='many'){
                return '动态参数'
            }else{
                return '静态属性'
            }
        }
    },

    mounted(){
        this.getCateList()
    },
    methods:{

        //获取所有商品分类列表
        getCateList(){
            this.$http.get('categories')
            .then(res=>{
                if(res.data.meta.status!==200)
                    return this.$message.error("获取分类列表失败")
                
                this.cateList = res.data.data
                this.$message.success(res.data.meta.msg)
            })
        },

        //当选择的级联值发生改变时，会触发此函数
        handleChange(){
            this.getParamsData()
        },

        //tab标签页点击事件的处理函数
        handleTabClick(){
            console.log(this.activeName);
            this.getParamsData()
        },

        //获取参数的列表数据
        getParamsData(){
            console.log(this.selectedCateKeys);

            //通过数组长度判断如果选中的不是三级分类
            if(this.selectedCateKeys.length!==3){
                this.$message.error('必须选择三级分类')
                this.selectedCateKeys = []
                this.manyTabData = []
                this.onlyTabDate = []
                return
            }

            this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
            .then(res=>{
                if(res.data.meta.status!==200){
                    return this.$message.error('获取失败')
                }

             
                res.data.data.forEach(item=>{
                    item.attr_vals = item.attr_vals?item.attr_vals.split(' '):[]
                    //控制每行文本框的显示与隐藏
                    item.inputVisible = false
                    //关联每行文本框中的值
                    item.inputValue = ''
                })

                //将处理的数据按分类付给相应的对象
                if(this.activeName == 'many'){
                    this.manyTabData = res.data.data
                }else{
                    this.onlyTabDate = res.data.data
                }
                // console.log(this.manyTabData);
                // console.log(this.onlyTabDate);
                this.$message.success('获取成功')
            })
        },

        //添加对话框关闭的时候清除校验规则
        addDialogClose(){
            this.$refs['addFormRef'].resetFields()
        },

        //点击按钮，向后台发起添加参数的函数
        addParams(){
            this.$refs['addFormRef'].validate(valid=>{
                if(!valid){
                    return
                }

                this.$http.post(`categories/${this.cateId}/attributes`,{
                    'attr_name':this.addForm.attr_name,
                    'attr_sel':this.activeName

                }).then(res=>{
                    if(res.data.meta.status!=201){
                        return this.$message.error('添加参数失败')
                    }

                    this.$message.success(res.data.meta.msg)

                    this.isShowDialog = false

                    this.getParamsData()

                })
            })
        },

        //显示编辑对话框
        showEditDialog(id){

            //根据id将数据查询出来
            this.$http.get(`categories/${this.cateId}/attributes/${id}`,{
                params:{
                    'attr_sel':this.activeName
                }
            }).then(res=>{
                if(res.data.meta.status!==200){
                    return console.log("请求失败")
                }
                
                this.editForm = res.data.data
            })

            //显示对话框
            this.isShowEditDialog = true
        },

        //重置修改的表单
        editDialogClose(){
            this.$refs.editFormRef.resetFields()
        },


        //点击确定修改参数
        editParams(){
            this.$refs['editFormRef'].validate(valid=>{
                if(!valid){
                    return this.$message.error('表单验证失败')
                }

                //发起请求
                this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
                    'attr_name':this.editForm.attr_name,
                    'attr_sel':this.activeName
                })
                .then(res=>{
                    if(res.data.meta.status!==200)
                        return this.$message.error('修改失败')
                    
                    this.$message.success(res.data.meta.msg)

                    this.isShowEditDialog = false
                    this.getParamsData()
                })
            })
        },


        //删除参数操作
        removeParams(id){
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
                }).then(() => {
                    // 发起删除参数请求
                    this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
                    .then(res=>{
                        if(res.data.meta.status!==200)
                            return this.$message.error('删除失败')
                        this.$message.success(res.data.meta.msg)
                        this.getParamsData()
                    })
                }).catch(() => {});
        },

        //控制是否显示标签输入框
        showTagInput(row){
            row.inputVisible = !this.inputVisible

            //$nextTick方法的作用，就是当页面上的元素被重新渲染之后，才会指定执行回调函数中的代码
            this.$nextTick(_=>{
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },

        //添加标签
        handleInputConfirm(row) {

            row.inputValue = row.inputValue.trim()
            if(!row.inputValue){
                console.log("请输入标签name")
                return
            }


            //后续处理
            console.log(row.inputValue)
            row.attr_vals.push(row.inputValue)

            //调用函数进行保存
            this.saveTag(row)

            row.inputValue = ''
            row.inputVisible = false;
        },


        //保存标签
        saveTag(row){
            this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals:row.attr_vals.join(' ')
            }).then(res=>{
                if(res.data.meta.status!==200){
                    return this.$message.error('添加失败')
                }

                this.$message.success(res.data.meta.msg)
            })
        },

        // 删除标签
        deleteTag(i,row){
            row.attr_vals.splice(i,1)
            this.saveTag(row)
        }
    }
}
</script>

<style scoped>
    .cate_row{
        margin: 10px 0;
    }
    .tagInput{
        width: 120px;
    }
</style>