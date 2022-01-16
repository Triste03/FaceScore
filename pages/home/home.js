// pages/home/home.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,
    cameraForward: "back",
    photoPath: '',
    isShow: false,
    faceInfo: null,
    map: {
      gender: {
        male: "男",
        female: "女"
      },
      expression: {
        none: "不笑",
        smile: "微笑",
        laugh: "大笑"
      },
      emotion: {
        angry: "愤怒 ",
        disgust: "厌恶",
        fear: "恐惧",
        happy: "高兴 ",
        sad: "伤心 ",
        surprise: "惊讶",
        neutral: "无表情",
        pouty: "撅嘴",
        grimace: "鬼脸"
      },
      glasses: {
        none: "无眼镜",
        common: "普通眼镜",
        sun: "墨镜"
      }
    },
    isShowBox: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const info = wx.getSystemInfoSync()
    const wHeight = info.windowHeight;
    this.setData({
      winHeight: wHeight
    })

  },
  reverseCamera() {
    const newCameraForward = this.data.cameraForward === "front" ? "back" : "front";
    this.setData({
      cameraForward: newCameraForward
    })
  },
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          photoPath: res.tempImagePath,
          isShow: true
        }, () => {
          this.getFaceInfo()
        })
      },
      fail: () => {
        console.log("拍照失败");
        this.setData({
          photoPath: ""
        })
      }
    })
  },
  choosePhoto() {
    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      sizeType: ['original'],
      success: (res) => {
        // console.log(res);
        if (res.tempFilePaths.length > 0) {
          this.setData({
            photoPath: res.tempFilePaths[0],
            isShow: true
          }, () => {
            this.getFaceInfo()
          })
        }
      },
      fail: () => {
        // console.log("未选择照片！");
        this.setData({
          photoPath: "",
          isShow: false,
          isShowBox: false
        })
      }
    })
  },
  reChoose() {
    this.choosePhoto();
  },
  backPhoto() {
    this.setData({
      isShow: false
    })
  },
  getFaceInfo() {
    // console.log(app.globalData);
    const token = app.globalData.access_token;
    if (!token) {
      wx.showToast({
        title: '鉴权失败',
      })
    }
    wx.showLoading({
      title: '颜值检测中...',
    })
    const fileManager = wx.getFileSystemManager()
    const fileStr = fileManager.readFileSync(this.data.photoPath, "base64");
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/face/v3/detect?access_token=' + token,
      method: "POST",
      header: {
        "Content-Type": "application/json"
      },
      data: {
        image_type: "BASE64",
        image: fileStr,
        face_field: "age,expression,beauty,gender,glasses,emotion"
      },
      success: (res) => {
        // console.log(res);
        if (res.data.result.face_num <= 0) {
          wx.showToast({
            title: '未检测到人脸',
          })
        }
        this.setData({
          faceInfo: res.data.result.face_list[0],
          isShowBox: true
        })
      },
      fail: () => {
        wx.showToast({
          title: '颜值检测失败',
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})