<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 数据表格区域 -->
            <el-table :data="rolesList" style="width: 100%" border stripe>
                <el-table-column type="expand" label="展开" width="50px">
                    <template slot-scope="scope">
                        <el-row v-for="(item,index) in scope.row.children" :key="item.id" :class="['bdbottom',index===0?'bdtop':'','vcenter']">
                            <!-- 一级权限区域 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二级和三级权限区域 -->
                            <el-col :span="19">
                                <el-row v-for="(item2) in item.children" :key="item2.id" :class="['bdbottom','vcenter']">
                                    <el-col :span="6">
                                        <el-tag closable type="success" @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                        <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分配权限列表对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="isShowSetRightDialog"
            width="50%"
            @close="setRightsDialogClosed"
            >
            <el-tree :data="rightList" :props="defaultProps" show-checkbox node-key='id' default-expand-all :default-checked-keys='defKeys' ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowSetRightDialog = false">取 消</el-button>
                <el-button type="primary" @click="allotRight">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            //存储角色列表
            rolesList:[],

            //控制设置权限列的对话框显示与隐藏
            isShowSetRightDialog:false,

            //权限列表
            rightList:[],

            //树形控件的属性绑定对象
            defaultProps:{
                children: 'children',
                label: 'authName'
            },

            //默认选中的节点Id数组
            defKeys:[],

            //当前即将分配权限的角色id
            roleId:''
        }
    },


    //页面节点挂载好之后向后台请求数据
    mounted(){
        this.getRolesList()
    },

    methods:{
        getRolesList(){
            this.$http.get('roles')
            .then(res=>{
                if(res.data.meta.status!=200) return this.$message.error("获取角色列表失败")
                this.$message.success("获取角色列表成功")
                this.rolesList = res.data.data
            })
        },
        // 点击Tag的时候删除权限方法
        removeRightById(role,rightId){
            this.$confirm('确定要删除该权限吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                //点击了确定
                this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                .then(res=>{
                    if(res.data.meta.status!==200) return this.$message.error("取消权限失败！")

                    //重新获取一下权限
                    // this.getRolesList()

                    //重新获取权限会使得页面重新刷新一遍，这里不推荐
                    //根据返回的结果可以知道返回返回的data, 是当前角色下最新的权限数据
                    //所以直接将该结果赋值给该用户的children属性即可
                    role.children = res.data.data

                    //提示用户删除权限成功
                    this.$message.success('删除权限成功！')
                })


            }).catch(()=>{
                //点击了取消
                this.$message.info("取消删除！")
            })
        },

        // 设置权限列表
        showSetRightDialog(role){

            //将roleId保存下来，分配权限的时候需要用到
            this.roleId = role.id

            this.$http.get('rights/tree')
            .then(res=>{
                if(res.data.meta.status!==200) return this.$message.error('获取权限失败')

                this.rightList = res.data.data

                this.getLeafKeys(role,this.defKeys)
                this.isShowSetRightDialog = true
            })
        },


        //通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
        getLeafKeys(node, arr){
            if(!node.children){
                arr.push(node.id)
                return
            }

            node.children.forEach(item => {
                this.getLeafKeys(item, arr)
            });
        },

        //监听分配权限对话框的关闭事件
        setRightsDialogClosed(){
            this.defKeys = []
        },


        //点击确定按钮进行权限的分配
        allotRight(){

            //后台接口需要一个数组，所以这里先进行构造
            let keys = [
                ...this.$refs['treeRef'].getCheckedKeys(),
                ...this.$refs['treeRef'].getHalfCheckedKeys()
            ]
            
            let keyStr = keys.join(',')

            this.$http.post(`roles/${this.roleId}/rights`,{rids:keyStr})
            .then(res=>{
                if(res.data.meta.status!==200)
                    return this.$message.error('分配权限失败')
                
                this.$message.success('分配权限成功')

                this.isShowSetRightDialog = false
                //重新刷新列表
                this.getRolesList()
            })
        }
    }
}
</script>

<style>
    .el-table{
        margin-top: 20px;
    }
    .el-tag{
        margin: 7px;
    }
    .bdtop{
        border-top: 1px solid #eee;
    }
    .bdbottom{
        border-bottom: 1px solid #eee;
    }
    .vcenter{
        display: flex;
        align-items: center;
    }
</style>