<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <el-form class="login_form" :model="loginForm" :rules="loginRules" ref="formRef">
                <el-form-item label-width="0px" prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item label-width="0px" prop="password">
                    <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="clearForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import axios from "axios"
export default {
    data(){
        return{
            //登录表单的数据绑定对象
            loginForm:{
                username:'admin',
                password:'123456'
            },

            //表单的验证规则对象
            loginRules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        clearForm(){
            this.$refs.formRef.resetFields()
        },
        login(){
            //表单预验证，只有通过了验证规则才向后端接口发起请求
            this.$refs.formRef.validate(valid=>{
                console.log(valid);
                if(valid){

                    //发送请求
                    this.$http.post('login',this.loginForm).then(res=>{
                        console.log(res.data);

                        //登录失败的情况
                        if(res.data.meta.status!=200){
                            // this.$message.error("用户名或密码错误")
                            this.$message({
                                type:'error',
                                 message: '用户名或密码错误'
                            })
                            return
                        };
                        //登录成功之后的行为
                        this.$message.success("登录成功！")
                        console.log(res.data.data.token)
                        //1. 将登录成功过之后的token，保存到客户端的sessionStorage中
                        //   1.1项目中除了登录之外的其他API接口，必须在登录之后才能访问
                        //   1.2token只应在当前网站打开期间生效，所以将token保存唉sessionStorage中，而不是永久存储在localStorage中
                        window.sessionStorage.setItem("token",res.data.data.token)
                        //2. 通过编程式导航跳转到后台主页，路由地址是 /home
                        this.$router.push("/home")
                    })

                }else{
                    console.log("校验失败");
                    return
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .login_container{
        height: 100vh;
        background: #2b4b6b;
        // background-image: linear-gradient(to top, #9890e3 0%, #b1f4cf 100%);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .login_box{
        width: 450px;
        height: 300px;
        border-radius: 5px;
        background: #fff;
        position: relative;

        .avatar_box{
            width: 130px;
            height: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-60%);
            background: #fff;

            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: #eee;
            }
        }
    }
    .login_form{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
    }
    .btns{
        display: flex;
        justify-content: center;
    }
</style>