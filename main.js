// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'Nguyen_Duc'

const player = $('.player');
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const progressCurrentTime = $(".progress-time__current-time");
const progressDuration = $(".progress-time__duration");
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')





const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [ 
    {
      name: "Có ai ở đây k",
      singer: "14CasperBon",
      path: "./assets/music/CoAiODayKhong-14CasperBon-6262416.mp3",
      image: "./assets/img/có ai ở đây k.jpg"
    },
    {
      name: "Gửi",
      singer: "Reddy",
      path: "./assets/music/Gui-ReddyHuuDuy-5688174.mp3",
      image: "./assets/img/Gửi.jpg"
    },
    {
      name: "Hẹn em ở lần thứ 2",
      singer: "NguyennDang x TuanVu",
      path: "./assets/music/HenEmOLanYeuThu2-NguyennDangTuanVu-8865500.mp3",
      image: "./assets/img/Hẹn em ở lần thứ 2.jpg"
    },
    {
      name: "Hơn cả mây trời",
      singer: "Như Việt",
      path: "/assets/music/HonCaMayTroiVuxLofi-NhuVietACV-8485619.mp3",
      image: "./assets/img/Hơn cả mây trời.jpg"
    },
    {
      name: "Mãi chẳng thuộc về nhau",
      singer: "Bozitt x FreakD",
      path: "./assets/music/MaiChangThuocVeNhauLofiVersion-BozittFreakD-6668232.mp3",
      image: "./assets/img/Mãi chẳng thuộc về nhau.jpg"
    },
    {
      name: "Như anh đã thấy em",
      singer: "PhucXP x Freak-D",
      path: "./assets/music/Nhu-Anh-Da-Thay-Em-PhucXP-Freak-D.mp3",
      image: "./assets/img/Như anh đã thấy em.jpg"
    },
    {
      name: "Nợ ai đó lời xin lỗi",
      singer: "Bozitt",
      path: "./assets/music/NoAiDoLoiXinLoi-Bozitt-6424600.mp3",
      image: "./assets/img/Nợ ai đó lời xin lỗi.jpg"
    },
    {
      name: "Suýt nữa thì",
      singer: "Andiez",
      path: "./assets/music/SuytNuaThi-Andiez-5524784.mp3",
      image: "./assets/img/Suýt nữa thì.jpg"
    }

  ],
  setConfig: function(key, value) { // 11. Save config when repeat or random
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
          <div class="song ${index === this.currentIndex ? 'active' :''}" data-index = "${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
    })
    playlist.innerHTML = htmls.join('')
  },

  defineProperties: function () {     // Định nghĩa các thuộc tính cho obj
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },

  handleEvents: function() {
      const _this = this;
      const cdWidth = cd.offsetWidth


      // Xử lý CD quay/ dừng
      const cdThumbAnimate = cdThumb.animate([
        { transform: 'rotate(360deg'}            // Quay 360 độ
      ], {
        duration: 10000,                      // Trong 10s
        iterations: Infinity,          // Quay Infinity vòng( vô hạn vòng)
      })
      cdThumbAnimate.pause()

      // Xử lý phóng to/ thu nhỏ CD

      // document.onscroll = function() { // onscroll là kéo thanh cuộn
      //   const scrollTop = window.scrollY || document.documentElement.scrollTop
      //   const newCdWidth = cdWidth - scrollTop  
      //   if (newCdWidth > 0) {                      
      //     cd.style.width = newCdWidth + 'px'
      //   } else { 
      //     cd.style.width = 0
      //   }
      //   cd.style.opacity = newCdWidth / cdWidth
      //   // cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
      // } 

      // Xử lý khi click play
      playBtn.onclick = function() {
        if (_this.isPlaying) {
          audio.pause()
        } else {
          audio.play()
        }
      }

      // Khi song được play
      audio.onplay = function() {
        _this.isPlaying = true
        player.classList.add('playing')
        cdThumbAnimate.play()
      }

      // Khi song bị pause
      audio.onpause = function() {
        _this.isPlaying = false
        player.classList.remove('playing')
        cdThumbAnimate.pause()
      }


      // Khi tiến độ bài hát thay đổi thì thanh progress thay đổi theo
      audio.ontimeupdate = function() {
        if(audio.duration) {
          const progressPercen = Math.floor(audio.currentTime / audio.duration * 100) // audio.currentTime là thời gian hiện tại của bài hát, audio.duration là tổng tgian bài hát
          progress.value = progressPercen

          //set durationTime và currentTime cho bài hát
          function currentTimeSong() {
            const time = audio.currentTime;
            const minutes = Math.floor(time / 60)
              .toString()
              .padStart(2, "0");
            const seconds = Math.floor(time - 60 * minutes)
              .toString()
              .padStart(2, "0");
              const finalTime = minutes + ":" + seconds
              return (finalTime);
          }
          function durationTimeSong( ) {
            const time = audio.duration;
            const minutes = Math.floor(time / 60)
              .toString()
              .padStart(2, "0");
            const seconds = Math.floor(time - 60 * minutes)
              .toString()
              .padStart(2, "0");
            const finalTime = minutes + ":" + seconds
            return (finalTime);
          }
          
          
          progressCurrentTime.textContent = currentTimeSong()
          progressDuration.textContent =  durationTimeSong()

          // const time = audio.duration;
          // const minutes = Math.floor(time / 60)
          //   .toString()
          //   .padStart(2, "0");
          // const seconds = Math.floor(time - 60 * minutes)
          //   .toString()
          //   .padStart(2, "0");
          // const durationTimenow = minutes + ":" + seconds

          // const time2 = audio.currentTime;
          // const minutes2 = Math.floor(time2 / 60)
          //   .toString()
          //   .padStart(2, "0");
          // const seconds2 = Math.floor(time2 - 60 * minutes2)
          //   .toString()
          //   .padStart(2, "0");
          // const currrenTimenow = minutes2 + ":" + seconds2

          // progressCurrentTime.textContent = currrenTimenow
          // progressDuration.textContent =  durationTimenow
        }
      }

      // Xử lý khi tua bài hát
      progress.oninput = function(e) {    // Giống như onchange
        const seekTimt = audio.duration / 100 * e.target.value
        audio.currentTime = seekTimt
      }


      // Khi next bài 
      nextBtn.onclick = function() {
        if (_this.isRandom) {
          _this.playRandomSong()
        } else if(_this.isRepeat) {
          _this.playRepeatSong()
        } else {
          _this.nextSong()
        }
        audio.play()      // Khi next bài nó sẽ dừng nên phải play lại
        _this.render()    // Render lại khi 8.active song
        _this.scrollToActiveSong() // Hàm khi Khi next song thì sẽ active vào song và đẩy thanh scrool lên (9)
      }

      //Khi prev bài  
      prevBtn.onclick = function() {
        if (_this.isRandom) {
          _this.playRandomSong()
        } else if(_this.isRepeat) {
          _this.playRepeatSong()
        } else {
          _this.prevSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      }

      // Khi click button random
      randomBtn.onclick = function(e) {
        _this.isRandom = !_this.isRandom
        _this.setConfig('isRandom', _this.isRandom)  // Lưu config random
        randomBtn.classList.toggle("active", _this.isRandom)
      }

      // Xử lý khi ấn nút lặp lại
      repeatBtn.onclick = function(e) {
        _this.isRepeat = !_this.isRepeat
        _this.setConfig('isRepeat', _this.isRepeat)     // Lưu config repeat
        repeatBtn.classList.toggle("active", _this.isRepeat)
      }

      // Xử lý khi kết thúc bài hát thì chuyển bài
      audio.onended = function() {
        nextBtn.click();  
      }

      // Lắng nghe hành vi click vào playlist
      playlist.onclick = function(e) {
        console.log(e.target.closest('.song:not(.active)'))
        const songNode = e.target.closest('.song:not(.active)');      // closest là trả về chính nó hoặc thẻ cha của nó
        if  (songNode || e.target.closest('.option')) {   // Nếu không phải là song active hoặc là option thì
            // Xử lý khi click vào song 
            if (songNode) {
              _this.currentIndex = Number(songNode.getAttribute('data-index'))   // lấy ra index
              _this.loadCurrentSong()
              _this.render()
              _this.scrollToActiveSong()
              audio.play()
            }

            // Xử lý khi click vào nút option
            if (e.target.closest('.option')){

            }
        }
             
      }
  },

  scrollToActiveSong: function() {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "center",
      })
    }, 5000);
  },

  loadCurrentSong: function(){
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url(' ${this.currentSong.image}')`
    audio.src = this.currentSong.path
  },

  loadConfig: function() {
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat
  },

  nextSong: function () {
    this.currentIndex++
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    } 
    this.loadCurrentSong()
  },

  prevSong: function () {
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length -1
    } 
    this.loadCurrentSong()
  },

  playRandomSong: function() {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    } while (newIndex === this.currentIndex)
      this.currentIndex = newIndex
      this.loadCurrentSong()
  },

  playRepeatSong: function() {
    let repeatIndex
    if (repeatIndex === this.currentIndex) {
      this.currentIndex = repeatIndex
    }
    this.loadCurrentSong()
  },

  // hàm lấy ra số phút của bài hát
  
  

  start: function () {
    // Gán cấu hình từ config vào ứng dụng
    this.loadConfig()

    // Định nghĩa các thuộc tính cho obj
    this.defineProperties()

    // Lăng nghe và xử lý sự kiện
    this.handleEvents()

    // Tải thông tin bài hát khi chạy ứng dụng
    this.loadCurrentSong()

    // render playlists
    this.render()

    // Hiển thị trạng thái ban đầu của load random vs repeat
    randomBtn.classList.toggle("active", this.isRandom)
    repeatBtn.classList.toggle("active", this.isRepeat)
  }
}

app.start()