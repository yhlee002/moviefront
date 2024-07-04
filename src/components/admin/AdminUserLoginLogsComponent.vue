<script setup>
import {useLogStore} from "@/stores/log.js";

const logStore = useLogStore();
const props = defineProps(['memNo']);

await logStore.getLoginLogs(props.memNo);
const logs = logStore.logs;

</script>

<template>
  <div id="loginLogs">
    <!--    <h4>로그인 기록</h4>-->
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
        <td>{{ log.regDate }}</td>
        <td>{{ log.ip }}</td>
        <!--                <td>{{log.memberIdentifier}}</td>-->
        <td>{{ log.result }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
#loginLogs, #loginLogsTable {
  width: 100%;
}

#loginLogs {
  display: flex;
  justify-content: center;
}

#loginLogsTable {
  max-width: 40rem;
}
</style>