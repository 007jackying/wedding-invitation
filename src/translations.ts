interface DressCodeSide {
  label: string;
  sublabel: string;
  attire: string;
  note: string;
}

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
  gallery: {
    eyebrow: string;
    title: string;
    caption: string;
    alt1: string;
    alt2: string;
  };
  dressCode: {
    title: string;
    subtitle: string;
    ladies: DressCodeSide;
    gentlemen: DressCodeSide;
    statement: string;
    colorNote: string;
    illustrationAlt: string;
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
    gallery: {
      eyebrow: "Our Moments",
      title: "Eva & Vincent",
      caption: "A few of our favourite moments, on the way to this day.",
      alt1: "Eva and Vincent standing close together, foreheads almost touching",
      alt2: "Eva seated on a window ledge holding Vincent's hand, looking up at him",
    },
    dressCode: {
      title: "Dress Code",
      subtitle: "服装要求",
      ladies: {
        label: "Ladies",
        sublabel: "女士",
        attire: "Long Dress",
        note: "Elegant and comfortable",
      },
      gentlemen: {
        label: "Gentlemen",
        sublabel: "男士",
        attire: "Shirt",
        note: "Smart casual",
      },
      statement:
        "We look forward to celebrating our special day with you in elegant and appropriate attire.",
      colorNote: "Colors are welcome — please avoid white dress.",
      illustrationAlt:
        "Illustration of two guests in long evening dresses and two in shirts with smart casual trousers",
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
    gallery: {
      eyebrow: "我们的时光",
      title: "Eva & Vincent",
      caption: "记录我们走到今天的点滴瞬间。",
      alt1: "Eva 与 Vincent 相依而立，额头轻触",
      alt2: "Eva 坐在窗台上握着 Vincent 的手，仰望着他",
    },
    dressCode: {
      title: "着装要求",
      subtitle: "Dress Code",
      ladies: {
        label: "女士",
        sublabel: "Ladies",
        attire: "长裙",
        note: "优雅、得体即可",
      },
      gentlemen: {
        label: "男士",
        sublabel: "Gentlemen",
        attire: "衬衫",
        note: "休闲或正式皆可",
      },
      statement: "我们期待您以优雅得体的正装出席，与我们一同见证这个温馨而特别的时刻。",
      colorNote: "颜色随意，但请避免白色礼服。",
      illustrationAlt: "插画：两位女士身着长款礼服，两位男士身着衬衫搭配休闲西裤",
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
