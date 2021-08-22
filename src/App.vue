<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div v-if="admin==false">
        <span @click="loginModal=true"> <button class="btn btn-success">Admin Login</button></span>
      </div>
      <div v-if="admin==false">
        <div v-if="loginModal==true">
          <input  v-model="formdata.email" type="email" placeholder="email" >
          <input  v-model="formdata.password" type="password" placeholder="password" >
          <button @click="attemptToLogin" class="btn btn-primary">Submit</button>
        </div>
      </div>
      <div v-if="admin==true">
        <span @click="logout"> <button class="btn btn-danger">Logout</button></span>
      </div>
    </nav>
    
    <header class="header">
      <div class="navbar-brand">
        <img alt="Vue logo" src="./assets/logo.png">
      </div>

      <div class="navbar-brand-name">
        <h1 class="title">Video Recording Task</h1>
        <h2 class="subtitle">
          Human Capital Group, WLL Doha, Qatar
        </h2>
        <h3>Author: MD Amran,
          Software Developer,
          YO Tech Limited
        </h3>
      </div>
    </header>

    <main class="container has-text-centered">
      <section id="example-video">
        <div class="columns">
          <div class="column">
            <div class="has-text-right">
              <h3 class="title is-3">Recording video files</h3>
              <p class="subtitle">Simply <strong>{{recordMode.video}}</strong> the button to record a video clip</p>
            </div>

            <div class="record-settings">
              <vue-record-video mode="press" @stream="onVideoStream" @result="onVideoResult" />
              <!-- <div class="field">
                <label class="label">Mode</label>
                <div class="select">
                  <select v-model="recordMode.video">
                    <option value="press">Press</option>
                    <option value="hold">Hold</option>
                  </select>
                </div>
              </div> -->
            </div>
          </div>
          <div class="column">
            <div class="recorded-video">
              <video muted ref="Video" width="400" height="250" controls></video>
            </div>
            <div v-if="videoExist">
              <span ref="file" @click="uploadTheVideo">Download</span>
              <div v-if="videoExist2">
                <Upload
                ref="upload"
               :headers="crfObj"
                :on-success="handleImageUpload"
                 name="fileup" action="https://video-backend-amran.herokuapp.com/api/single-file">
                  <Button icon="ios-cloud-upload-outline">Upload file</Button>
                </Upload>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <main v-if="admin==true" class="container has-text-centered">
      <button @click="seeAllVideos" class="btn btn-danger">See All Video</button>
      <table v-if="seeAll==true" class="table">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">User Info</th>
      <th scope="col">Video</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in recordings" :key="index">
      <th scope="row" >{{item.id}}</th>
      <td>{{item.user_info}}</td>
      <td>
        <video :src="item.data" width="400" height="250" controls></video>
      </td>

    </tr>
  </tbody>
</table>
    </main>
    
  </div>
</template>

<script>
const axios = require("axios");
export default {
  name: 'app',
  data () {
    return {
      seeAll:false,
      videoExist: false,
      admin: false,
      videoExist2: false,
      loginModal: false,
      formdata: {
        email:"",
        password:""
      },
       file: '',
      recordMode: {
        video: 'press'
      },
      recordings: [],
      crfObj: {
        "X-CSRF-TOKEN": document
          .querySelector('meta[name="csrf-token"]')
      },
      headers: {headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }}
    }
  },
  methods: {

    onVideoStream (stream) {
      console.log('Got a video stream object:', stream);
      this.$refs.Video.srcObject = stream;
      this.$refs.Video.play();
    },

    async submitFile(){
          let formData = new FormData();
          formData.append('fileup', this.file);
          let fd = await axios.post('https://video-backend-amran.herokuapp.com/api/single-file',
              formData,
              {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
            }
          );
          if(fd.data){
            alert("Video uploaded successfully")
          }else{
            alert("Video upload failed")
          }
          
      
    },


    async handleImageUpload(res) {
			if (res) {
				let up = await axios.post("https://video-backend-amran.herokuapp.com/api/single-file-store",{data:"https://video-backend-amran.herokuapp.com"+res}, this.headers);
        if(up.status == 200){
          console.log("success")
        }

			}
		
		},

    onVideoResult (data) {
      this.$refs.Video.srcObject = null
      this.$refs.Video.src = window.URL.createObjectURL(data)
      this.videoExist = true
    },
    uploadTheVideo(){
      const url = this.$refs.Video.src;
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    // the filename you want
    let y = url.split("blob:https://video-frontend-amran.herokuapp.com/")[1];
    a.download = y+'.mp4';
    document.body.appendChild(a);
    a.click();
      this.videoExist2 = true
    },
    async attemptToLogin(){
      if(this.formdata.email == ""){
        return alert("Enter Email")
      }
      if(this.formdata.password == ""){
        return alert("Enter Password")
      }
      let login = await axios.post("https://video-backend-amran.herokuapp.com/api/login", this.formdata,this.headers );
      if(login.status == 200){
        if(login.data.msg === "success"){
          localStorage.setItem("loggedin", "yes");
          location.reload();
        }else{
          localStorage.setItem("loggedin", "no");
          alert("Login failed")
        }
      }
    },
    async seeAllVideos(){
      this.seeAll = true
      let res = await axios.get("https://video-backend-amran.herokuapp.com/api/get-all-video",this.headers);
      if(res.status == 200){
        if(res.data.msg === "success"){
          this.recordings = res.data.video
        }else{
          alert(res.data.msg)
        }
      }
    },
    logout(){
      localStorage.setItem("loggedin", "no");
      location.reload();
    }
    
  },
  created(){
    this.admin = localStorage.getItem("loggedin") === "yes" ? true : false
  }
}
</script>

<style lang="scss">
html, body, #app {
  width: 100%;
  height: 100%;
}
#app {
  display: flex;
  flex-direction: column;
  main{
    height: 100%;
  }

  strong, a {
    color: #41b883 !important;
  }

  section {
    margin: 40px 0;
  }
}

.header {
  padding: 20px 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  .navbar-brand img {
    height: 64px;
    margin-right: 20px;
    width: 64px;
  }
}

.vue-audio-recorder, .vue-video-recorder {
  margin-right: 16px;
}

.record-settings {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.recorded-audio {
  margin: 0 auto;
  height: 200px;
  overflow: auto;
  border: thin solid #eee;
  background-color: #f7f7f7;
  padding: 10px 5px;
  .recorded-item {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  .audio-container {
    display: flex;
    height: 54px;
    margin-right: 16px;
  }
}

.recorded-video {
  video {
    width: 100%;
    max-height: 400px;
  }
}

.footer {
  background-color: #eee;
}
</style>
