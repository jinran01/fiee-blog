<template>
  <div>
    <transition name="dis_list">
      <div class="list_box" v-if="listIsDis" style="z-index: 1009;">
        <transition name="music_alert">
          <span class="music_alert" v-if="musicAlertState">{{
              musicAlertVal
            }}</span>
        </transition>
        <div class="list_close" @click="DisList">x</div>
        <div class="music_list">
          <div class="list_l">
            <ul class="music_type">
              <li
                  v-for="(item, index) in musicTypeList"
                  :key="index"
                  @click="_getMusicType(item.id)"
                  :class="{ type_active: item.id == thisMusicType }"
              >
                {{ item.name }}
              </li>
            </ul>
            <div class="list_title">
              <span style="font-size: 14px;">歌曲列表</span>
              <img
                  :src="musicStateButton"
                  alt=""
                  class="music_state"
                  @click="MusicStateChange"
              />
              <div class="music_search_box">
                <input
                    type="text"
                    class="music_search"
                    v-model="musicSearchVal"
                    placeholder="搜索歌曲"
                />
                <transition name="music_search">
                  <ul class="search_list" v-if="musicSearchVal != ''">
                    <li
                        v-for="(item, index) in musicSearchList"
                        :key="index"
                        @click="ListAdd(item)"
                    >
                      <span class="music_search_name">{{ item.name }}</span>
                      <span class="music_search_ar">{{
                          item.artists[0].name
                        }}</span>
                    </li>
                  </ul>
                </transition>
              </div>
            </div>
            <div class="music_ul_title">
              <span>歌曲</span><span>歌手</span><span>专辑</span>
            </div>
            <ul class="list">
              <li
                  v-for="(item, index) in thisMusicList"
                  :key="index"
                  @mouseover="ButtonActive(index)"
                  @dblclick="ListPlay((thisListPage - 1) * 10 + index)"
              >
                <div
                    class="this_music_shlter"
                    v-if="(thisListPage - 1) * 10 + index == thisMusicIndex"
                ></div>
                <span>{{ item.name }}</span
                ><span>{{ item.ar[0].name }}</span
              ><span>{{ item.al.name }}</span>
                <transition name="list_button">
                  <div
                      class="music_button"
                      v-if="listButtonActiveIndex == index"
                  >
                    <div
                        class="list_play"
                        title="播放这首歌"
                        :style="{ backgroundImage: 'url(' + listPlay + ')' }"
                        @click="ListPlay((thisListPage - 1) * 10 + index)"
                    ></div>
                    <div
                        class="list_play"
                        title="添加到 My Songs"
                        :style="{ backgroundImage: 'url(' + add + ')' }"
                        @click="ListAdd(item)"
                        v-if="thisMusicType != -1"
                    ></div>
                  </div>
                </transition>
              </li>
            </ul>
            <div class="list_page">
              <div
                  class="page_last"
                  v-if="thisListPage != 1"
                  @click="ListChange(true)"
              >
                &lt;
              </div>
              <div
                  class="page_next"
                  v-if="thisListPage != Math.ceil(musicList.length / 10)"
                  @click="ListChange(false)"
              >
                >
              </div>
            </div>
          </div>
          <div class="list_r">
            <img class="music_list_bg" :src="musicImg"/>
            <div
                class="music_list_shlter"
                :style="{ backgroundImage: 'url(' + shlter + ')' }"
            ></div>
            <ul class="music_talk_list">
              <li v-for="(item, index) in hotTalkList" :key="index">
                <div class="talk_head">
                  <img
                      :src="item.user.avatarUrl"
                      alt=""
                      class="talk_head_img"
                  />
                  <span class="talk_head_name">{{ item.user.nickname }}</span>
                </div>
                <p class="talk_content">
                  <img class="talk_icon_l" :src="talkicon1"/>
                  {{ item.content }}
                  <img class="talk_icon_r" :src="talkicon2"/>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
    <div class="bbox" :class="{ bbox_active: disActive }" style="z-index: 1010">
      <div
          class="pan"
          :style="{ backgroundImage: 'url(' + pan + ')' }"
          :class="{ pan_active: disActive }"
          @click="DisActive"
      >
        <img :src="musicImg" alt="" class="pan_c"/>
      </div>
      <div
          class="box"
          :style="{ backgroundImage: 'url(' + musicImg + ')' }"
          :class="{ box_active: disActive }"
          @dblclick="DisList"
      >
        <div
            class="music_shlter_2"
            :style="{ backgroundImage: 'url(' + musicImg + ')' }"
            :class="{ shlter_active: disActive }"
        ></div>
        <div
            class="music_shlter"
            :style="{ backgroundImage: 'url(' + musicImg + ')' }"
            :class="{ shlter_active: disActive }"
        ></div>
        <div class="music_shlter_3"></div>
        <div class="music_dis">
          <div class="dis_list" @click="DisList">···</div>
          <p class="music_title">{{ musicTitle }}</p>
          <p class="music_intro">歌手: {{ musicName }}</p>
          <ul class="music_words">
            <div class="music_words_box" :style="{ top: wordsTop + 'px' }">
              <li
                  v-for="(item, index) in musicWords"
                  :key="index"
                  class="music_word"
                  :class="{ word_highlight: wordIndex == index }"
              >
                {{ item }}
              </li>
            </div>
          </ul>
        </div>
        <div class="control_box">
          <div class="control_button">
            <img :src="playIcon" alt="" class="control_icon"/>
          </div>
          <div class="progress">
            <div class="progress_c" :style="{ width: currentProgress }">
              <div class="progress_circle">
                <div class="progress_circle_c"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <video
          id="music"
          autoplay="autoplay"
          :src="musicUrl"
          name="media"
      ></video>
    </div>
  </div>
</template>
<script>
import {
  getWords,
  getMusicInfo,
  getMusicUrl,
  getHotMusic,
  getSearchSuggest,
  getHotTalk
} from "./api/music";

import pan from "./img/pan.png";
import play from "./img/play.png";
import pause from "./img/pause.png";
import add from "./img/add.png";
import shlter from "./img/list_pan.png";
import listPlay from "./img/list_play_hover.png";
import state0 from "./img/state_0.png";
import state1 from "./img/state_1.png";
import talkicon1 from "./img/talkicon1.png";
import talkicon2 from "./img/talkicon2.png";
import $ from "jquery";
import {onMounted, reactive, toRefs} from "vue";

export default {
  name: "Player",
  setup() {
    let state = reactive({
      o: 0,
      top: 0,
      pan,
      play,
      pause,
      add,
      shlter,
      listPlay,
      state0,
      state1,
      talkicon1,
      talkicon2,
      playState: true,
      playIcon: pause,
      musicImg: "",
      musicUrl: "",
      musicWords: [],
      musicTitle: "",
      musicName: "",
      wordsTime: [],
      wordsTop: 0,
      wordIndex: 0,
      currentProgress: "0%",
      musicList: [],
      myMusicList: [], //存储在本地   可以开始判断有没有 让用户一开始就听这个列表
      thisMusicIndex: 1,
      disActive: false,
      listIsDis: false,
      listButtonActiveIndex: -1,
      thisListPage: 1,
      musicTypeList: [
        {name: "热歌榜", id: 3778678},
        {name: "新歌榜", id: 3779629},
        {name: "飙升榜", id: 19723756},
        {name: "嘻哈榜", id: 991319590},
        {name: "My Songs", id: -1}
      ],
      thisMusicType: -1,
      notPlay: [],
      musicState: 0, //0列表循环  1单曲循环
      musicStateButton: state1,
      musicSearchVal: "",
      musicSearchList: [],
      musicAlertVal: "",
      musicAlertState: false,
      musicAlertTimer: "",
      //新增歌词评论
      hotTalkList: []
    })
    //禁删~感谢配合
    const DisAuthorInfo = () => {
      console.log(
          "%c音乐播放器作者----仲威，博客地址：https://blogme.top",
          "background-color:rgb(30,30,30);border-radius:4px;font-size:12px;padding:4px;color:rgb(220,208,129);"
      );
    }
    const MusicAlert = (val) => {
      state.musicAlertState = true;
      state.musicAlertVal = val;
      clearTimeout(state.musicAlertTimer);
      state.musicAlertTimer = setTimeout(() => {
        state.musicAlertState = false;
        state.musicAlertVal = "";
      }, 2000);
    }
    const ListAdd = (obj)=>{
      getMusicInfo(obj.id).then(res => {
        state.musicSearchVal = "";
        if (state.myMusicList.length == 0) {
          state.myMusicList = [res.data.songs[0]];
          _getMusicType(-1);
          //第一次搜索直接播放
        } else {
          state.myMusicList.push(res.data.songs[0]);
          //提示已经添加进去
        }
        MusicAlert("添加成功");
      });
    }
    const MusicStateChange = ()=> {
      if (state.musicState == 0) {
        state.musicState = 1;
        state.musicStateButton = state.state0;
        MusicAlert("已切换为单曲循环模式");
      } else {
        state.musicState = 0;
        state.musicStateButton = state.state1;
        MusicAlert("已切换为列表循环模式");
      }
    }
    const DisList = ()=> {
      state.listIsDis = state.listIsDis ? false : true;
    }
    const ListChange = (isLast)=> {
      if (isLast) {
        state.thisListPage--;
      } else {
        state.thisListPage++;
      }
    }
    const ListPlay = (id) => {
      if (state.thisMusicIndex != id) {
        state.thisMusicIndex = id > state.musicList.length - 1 ? 0 : id;
        _getInfo();
        state.top = 0;
        state.o = 0;
        state.wordIndex = 0;
        state.wordsTop = 0;
        state.currentProgress = "0%";
        if (!state.playState) {
          $(".control_icon").click();
        }
      }
    }
    const ButtonActive = (id)=> {
      state.listButtonActiveIndex = id;
    }
    const DisActive = ()=> {
      state.disActive = state.disActive ? false : true;
    }
    const _getMusicType = (id) => {
      if (state.thisMusicType != id) {
        state.notPlay = [];
        if (id == -1) {
          if (state.myMusicList.length != 0) {
            state.musicList = state.myMusicList;
            state.thisMusicType = id;
            state.thisMusicIndex = 0;
            state.thisListPage = 1;
            _getInfo();
            state.top = 0;
            state.o = 0;
            state.wordIndex = 0;
            state.wordsTop = 0;
            state.currentProgress = "0%";
            if (!state.playState) {
              $(".control_icon").click();
            }
          } else {
            //自定义库没有歌曲 提示需要搜索才可以添加
            MusicAlert("没有歌曲,需要自己添加");
          }
        } else {
          getHotMusic(id).then(res => {
            state.musicList = res.data.playlist.tracks.splice(0, 200);
            state.thisMusicType = id;
            state.thisMusicIndex = 0;
            state.thisListPage = 1;
            _getInfo();
            state.top = 0;
            state.o = 0;
            state.wordIndex = 0;
            state.wordsTop = 0;
            state.currentProgress = "0%";
            if (!state.playState) {
              $(".control_icon").click();
            }
          });
        }
      }
    }
    const _getInfo = ()=> {
      getMusicUrl(state.musicList[state.thisMusicIndex].id).then(res => {
        if (
            res.data.data[0].url == null ||
            res.data.data[0].url == "" ||
            res.data.data[0].url == undefined
        ) {
          if (state.notPlay.length != state.musicList.length) {
            let nextIndex = state.thisMusicIndex + 1;
            if (state.notPlay.indexOf(state.thisMusicIndex) == -1) {
              state.notPlay.push(state.thisMusicIndex);
            }
            MusicAlert(
                `${state.musicList[state.thisMusicIndex].name}因为一些原因不能播放`
            );
            ListPlay(nextIndex); //寻找下一首歌  直到找到

            //提示这首歌不能放
          } else {
            //遍历完没有找到
            console.log("not");
            MusicAlert("此列表所有歌都不能播放");
          }
        } else {
          state.musicUrl = res.data.data[0].url.replace("http://", "https://");
          state.musicImg =
              state.musicList[state.thisMusicIndex].al.picUrl.replace(
                  "http://",
                  "https://"
              ) + "?param=300y300";
          state.musicTitle = state.musicList[state.thisMusicIndex].name;
          let name_arr = [];
          state.musicList[state.thisMusicIndex].ar.forEach(i => {
            name_arr.push(i.name);
          });
          state.musicName = name_arr.join("/");
          getWords(state.musicList[state.thisMusicIndex].id).then(res => {
            if (!res.data.nolyric) {
              let info = Cut(res.data.lrc.lyric);
              state.musicWords = info.wordArr;
              state.wordsTime = info.timeArr;
            }
          });
          getHotTalk(state.musicList[state.thisMusicIndex].id).then(res => {
            let count = 0;
            state.hotTalkList = res.data.hotComments.splice(0, 3);
            state.hotTalkList.forEach(e => {
              count += e.content.length;
              e.user.avatarUrl = e.user.avatarUrl + "?param=50y50";
            });
            if (count >= 200) {
              state.hotTalkList = state.hotTalkList.slice(0, 2);
            }
          });
        }
      });
    }
    const Ltrim = (s)=> {
      return s.replace(/(^\s*)/g, "");
    }
    const Rtrim = (s)=> {
      return s.replace(/(\s*$)/g, "");
    }
    //歌词截取函数
    const Cut = (str) => {
      let timeArr = [];
      let wordArr = [];
      timeArr = str.split("[");
      timeArr.splice(0, 1);
      for (let i = 0; i < timeArr.length; i++) {
        let cut = timeArr[i].split("]");
        let time = cut[0].split(".")[0].split(":");
        timeArr[i] = Number.parseInt(time[0]) * 60 + Number.parseInt(time[1]);
        timeArr[i] = isNaN(timeArr[i]) ? 0 : timeArr[i]; //处理NaN
        wordArr[i] = Rtrim(Ltrim(cut[1]));
      }
      return {timeArr: timeArr, wordArr: wordArr};
    }
    const Player = () => {
      let player = $("#music")[0];
      console.log(player)
      const timer = () => {
        state.currentProgress = (player.currentTime / player.duration) * 100 + '%'
        //接着这里写歌词滚动
        if (player.currentTime >= state.wordsTime[state.o + 1]) {
          state.top += Number.parseInt(
              $(".music_word")
                  .eq(state.o)
                  .height() +
              Number.parseInt(
                  $(".music_word")
                      .eq(state.o)
                      .css("marginTop")
              )
          );
          if (state.top >= $(".music_words").height() / 2 - 11) {
            //开始滚动的高度
            state.wordsTop += -Number.parseInt(
                $(".music_word")
                    .eq(state.o)
                    .height() +
                Number.parseInt(
                    $(".music_word")
                        .eq(state.o)
                        .css("marginTop")
                )
            );
          }
          state.wordIndex = state.o + 1;
          state.o++;
        }
        if (player.currentTime >= player.duration) {
          //切歌
          if (state.musicList.length != 1) {
            //只有一首歌  重复播放
            if (state.musicState == 0) {
              state.thisMusicIndex =
                  state.thisMusicIndex >= state.musicList.length - 1
                      ? 0
                      : state.thisMusicIndex + 1;
              _getInfo();
            }
          }
          player.play();
          state.top = 0;
          state.o = 0;
          state.wordIndex = 0;
          state.wordsTop = 0;
          state.currentProgress = "0%";
        }
      }
      let playerTimer = setInterval(timer, 1000);
      $(".control_icon").click();
      //定时器函数
      $("body").on("click", () => {
        player.play();
        $("body").unbind("click");
      });
      //进度条控制
      $(".progress").on("mousedown", ev => {
        let e = ev || event;
        let pro =
            (e.clientX - $(".progress").offset().left) / $(".progress").width();
        clearInterval(playerTimer);
        state.currentProgress = `${pro * 100}%`;
        $(document).on("mousemove", ev => {
          let e = ev || event;
          pro =
              (e.clientX - $(".progress").offset().left) / $(".progress").width();
          state.currentProgress = `${pro * 100}%`;
        });
        $(document).on("mouseup", () => {
          player.currentTime = player.duration * pro;
          let c_arr = [...state.wordsTime];
          c_arr.push(player.currentTime);
          c_arr.sort((l, r) => {
            return l - r;
          });
          let now_o = c_arr.indexOf(player.currentTime) - 1;
          let diff_h = 0;
          if (state.o < now_o) {
            for (let i = state.o; i < now_o; i++) {
              diff_h += -Number.parseInt(
                  $(".music_word")
                      .eq(i)
                      .height() +
                  Number.parseInt(
                      $(".music_word")
                          .eq(i)
                          .css("marginTop")
                  )
              );
            }
          } else {
            for (let i = now_o; i < state.o; i++) {
              diff_h += Number.parseInt(
                  $(".music_word")
                      .eq(i)
                      .height() +
                  Number.parseInt(
                      $(".music_word")
                          .eq(i)
                          .css("marginTop")
                  )
              );
            }
          }
          state.wordsTop += diff_h;
          state.wordIndex = state.o = now_o;
          clearInterval(playerTimer);
          playerTimer = setInterval(timer, 1000);
          state.playState = true;
          state.playIcon = state.pause;
          if (player.currentTime >= player.duration) {
            state.top = 0;
            state.o = 0;
            state.wordIndex = 0;
            state.wordsTop = 0;
            state.currentProgress = "0%";
          }
          player.play();
          $(document).unbind("mousemove");
          $(document).unbind("mouseup");
        });
      });
      //播放暂停按钮控制
      $(".control_icon").on("click", () => {
        if (state.playState) {
          player.pause();
          state.playState = false;
          state.playIcon = state.play;
          clearInterval(playerTimer);
        } else {
          player.play();
          state.playState = true;
          state.playIcon = state.pause;
          clearInterval(playerTimer);
          playerTimer = setInterval(timer, 1000);
        }
      });
    }
    const Contorl = () => {
      let player = $("#music")[0];
      player.currentTime = 100;
    }
    onMounted(()=>{
      _getMusicType(3779629);
      Player();
      DisAuthorInfo(); //禁删~感谢配合
    })
    return {
      ...toRefs(state),
      DisAuthorInfo,
      MusicAlert,
      ListAdd,
      MusicStateChange,
      DisList,
      ListChange,
      ButtonActive,
      ListPlay,
      DisActive,
      _getMusicType,
      _getInfo,
      Ltrim,
      Rtrim,
      Cut,
      Player,
      Contorl,
    }
  },
  computed: {
    thisMusicList() {
      return [...this.musicList].splice((this.thisListPage - 1) * 10, 10); //分页
    }
  },
  watch: {
    musicSearchVal() {
      if (this.musicSearchVal == "") {
        this.musicSearchList = [];
      } else {
        getSearchSuggest(this.musicSearchVal).then(res => {
          if (res.data.result.songs == undefined) {
            this.musicSearchList = [];
          } else {
            this.musicSearchList = res.data.result.songs;
          }
        });
      }
    }
  },
};
</script>
<style scoped>
@import url("./player.css");
@import url("./playermobile.css");
</style>
