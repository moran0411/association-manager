<script setup>

import LoginVue from "@/views/Login.vue";
import LayoutVue from "@/views/Layout.vue";
</script>

<template>
   <router-view></router-view>
</template>

<style scoped>
</style>

<!-- 
<template>
   <div ref="chartRef" style="width: 100%; height: 400px;"></div>
 </template>
 
 <script setup>
 import { ref, onMounted, watch } from 'vue';
 import * as echarts from 'echarts';
 
 // 定义图表容器的引用
 const chartRef = ref(null);
 
 // 定义响应式数据
 const chartData = ref({
   xAxisData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
   seriesData: [120, 200, 150, 80, 70, 110, 130],
 });
 
 // 定义 ECharts 实例
 let chartInstance = null;
 
 // 初始化图表
 onMounted(() => {
   chartInstance = echarts.init(chartRef.value);
   updateChart();
 });
 
 // 更新图表的方法
 function updateChart() {
   const option = {
     xAxis: {
       type: 'category',
       data: chartData.value.xAxisData,
     },
     yAxis: {
       type: 'value',
     },
     series: [
       {
         data: chartData.value.seriesData,
         type: 'bar',
       },
     ],
   };
   chartInstance.setOption(option);
 }
 
 // 监听 chartData 的变化，自动更新图表
 watch(
   () => chartData.value,
   () => {
     updateChart();
   },
   { deep: true }
 );
 
 // 动态更新数据的方法
 function updateData() {
   chartData.value = {
     xAxisData: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
     seriesData: [100, 150, 200, 250, 300, 350, 400],
   };
 }
 </script> -->