<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav-bar" @titleClick="titleClick" ref="nav"/>

    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
<!--      <ul>-->
<!--        <li v-for="item in $store.state.cartList">{{item}}</li>-->
<!--      </ul>-->
      <detail-swiper :top-images="topImages" name="Detail" />
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="param" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommend"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
import GoodsList from "@/components/content/goods/GoodsList";
import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";
import BackTop from "@/components/content/backTop/BackTop";

import Scroll from "@/components/common/scroll/Scroll";

import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "@/network/detail";
import {debounce} from "@/common/utils";


export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    BackTop,
    Scroll
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommend: [],
      themeTopYs: [],
      getThemeTopYs: null,
      currentIndex: 0,
      isShowBackTop: false
    }
  },
  created() {
    // 保存传入的iid
    // console.log(this.$route.params)
    this.iid = this.$route.params.iid

    // 根据iid请求详情页的数据
    getDetail(this.iid).then(res => {
      // console.log(res)
      const data = res.result;
      // 1.获取顶部图片轮播数据
      this.topImages = data.itemInfo.topImages

      // 2.获取商品信息
      this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

      // 3.创建商店信息对象
      this.shop = new Shop(data.shopInfo)

      // 4.获取商品详细信息
      this.detailInfo = data.detailInfo

      // 5.获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

      // 6.获取评价信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
    })

    // 请求详情中推荐图片
    getRecommend().then(res => {
      // console.log(res)
      this.recommend = res.data.list
    })

    // 给getThemeTopYs赋值
    this.getThemeTopYs = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.param.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      this.themeTopYs.push(Number.MAX_VALUE)

      // console.log(this.themeTopYs)
    },100)
  },
  mounted() {
    // 1.监听item中图片加载完成
    const refresh =
      debounce(this.$refs.scroll.refresh, 500)
    this.$bus.$on('detailItemImageLoad', () => {
      refresh()
    })
  },
  methods: {
    imageLoad() {
      // 监听详情图片加载完成
      this.$refs.scroll.refresh()
      this.getThemeTopYs()
    },
    titleClick(index) {
      // console.log(index)
      // 点击标题滚到对应内容
      this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
    },
    contentScroll(position) {
      // 获取y值
      const positionY = -position.y

      let length = this.themeTopYs.length
      for (let i = 0; i < length-1; i++) {
        // hack方法 需要 this.themeTopYs.push(Number.MAX_VALUE)
        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
          this.currentIndex = i ;
          this.$refs.nav.currentIndex  = this.currentIndex
        }

        this.isShowBackTop = (-position.y) > 1000
        // 简单方法
        // if (this.currentIndex !== i &&((i < length - 1 && positionY >= this.themeTopYs[i] &&
        //   positionY < this.themeTopYs[i+1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))){
        //   this.currentIndex = i ;
        //   this.$refs.nav.currentIndex  = this.currentIndex
        // }
      }
    },
    backClick() {
      this.$refs.scroll.scrollTo(0,0)
    },
    addToCart() {
      // 获取购物车需要展示的数据
      const product = {};

      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      // console.log()

      this.$store.dispatch('addCart',product).then(res => {
          this.$toast.show()
        console.log(this.$toast.show)
      })
    }
  }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #ffffff;
    height: 100vh;
  }

  .detail-nav-bar {
    position: relative;
    z-index: 9;
    background-color: #ffffff;
  }

  .content {
    height: calc(100% - 44px - 49px);
  }
</style>
