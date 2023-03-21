<template>
  <div class="chart-box" style="width: 100%;height: 100%;">
    <div class="top">
      <el-row :gutter="20" style="margin-left: 0;margin-right: 0;">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
          <el-card>
            <div class="card-desc">
              <div class="card-title">
                <el-icon>
                  <Coin/>
                </el-icon>
                访问量
              </div>
              <div class="card-count">{{ 2000 }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-card>
            <div class="card-desc">
              <div class="card-title">
                <el-icon>
                  <User/>
                </el-icon>
                用户量
              </div>
              <div class="card-count">{{ 2000 }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="0" :sm="12" :md="12" :lg="6" :xl="6">
          <el-card>
            <div class="card-desc">
              <div class="card-title">
                <el-icon>
                  <Memo/>
                </el-icon>
                文章量
              </div>
              <div class="card-count">{{ 2000 }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="0" :sm="12" :md="12" :lg="6" :xl="6">
          <el-card>
            <div class="card-desc">
              <div class="card-title">
                <el-icon>
                  <ChatLineRound/>
                </el-icon>
                留言量
              </div>
              <div class="card-count">{{ 2000 }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="chart" style="height: 300px;">
      <div id="viewChart" :style="{width: '100%',height: '100%'}">
      </div>
    </div>
  </div>

</template>
<script>
import {onMounted, onUnmounted} from "vue";
import echarts from "@/utils/echarts";
import store from "@/store";

export default {
  name: "Index",
  setup() {
    onMounted(() => {
      initChart();
    })
    // onUnmounted(() => {
    //   echart.dispose(document.getElementById("viewChart"))
    // })
    function initChart() {
      let chart = echarts.init(document.getElementById("viewChart"), "light");
      // 把配置和数据放这里
      chart.setOption({
        title: {
          x:'center',
          text: "每日浏览量",
          textStyle: {
            color: 'red',
          }
        },
        xAxis: {
          type: "category",
          data: [
            "3-13",
            "3-13",
            "3-13",
            "3-13",
            "3-13",
            "3-13",
            "3-13",
          ]
        },
        tooltip: {
          trigger: "axis"
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [
              820,
              932,
              901,
              934,
              1290,
              1330,
              1320,
            ],
            type: "line",
            smooth: true
          }
        ]
      });
      window.onresize = function () {
        chart.resize();
      };
    }
    return {

    }
  }
}
</script>

<style scoped lang="less">
.chart-box {
  .chart{
    padding: 15px;
    #viewChart{
      background-color: rgba(95, 158, 160, 0.7);
      border-radius: 20px;
    }
  }
  .top {
    margin: 0 5px 0 5px;
    .el-card {
      background-color: rgba(95, 158, 160, 0.7);
      box-shadow: 1px 1px 1px 1px rgba(95, 158, 160, 0.7);
      margin-top: 5px;
      margin-bottom: 5px;
    }

    .el-row {
      margin-top: 10px;

      .el-col {
        background-color: rgba(139, 183, 184, 0.2);
        border-radius: 15px;
      }

      .card-desc {
        display: flex;

        .card-title {
          font-weight: bold;
          font-size: 20px;
          flex: 1;
          line-height: 20px;
        }

        .card-count {
          text-align: right;
          font-size: 20px;
          flex: 1;
        }
      }
    }
  }
}
</style>
