import axios from 'axios';
import router from "@/router";
import {ElMessage} from 'element-plus'

export function request(config) {
  const instance = axios.create(
      {
        baseURL: "/api",
        timeout: 5000
      }
  );
  //请求拦截
  instance.interceptors.request.use(config => {
    const token = window.localStorage.getItem('token')
    if(token){
        config.headers.Authorization = 'Bearer '+ token;
    }else {
      router.push('/login')
    }
    // config.headers.Authorization = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIzM2M4MTk0NmYyNTc0OTA0OWIyNGVkNTgyOWEyZmNmNyIsInN1YiI6IjEiLCJpc3MiOiJzZyIsImlhdCI6MTY3OTkwMzcxNCwiZXhwIjoxNjc5OTA3MzE0fQ.nVdrWWrpQcs4XNsqvU1j24_Ou0vp2FfzaogXJWQvn0w'
    // 直接放行
    return config;
  }, err => {
  })

  //相应拦截
  instance.interceptors.response.use(res => {
    switch (res.data.code) {
      case 40001:
        ElMessage.error(res.data.message)
        router.push({path: "/login"});
        break;
      case 50000:
        ElMessage.error(res.data.message)
        break;
      // case 51000:
      //   ElMessage.error(res.data.message)
      //   break;
    }
    return res.data;
  }, error => {
    return error
  })
  return instance(config)
}

