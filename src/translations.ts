export interface TranslationSchema {
  hero: {
    saveDate: string;
    weAreMarried: string;
    names: string;
    datePlace: string;
    scrollText: string;
    countdownDays: string;
    countdownHours: string;
    countdownMinutes: string;
    countdownSeconds: string;
    countdownCelebrating: string;
  };
  details: {
    joinCelebration: string;
    title: string;
    byDate: string;
    attendBtn: string;
    calendar: {
      buttonText: string;
      google: string;
      apple: string;
      outlook: string;
      downloadIcs: string;
    };
    cards: {
      when: {
        title: string;
        dateLabel: string;
        dateVal: string;
        timelineLabel: string;
        item1: string;
        item2: string;
        item3: string;
        item4: string;
      };
      where: {
        title: string;
        venueLabel: string;
        venueVal: string;
        addressVal: string;
        mapLink: string;
        wazeLink: string;
      };
    };
  };
  dressCode: {
    aesthetic: string;
    title: string;
    subtitle: string;
    ladies: {
      title: string;
      desc: string;
      bullet1: string;
      bullet2: string;
      bullet3: string;
    };
    gentlemen: {
      title: string;
      desc: string;
      bullet1: string;
      bullet2: string;
      bullet3: string;
    };
  };
  rsvp: {
    accept: string;
    yourReply: string;
    attending: string;
    notAttending: string;
    guest: string;
    guests: string;
    vegetarian: string;
    standard: string;
    change: string;
    needInviteTitle: string;
    needInviteBody: string;
  };
  modal: {
    title: string;
    subtitle: string;
    fullName: string;
    phone: string;
    guestCount: string;
    email: string;
    emailOptional: string;
    dietChoice: string;
    dietVegetarian: string;
    dietNonVegetarian: string;
    submit: string;
    submitting: string;
  };
  toast: {
    title: string;
    thankYou: string;
    registered: string;
    person: string;
    people: string;
    footer: string;
    close: string;
  };
  footer: {
    copyright: string;
    designed: string;
    register: string;
  };
}

export const translations: Record<"en" | "cn", TranslationSchema> = {
  en: {
    hero: {
      saveDate: "Save our Date",
      weAreMarried: "We are married",
      names: "Eva & Vincent",
      datePlace: "January 2, 2027 • Chuai Heng Banquet Hall, Kuala Lumpur",
      scrollText: "Scroll",
      countdownDays: "Days",
      countdownHours: "Hours",
      countdownMinutes: "Mins",
      countdownSeconds: "Secs",
      countdownCelebrating: "The Celebration Has Begun! ✨",
    },
    details: {
      joinCelebration: "Join Our Celebration",
      title: "The Wedding Details",
      byDate: "Kindly respond by November 1, 2026",
      attendBtn: "Reply to the Invitation",
      calendar: {
        buttonText: "Add to Calendar",
        google: "Google Calendar",
        apple: "Apple / Yahoo (ICS)",
        outlook: "Outlook Web",
        downloadIcs: "Download .ics File",
      },
      cards: {
        when: {
          title: "When",
          dateLabel: "Date",
          dateVal: "Saturday, January 2, 2027",
          timelineLabel: "Timeline",
          item1: "06:00 PM — Photo Session",
          item2: "07:00 PM — Ceremony Begins",
          item3: "10:00 PM — Dinner Ends & Thank You",
          item4: "10:30 PM — Farewell",
        },
        where: {
          title: "Where",
          venueLabel: "Venue",
          venueVal: "Chuai Heng Banquet Hall",
          addressVal: "20, Jalan Kampung, Imbi, 55100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
          mapLink: "View on Google Maps →",
          wazeLink: "View on Waze →",
        },
      },
    },
    dressCode: {
      aesthetic: "The Aesthetic",
      title: "Dress Code",
      subtitle: '"Formal & Elegant — We look forward to celebrating in style with you."',
      ladies: {
        title: "Ladies",
        desc: "We invite you to wear elegant floor-length evening gowns or sophisticated midi cocktail dresses.",
        bullet1: "• Fine fabrics like silk, chiffon, or crepe are highly recommended",
        bullet2: "• Warm summer tones or elegant pastels blend perfectly with the venue",
        bullet3: "• Please avoid pure white, ivory, or cream attire",
      },
      gentlemen: {
        title: "Gentlemen",
        desc: "We invite you to wear a formal dark tuxedo or a classic tailored suit with a crisp white shirt.",
        bullet1: "• Complete your look with a refined necktie or a bow tie",
        bullet2: "• Oxford shoes or elegant leather loafers are appropriate",
        bullet3: "• Classic tones such as charcoal, navy blue, or black suit best",
      },
    },
    rsvp: {
      accept: "Reply to the Invitation",
      yourReply: "Your reply",
      attending: "You're joining us",
      notAttending: "You can't make it",
      guest: "guest",
      guests: "guests",
      vegetarian: "Vegetarian",
      standard: "Standard meal",
      change: "Need to change something?",
      needInviteTitle: "Invitation link needed",
      needInviteBody:
        "Replies are tied to a personal invitation link. Message us and we'll send yours over.",
    },
    modal: {
      title: "Your Reply",
      subtitle: "Let us know you're coming",
      fullName: "Full Name",
      phone: "Phone Number",
      guestCount: "Number of Guests",
      email: "Email Address",
      emailOptional: "(optional)",
      dietChoice: "Dietary Preference",
      dietVegetarian: "Vegetarian 🌱",
      dietNonVegetarian: "Standard Meal",
      submit: "Send Reply",
      submitting: "Sending your reply…",
    },
    toast: {
      title: "Submitted!",
      thankYou: "Thank you",
      registered: "Your response for",
      person: "person",
      people: "people",
      footer: "We can't wait to see you!",
      close: "Close",
    },
    footer: {
      copyright: "Eva & Vincent • January 2, 2027",
      designed: "Designed with love for our friends and family.",
      register: "Guest Register",
    },
  },
  cn: {
    hero: {
      saveDate: "婚礼邀约",
      weAreMarried: "我们结婚了",
      names: "Eva 和 Vincent",
      datePlace: "2027年1月2日 • 翠恒酒家, 吉隆坡",
      scrollText: "向下滑动",
      countdownDays: "天",
      countdownHours: "时",
      countdownMinutes: "分",
      countdownSeconds: "秒",
      countdownCelebrating: "庆典已经开始！✨",
    },
    details: {
      joinCelebration: "期待您的莅临",
      title: "婚礼详情",
      byDate: "请于 2026年11月1日前 回复答复",
      attendBtn: "回覆邀请",
      calendar: {
        buttonText: "添加到日历",
        google: "谷歌日历",
        apple: "苹果 / 雅虎 (ICS)",
        outlook: "Outlook 日历",
        downloadIcs: "下载 .ics 日历文件",
      },
      cards: {
        when: {
          title: "时间安排",
          dateLabel: "日期",
          dateVal: "2027年1月2日 星期六",
          timelineLabel: "流程安排",
          item1: "晚上 06:00 — 拍照环节",
          item2: "晚上 07:00 — 婚礼仪式开始",
          item3: "晚上 10:00 — 晚宴结束 · 答谢来宾",
          item4: "晚上 10:30 — 送客离场",
        },
        where: {
          title: "婚礼场地",
          venueLabel: "场地",
          venueVal: "翠恒酒家（宴会厅）",
          addressVal: "20, Jalan Kampung, Imbi, 55100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
          mapLink: "在谷歌地图中查看 →",
          wazeLink: "在 Waze 中查看 →",
        },
      },
    },
    dressCode: {
      aesthetic: "视觉美学",
      title: "着装要求",
      subtitle: "“庄重与优雅 — 我们期待与您一同华丽出席。”",
      ladies: {
        title: "女士着装",
        desc: "诚挚邀请您穿着优雅的拖地晚礼服，或精致迷人的中长款鸡尾酒礼裙。",
        bullet1: "• 推荐穿着真丝、雪纺、绉纱等质地高雅的面料",
        bullet2: "• 温暖温暖的夏日色系或马卡龙淡雅色系与场地相得益彰",
        bullet3: "• 为免与新娘礼服相撞，请避免穿着全白、象牙白或米色",
      },
      gentlemen: {
        title: "男士着装",
        desc: "诚挚邀请您穿着正式深色晚礼服，或经典量身定制的西装搭配挺括白衬衫。",
        bullet1: "• 建议系上精致领带或领结，更显绅士儒雅",
        bullet2: "• 推荐搭配正装皮鞋或优雅的乐福鞋",
        bullet3: "• 经典色调如炭黑、藏青或纯黑色系最为合宜",
      },
    },
    rsvp: {
      accept: "回覆邀请",
      yourReply: "您的答复",
      attending: "您将出席",
      notAttending: "您无法出席",
      guest: "位来宾",
      guests: "位来宾",
      vegetarian: "素食",
      standard: "普通荤食",
      change: "需要修改吗？",
      needInviteTitle: "需要专属请柬链接",
      needInviteBody: "答复需通过专属请柬链接提交。请与我们联系，我们会把您的链接发给您。",
    },
    modal: {
      title: "您的答复",
      subtitle: "期待您的光临",
      fullName: "真实姓名",
      phone: "联系电话",
      guestCount: "出席人数",
      email: "电子邮箱",
      emailOptional: "(选填)",
      dietChoice: "饮食习惯",
      dietVegetarian: "素食 🌱",
      dietNonVegetarian: "普通荤食",
      submit: "提交答复",
      submitting: "正在送出…",
    },
    toast: {
      title: "已送出！",
      thankYou: "感谢您",
      registered: "您登记的",
      person: "位来宾",
      people: "位来宾",
      footer: "我们热切期盼您的到来！",
      close: "关闭",
    },
    footer: {
      copyright: "Eva & Vincent • 2027年1月2日",
      designed: "怀着爱意，为家人和亲友特别定制。",
      register: "来宾名单系统",
    },
  },
};
