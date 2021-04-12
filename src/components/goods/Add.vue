<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <el-alert show-icon center title="添加商品信息" type="info" :closable='false'></el-alert>
            <el-steps :space="200" :active="activeIndex-0"  finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
        </el-card>

        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="left">
        <!-- Tab标签页 -->
            <el-tabs tab-position="left" v-model="activeIndex" :before-leave='beforeLeave' @tab-click='tabClick'>
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input v-model="addForm.goods_price" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                        <el-input v-model="addForm.goods_weight" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input v-model="addForm.goods_number" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_cat">
                        <!-- 级联选择器 -->
                        <el-cascader
                        v-model="addForm.goods_cat"
                        :options="cateList"
                        :props="cateProps"
                        placeholder="请选择一个三级分类"
                        @change="handleChange"></el-cascader>
                    </el-form-item>
                    
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                    <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                        <el-checkbox-group v-model="item.attr_vals">
                            <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                    <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id" label-width="200">
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <el-upload
                        :action="imgUploadUrl"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        list-type="picture"
                        :headers="headerObj"
                        :on-success="handleSuccess"
                        >
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                    <h3>商品内容</h3>
                    <el-button type="primary" @click="add">添加商品</el-button>
                </el-tab-pane>
            </el-tabs>
        </el-form>

        <!-- 图片预览 -->
        <el-dialog
            title="图片预览"
            :visible.sync="isShowImgPreviewDialog"
            width="50%"
            >
            <img :src="imgPreviewPath"/>
        </el-dialog>
    </div>
</template>

<script>
import _ from "lodash";
export default {
    data(){
        return{
            activeIndex:'0',
            addForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                goods_cat:[],
                // 图片上传的数组
                pics:[],

                //动态参数和静态属性
                attrs:[]
            },
            addFormRules:{
                goods_name:[
                    {
                        required:true,
                        message:'请输入商品名称',
                        trigger:'blur'
                    }
                ],
                goods_price:[
                    {
                        required:true,
                        message:'请输入商品价格'
                    }
                ],
                goods_weight:[
                    {
                        required:true,
                        message:'请输入商品重量'
                    }
                ],
                goods_number:[
                    {
                        required:true,
                        message:'请输入商品数量'
                    }
                ],
                goods_cat:[
                    {
                        required:true,
                        message:'请选择商品分类'
                    }
                ]
            },

            //分类列表
            cateList:[],

            //级联选择器的属性
            cateProps:{
                expandTrigger: 'hover',
                value:'cat_id',
                label:'cat_name',
                children:'children' 
            },

            //动态参数
            manyTableData:[],
            // 静态属性
            onlyTableData:[],

            // 图片上传的url地址
            imgUploadUrl:'http://www.ysqorz.top:8888/api/private/v1/upload',


            // 上传图片需要携带token
            headerObj:{
                Authorization:window.sessionStorage.getItem('token')
            },

            //保存图片预览的路径
            imgPreviewPath:'',

            //控制图片预览的对话框显示与否
            isShowImgPreviewDialog:false
        }
    },
    methods:{
        // 获取商品分类列表
        async getCateList(){
            let {data:res} = await this.$http.get('categories')
            if(res.meta.status!==200){
                return this.$message.error('获取失败')
            }

            this.cateList = res.data
            console.log(this.cateList);
        },

        // 当选择项发生改变时
        handleChange(){
            //必须选择三级分类，所以在这里判断数组的长度，如果长度不等于3就让其重新选择
            if(this.addForm.goods_cat.length!==3){
                this.addForm.goods_cat = [];
            }
        },

        //当标签页改变时触发
        beforeLeave(activeTag,oldTag){
            if(oldTag==='0' && this.addForm.goods_cat.length!==3){
                this.$message.error('请先选择三级分类！')
                return false;
            }

            return true;
        },

        //当标签页点击的时候触发
        async tabClick(){
            if(this.activeIndex==='1'){
                //获取动态参数
                let {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
                if(res.meta.status!==200){
                    return console.log('获取信息失败')
                }

                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.length === 0?[]:item.attr_vals.split(' ')
                });
                //获取动态参数成功
                this.manyTableData = res.data
                console.log(this.manyTableData);
            }else if(this.activeIndex==='2'){
                //获取动态参数
                let {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}})
                if(res.meta.status!==200){
                    return console.log('获取信息失败')
                }
                this.onlyTableData = res.data
                console.log(this.onlyTableData);
            }
        },

        //图片预览
        handlePreview(file){
            this.imgPreviewPath = file.response.data.url
            this.isShowImgPreviewDialog = true
        },

        // 图片移除
        handleRemove(file){
            //获取图片的路径
            let filePath = file.response.data.tmp_path

            // console.log(file.response.data.tmp_path);
            //找出索引值
            let index = this.addForm.pics.findIndex(item=>{
                item.pic === filePath
            })

            //将路径从提交表单的图片数组中移除
            this.addForm.pics.splice(index,1)
        },

        // 移除图片之前
        beforeRemove(){},

        // 监听图片上传成功
        handleSuccess(response){
            let picTmpPath={
                pic:response.data.tmp_path
            }
            this.addForm.pics.push(picTmpPath)
            console.log(this.addForm);
        },


        //最后发起添加商品的请求
        add(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid){
                    return this.$message.error('添加失败')
                }

                let form = _.cloneDeep(this.addForm)
                //执行添加的业务逻辑

                //处理分类属性
                form.goods_cat = form.goods_cat.join(',')

                //处理动态参数
                this.manyTableData.forEach(item=>{
                    let newInfo = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals.join(' ')
                    }
                    form.attrs.push(newInfo)
                })

                //处理静态属性
                this.onlyTableData.forEach(item=>{
                    let newInfo = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals
                    }
                    form.attrs.push(newInfo)
                })

                //向后端发起请求
                let {data:res} = await this.$http.post('good',form)
                if(res.meta.status!==201){
                    console.log(res);
                    return this.$message.error('添加商品失败')
                }
                this.$message.success(res.meta.msg)

                this.$router.push('/goods')
            })
        }
    },
    computed:{
        cateId(){
            if(this.addForm.goods_cat.length ===3){
                return this.addForm.goods_cat[2]
            }else{
                return null
            }
        }
    },
    mounted(){
        this.getCateList()
    }
}
</script>

<style scoped>
.el-steps{
    margin: 10px auto;
}
.el-tabs{
    margin-top: 20px;
}
.el-checkbox{
    margin: 10px 10px 0 0 !important;
    float: left;
}
</style>