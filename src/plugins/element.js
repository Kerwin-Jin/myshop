import Vue from 'vue'
import { Button,Form,FormItem,Input,Container,Header,Main,Aside,Menu} from 'element-ui'
import { Submenu,MenuItem,Breadcrumb,BreadcrumbItem,Card,Row,Col,Table,TableColumn,Switch} from "element-ui"
import { Tooltip,Pagination,Dialog,Tag,Tree,Select,Option} from "element-ui"

import {Message} from "element-ui"
import { MessageBox } from 'element-ui';

Vue.use(Button).use(Form).use(FormItem).use(Input).use(Container).use(Header).use(Main).use(Aside).use(Menu)
Vue.use(Submenu).use(MenuItem).use(Breadcrumb).use(BreadcrumbItem).use(Card).use(Row).use(Col).use(Table).use(TableColumn).use(Switch)
Vue.use(Tooltip).use(Pagination).use(Dialog).use(Tag).use(Tree).use(Select).use(Option)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm