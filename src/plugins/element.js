import Vue from 'vue'
import { Button,Form,FormItem,Input } from 'element-ui'
import {Message} from "element-ui"

Vue.use(Button).use(Form).use(FormItem).use(Input)

Vue.prototype.$message = Message