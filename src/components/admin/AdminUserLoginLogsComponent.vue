<script setup>
import {useLogStore} from "@/stores/log";

const logStore = useLogStore();
const props = defineProps(['memNo']);

await logStore.getLoginLogs(props.memNo);
const logs = logStore.logs;

</script>

<template>
<!--  <div id="index_notice" class="wrapper-block">-->
<!--    <div class="inner">-->
<!--      <div class="inner-block">-->
<!--        <div class="content">-->
<!--          <div class="block-title-box">-->
<!--            <h2 class="block-title">회원 관리</h2>-->
<!--          </div>-->

          <div id="loginLogs">
            <h4>로그인 기록</h4>
            <table id="loginLogsTable">
              <thead>
              <tr>
                <th>시간</th>
                <th>IP</th>
                <th>결과</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="log in logs" :key="log.id">
                <td>{{log.regDate}}</td>
                <td>{{log.ip}}</td>
<!--                <td>{{log.memberIdentifier}}</td>-->
                <td>{{log.result}}</td>
              </tr>
              </tbody>
            </table>
          </div>
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
</template>

<style scoped>

</style>