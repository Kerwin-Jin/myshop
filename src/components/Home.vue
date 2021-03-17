<template>
    <el-container class="home-container">

        <!-- 头部区域 -->
        <el-header>
            <h2>电商后台管理系统</h2>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>

        <el-container>
            <!-- 侧边栏区域 -->
            <el-aside :width="isCollapse?'64px':'200px'">
                <div class="toggle-button" @click="isCollapse = !isCollapse">{{isCollapse?'展开':'折叠'}}</div>
                <el-menu
                    :default-active="activeItem"
                    class="el-menu-vertical-demo"
                    background-color="#d3dce6"
                    text-color="#313743"
                    unique-opened
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    :router="true"
                    active-text-color="#359bff">
                    <el-submenu :index="menuItem.id+''" v-for="menuItem in menuList" :key="menuItem.id">
                        <template slot="title">
                            <i :class="iconObj[menuItem.id]"></i>
                            <span>{{menuItem.authName}}</span>
                        </template>
                        <el-menu-item :index="'/'+submenuItem.path" v-for="submenuItem in menuItem.children" :key="submenuItem.id" @click="changeActive('/'+submenuItem.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{submenuItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>


                    <el-menu-item index="2">
                        <template slot="title">
                            <i class="el-icon-star-off"></i>
                            <span>快速商品</span>
                        </template>
                    </el-menu-item>
                </el-menu>
            </el-aside>

            <!-- 主体区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {

    created(){
        this.getMenu()
    },
    data(){
        return{
            menuList:[],
            isCollapse:false,
            iconObj:{
                '125':'iconfont icon-users',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao'
            },
            activeItem:''
        }
    },
    methods:{
        logout(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        },

        //获取所有的菜单
        getMenu(){
            this.$http.get('menus').then(res=>{
                console.log(res.data.data)
                console.log(res.data.meta)
                if(res.data.meta.status!=200) return this.$message.error("获取菜单列表失败")
                this.$message.success(res.data.meta.msg)
                this.menuList = res.data.data
            })
        },

        changeActive(path){
            this.activeItem = path
        }

    }
}
</script>

<style lang="less" scoped>
    .iconfont{
        margin-right: 5px;
        color: #313743;
    }
    .home-container{
        height: 100%;
    }
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }
    .el-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;

        .el-menu{
            border-right: none;
        }
    }
    
    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 30px;
    }
    .toggle-button{
        background:#475163;
        color: #fff;
        text-align: center;
        height: 30px;
        line-height: 30px;
        letter-spacing: 0.2rem;
        cursor: pointer;
    }
  
</style>