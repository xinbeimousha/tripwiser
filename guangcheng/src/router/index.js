import Vue from 'vue';
import Router from 'vue-router';

const LoginPage = () => import('pages/LoginPage/LoginPage');
const MainPage = () => import('pages/MainPage/MainPage');
const MainPageApply =() => import('pages/MainPage/children/MainPageApply/MainPageApply');
const MainPageBook =() => import('pages/MainPage/children/MainPageBook/MainPageBook');
const MainPageMe = () => import('pages/MainPage/children/MainPageMe/MainPageMe');
const MainPageTrip = () => import('pages/MainPage/children/MainPageTrip/MainPageTrip');
const PlaneSearch = () => import('pages/PlaneSearch/PlaneSearch');
const DomeSearchResult = () => import('pages/DomeSearchResult/DomeSearchResult');
const DomeOrder = () => import('pages/DomeOrder/DomeOrder');
const OrderList = () => import('pages/OrderList/OrderList');
const OrderDetailDome = () => import('pages/OrderDetail/OrderDetailDome');
const OrderDetailInter = () => import('pages/OrderDetail/OrderDetailInter');
const airportServer = () => import('pages/airportServer/airportServer');
const airportActive = () => import('pages/airportActive/airportActive');
const commonPage = () => import('pages/commonPage/commonPage');
const airportCustomer = () => import('pages/airportCustomer/airportCustomer');
const airportSearchResult = () => import('pages/airportSearchResult/airportSearchResult');
const airportSearchDetail = () => import('pages/airportSearchDetail/airportSearchDetail');
const TripOrderList = () => import('pages/OrderList/TripOrderList');
const NotFound = () => import('pages/NotFound/NotFound');
const CityList = () => import('pages/CityList/CityList');
const TripApply = () => import('pages/TripApply/TripApply');
const TripAdd = () => import('pages/TripAdd/TripAdd');
const TripApproval = () => import('pages/TripApproval/TripApproval');
const TripChangeTraveler = () => import('pages/TripChangeTraveler/TripChangeTraveler');
const TripDetail = () => import('pages/TripDetail/TripDetail');
const BindingUser = () => import('pages/BindingUser/BindingUser');
const TripPeerAdd = () => import('pages/TripPeerAdd/TripPeerAdd');
const TripAttribution = () => import('pages/TripAttribution/TripAttribution');
const TripCostBudget = () => import('pages/TripCostBudget/TripCostBudget');
const TripCostBudgetStatic = () => import('pages/TripCostBudget/TripCostBudgetStatic');
const TripOpinion = () => import('pages/TripOpinion/TripOpinion');
import { Dialog,Toast } from "vant";
import { setLocal,getLocal } from 'common/js/storage.js';
import  verformLogin  from "api/verformLogin.js";


//引用me-edit页面
import Edit from "../pages/MainPage/children/MainPageMe/MainPageMeEdit"
//引用MainPageMeManage页面
import Manage from "../pages/MainPage/children/MainPageMe/MainPageMeManage"
//引用MainPageMeExpenses页面
import Expenses from "../pages/MainPage/children/MainPageMe/MainPageMeExpenses"
//引用MainPageMeMessage页面
import Message from "../pages/MainPage/children/MainPageMe/MainPageMeMessage"
//引用MainPageMeIdea页面
import Idea from "../pages/MainPage/children/MainPageMe/MainPageMeIdea"
//引用MainPageMeAbout页面
import About from "../pages/MainPage/children/MainPageMe/MainPageMeAbout"
//引用MainPageMe_table_trip页面
import MeTrip from "../pages/MainPage/children/MainPageMe/MainPageMe_table_trip"
//引用MainPageMe_table_product页面
import MeProduct from "../pages/MainPage/children/MainPageMe/MainPageMe_table_product"
//引用报销申请页面ReiSement
import ReiSement from "../pages/MainPage/children/MainPageApply/MainPageReiSement"
//引用报销审批页面ReiApproval
import ReiApproval from "../pages/MainPage/children/MainPageApply/MainPageReiApproval"
//引用报销详情页面
import ReiSementYesDetail from '../pages/MainPage/children/MainPageApply/detail/ReiSementYesDetail'
import ReiOpinion from '../pages/MainPage/children/MainPageApply/detail/ReiOpinion'
//引用国际机票页面
import InterDomeOrder from 'pages/DomeOrder/InterDomeOrder'


Vue.use(Router)


const router = new Router({
  routes: [{
      path: '/',
      name: 'login',
      component: LoginPage,
      beforeEnter: (to, from, next) => {
        let code = getQueryString('code');

        if(code!=null && code!='null' && code!='' ){

            verformLogin.verformLogin(code).then(res => {

              if (!res.success) {
                Dialog.alert({
                  title: '',
                  message: '未绑定企业微信，请先绑定企业微信'
                }).then(() => {
                  next({
                    path: '/bindUser', query: {
                      corpId: res.obj.corpId,
                      userId: res.obj.userId
                    }
                  })
                });
              } else {
                res.obj && setLocal('userInfo',JSON.stringify(res.obj))
                next({path: '/main'});
              }
            });
      }else{
           next();
        }
    }

    },
    {
      path: '/main',
      name: 'main',
      component: MainPage,
      redirect: '/main/book',
      children: [{
          path: 'apply',
          name:'mainApply',
          component: MainPageApply
        },
        {
          path: 'book',
          name: 'mainBook',
          component: MainPageBook
        },
        {
          path: 'trip',
          name:'mainTrip',
          component: MainPageTrip,
        },
        {
          path: 'me',
           name: 'MainMe',
          component: MainPageMe
        }
      ]
    },
    {
      path: '/planeSearch',
      name: 'planeSearch',
      component: PlaneSearch,
    },
    {
      path: '/domeSearchResult/:id',
      name: 'domeSearchResult',
      component: DomeSearchResult,
      props: true
    },
    {
      path: '/domeOrder',
      name: 'domeOrder',
      component: DomeOrder
    },
    {
      path: '/order',
      name: 'order',
      component: OrderList,
    },
    {
      path: '/orderDetailDome/:index/:detailId',
      name: 'orderDetailDome1',
      component: OrderDetailDome,
      props: true
    },
    {
      path: '/orderDetailInter/:detailId/:orderId',
      name: 'orderDetailInter',
      component: OrderDetailInter,
      props: true
    },
    {
      path: '/airportServer',
      // name: 'airportServer',
      component: airportServer
    },
    {
      path: '/airportActive',
      name:'airportActive',
      component: airportActive
    },
    {
      path: '/commonPage',
      name: 'commonPage',
      component: commonPage
    },
    {
      path: '/airportCustomer',
      // name:'aitportCustomer',
      component: airportCustomer
    },
    {
      path: '/airportSearchResult',
      name: 'airportSearchResult',
      component: airportSearchResult
    },
    {
      path: '/airportSearchDetail',
      name: 'airportSearchDetail',
      component: airportSearchDetail
    },{
      path: '/cityList/:id',
      name:'cityList',
      component:CityList,
      props: true
    },
    {
      path: '/TripOrderList',
      name: 'TripOrderList',
      component: TripOrderList,
      children:[
        {
        path: 'orderDetailDome/:detailId',
        name: 'orderDetailDome2',
        component: OrderDetailDome,
        props: true
        }
      ]
    },
    {
      path:'/tripApply',
      name:'tripApply',
      component:TripApply
    },
    {
      path:'/tripAdd',
      name:'tripAdd',
      component:TripAdd,
    },
    {
      path:'/tripChangeTraveler',
      name:'tripChangeTraveler',
      component:TripChangeTraveler
    },
    {
      path:'/tripPeerAdd',
      name:'tripPeerAdd',
      component:TripPeerAdd
    },
    {
      path:'/tripAttribution',
      name:'tripAttribution',
      component:TripAttribution
    },{
      path:'/tripCostBudget',
      name:'tripCostBudget',
      component:TripCostBudget
    },
    {
      path:'/tripCostBudgetStatic',
      name:'tripCostBudgetStatic',
      component:TripCostBudgetStatic
    },
    {
      path:'/tripapproval',
      name:'tripApproval',
      component:TripApproval,
    },
    {
      path:'/tripDetail',
      name:'tripDetail',
      component:TripDetail,
    },
    {
      path:'/tripopinion',
      component:TripOpinion
    },
    {
      path:'/error',
      name:'error',
      component:NotFound
    },
    {
      path: '*',
      redirect:'/error',
    },
    {
      path: '/bindUser',
      name: 'bindUser',
      component: BindingUser

    },
     //    me编辑
     {
        path: 'edit',
        name: 'Edit',
        component: Edit,
     },
     {//me管理
        path: 'manage',
        name: 'Manage',
        component: Manage,
     },
     {//me费用
        path: 'expenses',
        name: 'Expenses',
        component: Expenses,
     },
     {//me消息
        path: '/message',
        name: 'Message',
        component: Message,

     },
     {//me意见
        path: 'idea',
        name: 'Idea',
        component: Idea,
     },
     {//me关于我们
        path: 'about',
        name: 'About',
        component: About,
     },
     {//me表格trip
        path: 'meTrip',
        name: 'MeTrip',
        component: MeTrip,
     },
     {//me表格product
        path: 'meProduct',
        name: 'MeProduct',
        component: MeProduct,
     },
  //    apply页面
  //    报销申请ReiSement
     {
        path: '/reiSement',
        name: 'ReiSement',
        component: ReiSement,
     },
  //    报销审批ReiApproval
     {
        path: '/reiApproval',
        name: 'ReiApproval',
        component: ReiApproval,
     },
  //    报销申请详情页面

     {
        path: '/reiSementYesDetail',
        name: 'ReiSementYesDetail',
        component: ReiSementYesDetail,
     },
     // ReiOpinion
     {
        path: '/reiOpinion',
        name: 'ReiOpinion',
        component: ReiOpinion,
     },
     {//国际机票提交订单
        path: '/interDomeOrder',
        name: 'InterDomeOrder',
        component: InterDomeOrder,
     },

  ],




   // scrollBehavior (to, from, savedPosition) {
   //
   //   if (from.path==='/tripDetail'){
   //      console.log(123);
   //      return { x: 0, y: 0 }
   //   }
   //
   //
   // }

})
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
}
export default router;
