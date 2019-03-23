<template>
    <div>
        <HeaderTitle title="关于我们" :btnLeft="true" :btnRight="false" className="fa-plus" @back="fanhTap"/>
        <div class="content">
            <img src="./about_logo.png" alt="">
            <div>“航行家”是广州白云国际机场商旅服务有限公司和广东机场白云信息科技有限公司共同打造的差旅管理服务平台。旨在为公务出行用户提供更便捷、更高性价比的出行服务，从行程计划到报销管理全过程都高效执行!</div>
        </div>
    </div>
</template>

<script>
    import HeaderTitle from "components/HeaderTitle/HeaderTitle";
    export default {
        name: "MainPageMeAbout",
        components:{
            HeaderTitle
        },
        methods:{
            fanhTap(){
                this.$router.push({name:'MainMe'})
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .content{
        /*height: 300px;*/
        width: 100%;
    }

    .content img{
        width: 1.6rem;
        margin: 30px auto;
    }
    .content p{
        text-align: center;
    }
    .content div{
        font-size: 0.32rem;
        padding: 30px 40px;
    }
</style>