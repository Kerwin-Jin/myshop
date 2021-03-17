<template>
    <div>

        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>


        <!-- 卡片区域 -->
        <el-card>
            <el-row :gutter="5">
                <!-- 搜索框 -->
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="UserList">
                        <el-button slot="append" icon="el-icon-search" @click="UserList"></el-button>
                    </el-input>
                </el-col>
                <!-- 添加按钮 -->
                <el-col :span="4">
                    <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
        </el-card>

        <!-- 用户列表 -->
        <el-table
            :data="userList"
            border
            stripe
            style="width: 100%">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
                prop="username"
                label="用户名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="电话">
            </el-table-column>
            <el-table-column
                prop="role_name"
                label="角色">
            </el-table-column>
            <el-table-column
                prop="mg_state"
                label="状态">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
                    {{scope.row.mg_state}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180px" >
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUser(scope.row)"></el-button>
                    <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                       <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <div>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

        <!-- 添加用户对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="dialogVisible"
            width="50%"
            @close="handleCloseDialog('userFormRef')"
            >
            <!-- 表单 -->
            <el-form :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="userForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="userForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="userForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑用户对话框 -->
        <el-dialog
            title="修改用户信息"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="handleCloseDialog('editFormRef')"
            >
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <!-- 用户名 -->
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                
                <!-- 邮箱 -->
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>

                <!-- 手机号 -->
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        //邮箱验证规则
        let checkEmail=(rule,value,callback)=>{
            const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
            if(regEmail.test(value)){
                return callback()
            }

            return callback(new Error("邮箱格式不正确"))
        }

        //手机号验证规则
        let checkMobile=(rule,value,callback)=>{
            const regMobile = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/
            if(regMobile.test(value)){
                return callback()
            }

            return callback(new Error("请输入正确的手机号"))
        }
        return{
            //将请求参数封装为一个对象格式
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:2
            },
            userList:[],    //接收服务器返回的用户列表
            total:0,        //返回的用户总个数
            dialogVisible:false,    //控制添加用户对话框是否显示
            editDialogVisible:false,//控制修改用户信息对话框是否显示

            //用于用户表单数据的绑定
            userForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },

            //用来接收根据id查询到的用户信息
            editForm:{},

            //用户表单校验规则
            userFormRules:{
                username:[
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
                email:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile:[
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
            // 修改用户信息的表单校验规则
            editFormRules:{
                email:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    {validator:checkEmail,trigger:'blur'},
                ],
                mobile:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    {validator:checkMobile,trigger:'blur'},

                ]
            }
        }
    },

    //dom挂载之后向后端请求数据
    mounted(){
        this.UserList()
    },

    methods:{

        //获取用户列表
        UserList(){
            this.$http.get('users',{params:this.queryInfo}).then(res=>{
                console.log(res.data.data)
                console.log(res.data.data.total)
                this.userList = res.data.data.users
                this.total = res.data.data.total
            })
        },
        handleSizeChange(newSize){
            console.log(newSize);
            this.queryInfo.pagesize = newSize
            this.UserList()
        },
        handleCurrentChange(newPage){
            console.log(newPage);
            this.queryInfo.pagenum = newPage
            this.UserList()
        },
        //改变用户状态
        changeState(user){
            console.log(user.mg_state);
            //发送请求
            this.$http.put(`users/${user.id}/state/${user.mg_state}`)
            .then(res=>{
                console.log(res.data)
                if(res.data.meta.status!=200){
                    this.$message.error(res.data.meta.msg)
                    user.mg_state = !user.mg_state
                }else{
                    this.$message.success(res.data.meta.msg)
                }
            })
        },

        // 重置表单项，监听添加用户对话框关闭事件
        handleCloseDialog(formRef){
            this.$refs[formRef].resetFields();
        },

        //点击按钮，添加新用户
        addUser(){
            this.$refs['userFormRef'].validate(valid=>{
                if(!valid) return

                //发起网络请求
                this.$http.post('users',this.userForm)
                .then(res=>{
                    console.log(res.data.meta.msg);
                    if(res.data.meta.status!=201) return this.$message.error("添加用户失败")

                    //提示用户添加成功
                    this.$message.success(res.data.meta.msg)

                    //关闭对话框
                    this.dialogVisible = false

                    // 重新获取用户列表
                    this.UserList()
                })
            })
        },

        // 当点击编辑按钮的时候触发该函数，并根据用户id查询到用户信息并保存
        showEditDialog(userinfo){
            
            //根据用户id获取用户的信息
            this.$http.get('users/'+userinfo.id)
            .then(res=>{
                if(res.data.meta.status!==200) return this.$message.error("获取用户信息失败")
                //进行数据的保存
                this.editForm = res.data.data
                //显示对话框
                this.editDialogVisible = true
            })
        },

        //验证修改用户的信息并提交
        editUserInfo(){
            this.$refs.editFormRef.validate(valid=>{
                if(!valid) return this.$message.error("信息验证失败")

                //发起修改请求
                this.$http.put('users/'+this.editForm.id,{
                    email:this.editForm.email,
                    mobile:this.editForm.mobile
                }).then(res=>{
                    if(res.data.meta.status!==200) return this.$message.error("修改失败")

                    //修改成功
                    this.$message.success(res.data.meta.msg)
                    this.editDialogVisible = false
                    this.UserList()
                })
            })
        },

        //删除用户
        delUser(userinfo){
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {

                    // 调用接口删除用户
                    this.$http.delete("users/"+userinfo.id)
                    .then(res=>{
                        if(res.data.meta.status!=200) return this.$message.error("删除失败")
                        
                        //提示用户删除成功
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                            });
                        })

                        //刷新页面，重新获取数据
                        this.UserList()
                }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        }
    }
}
</script>

<style scoped>
    .el-breadcrumb{
        margin-bottom: 15px;
    }
    .el-card{
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
        line-height: 0;
    }
    .el-table{
        margin-top: 30px;
    }
    .el-pagination{
        margin-top: 10px;
    }
</style>