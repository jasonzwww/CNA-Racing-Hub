
import { Race, RaceStatus, Driver, EnduranceTeam, SeriesId, Standing, Series, Season, IRacingEventResult } from './types';

export const LEAGUE_NAME = "CNA Racing";

export const TRANSLATIONS = {
  en: {
    dashboard: "Dashboard",
    schedule: "Schedule",
    standings: "Standings",
    drivers: "Drivers",
    worldMap: "World Map",
    enduranceFinder: "Endurance Finder",
    aiSteward: "AI Steward",
    archives: "Archives",
    management: "Management",
    profile: "My Profile",
    officialPortal: "Official Portal",
    serverStatus: "Server Status",
    operational: "All systems operational.",
    pushLimits: "PUSH YOUR LIMITS",
    heroDesc: "The premier community for competitive iRacing series. Join the elite drivers of CNA Racing today.",
    joinLeague: "JOIN THE LEAGUE",
    nextEvent: "Next Event Countdown",
    totalDrivers: "Total Drivers",
    seasonRaces: "Season Races",
    avgStrength: "Avg. Strength",
    recentResults: "RECENT RESULTS",
    viewAll: "VIEW ALL RESULTS",
    raceSchedule: "RACE SCHEDULE",
    scheduleDesc: "Full season calendar and past event results.",
    upcomingEvents: "UPCOMING EVENTS",
    pastResults: "PAST RESULTS",
    register: "REGISTER",
    winner: "Winner",
    driverStatus: "DRIVER STATUS",
    driverDesc: "Real-time standings and performance metrics.",
    searchDrivers: "Search drivers...",
    viewProfile: "View Performance Profile",
    globalPresence: "GLOBAL PRESENCE",
    mapDesc: "CNA Racing is a truly international community. See where our elite drivers are located around the globe.",
    countriesRepresented: "Countries Represented",
    uptime: "Global Practice Uptime",
    chapters: "Continental Chapters",
    enduranceMatchmaking: "ENDURANCE TEAMS",
    matchmakingDesc: "Create your team or join an existing roster for upcoming endurance events.",
    postRecruitment: "CREATE TEAM",
    safetyNotice: "League Recommendation",
    safetyDesc: "Team chemistry is vital! Always check your potential teammates' stats and run a practice session before committing.",
    activeNow: "Recruiting",
    sendMessage: "JOIN TEAM REQUEST",
    resume: "RESUME",
    manualMode: "Manual Mode",
    gt3Open: "GT3 Open",
    rookies: "Rookies",
    rank: "Rank",
    points: "Points",
    wins: "Wins",
    podiums: "Podiums",
    races: "Races",
    teamMembers: "Team Roster",
    slotsAvailable: "Slots Left",
    teamName: "Team Name",
    eventTarget: "Target Race",
    hallOfFame: "Season Hall of Fame",
    viewArchive: "View Season Results",
    pastSeasonsDesc: "Historical records of championship winners and race results.",
    avgTeamIR: "Average iRating",
    teamGoal: "Team Ambition",
    competitive: "Podium Contender",
    casual: "Just for Fun / Endurance",
    maxDrivers: "Driver Capacity",
    loginWithIRacing: "Connect iRacing Account",
    logout: "Disconnect",
    account: "Account",
    emailAddress: "iRacing Email / Customer ID",
    password: "API Password",
    signIn: "Authorize & Connect",
    authenticating: "Initializing Handshake...",
    apiNotice: "Secure connection via iRacing Member API v2.0",
    connectRequest: "CNA Racing Hub is requesting access to your iRacing profile, career statistics, and license data.",
    stepDns: "Resolving api.iracing.com...",
    stepSsl: "Establishing Secure SSL Handshake...",
    stepAuth: "Verifying Member Credentials...",
    stepSync: "Synchronizing Career Stats & Licenses...",
    timeslot: "Timeslot",
    slotLabel: "Slot",
    startTime: "Event Start (Local)",
    selectSlot: "Select Timeslot",
    uploadResults: "Upload Race Data",
    uploadJson: "Import JSON Result",
    uploadImage: "Upload Track Image",
    manageData: "League Data Center",
    saveRace: "Save to League Records",
    noFile: "No file chosen",
    jsonSuccess: "JSON Parsed Successfully",
    imgSuccess: "Image Attached",
    managedList: "Managed Race Events",
    deleteRace: "Remove Record",
    myCareer: "Career History",
    myTeams: "My Endurance Squads",
    careerStats: "Performance Metrics",
    topResults: "Top Results",
    avgFinish: "Avg. Finish",
    incidentsPerRace: "Incidents/Race",
    totalLaps: "Total Laps",
    activeSquads: "Active Roster",
    noParticipation: "No race participation records found for the current user.",
    cnaNumber: "CNA Number",
    iracingId: "iRacing Customer ID",
    manageDrivers: "Driver Management",
    updateSuccess: "Driver record updated",
    saveChanges: "Save Changes",
    accessControl: "Access Control",
    adminList: "League Administrators",
    addAdmin: "Authorize Admin",
    adminIdPlaceholder: "Enter iRacing Customer ID...",
    revoke: "Revoke",
    authWarning: "Careful! Authorized IDs have full access to league data and results.",
    manageSchedule: "Schedule Management",
    addEvent: "Add New Event",
    trackName: "Track Name",
    eventDuration: "Duration (Mins)",
    eventImage: "Cover Image URL",
    saveEvent: "Publish to Schedule",
    eventAdded: "Event added to schedule"
  },
  zh: {
    dashboard: "仪表板",
    schedule: "赛程安排",
    standings: "积分榜",
    drivers: "车手库",
    worldMap: "世界地图",
    enduranceFinder: "耐力赛组队",
    aiSteward: "AI 赛控干事",
    archives: "赛季归档",
    management: "后台管理",
    profile: "个人资料",
    officialPortal: "官方入口",
    serverStatus: "服务器状态",
    operational: "所有系统运行正常。",
    pushLimits: "挑战极限",
    heroDesc: "iRacing 竞争性赛事的首选社区。今天就加入 CNA Racing 的精英车手行列。",
    joinLeague: "加入联赛",
    nextEvent: "下场比赛倒计时",
    totalDrivers: "总车手人数",
    seasonRaces: "本赛季场次",
    avgStrength: "平均实力",
    recentResults: "近期比赛结果",
    viewAll: "查看全部结果",
    raceSchedule: "比赛赛程",
    scheduleDesc: "全赛季日历及往届赛事结果。",
    upcomingEvents: "即将进行的赛事",
    pastResults: "往届结果",
    register: "立即报名",
    winner: "冠军",
    driverStatus: "车手状态",
    driverDesc: "实时排名与性能指标。",
    searchDrivers: "搜索车手...",
    viewProfile: "查看表现档案",
    globalPresence: "全球足迹",
    mapDesc: "CNA Racing 是一个真正的国际化社区。查看我们全球精英车手的所在地。",
    countriesRepresented: "代表国家/地区",
    uptime: "全球练习全天候在线",
    chapters: "大洲分部",
    enduranceMatchmaking: "耐力赛战队",
    matchmakingDesc: "创建你的战队，或加入现有阵容参加即将到来的耐力赛事。",
    postRecruitment: "创建战队",
    safetyNotice: "联赛建议",
    safetyDesc: "团队化学反应非常关键！在加入前，务必检查潜在队友的数据并共同参加练习赛。",
    activeNow: "招募中",
    sendMessage: "申请加入战队",
    resume: "恢复自动旋转",
    manualMode: "手动模式",
    gt3Open: "GT3 公开赛",
    rookies: "新人赛",
    rank: "排名",
    points: "积分",
    wins: "胜场",
    podiums: "领奖台",
    races: "参赛数",
    teamMembers: "战队成员",
    slotsAvailable: "剩余名额",
    teamName: "战队名称",
    eventTarget: "目标赛事",
    hallOfFame: "赛季名人堂",
    viewArchive: "查看赛季结果",
    pastSeasonsDesc: "联赛冠军和比赛结果的历史记录。",
    avgTeamIR: "平均 iRating",
    teamGoal: "战队目标",
    competitive: "争夺领奖台",
    casual: "慢慢跑娱乐",
    maxDrivers: "车手席位",
    loginWithIRacing: "连接 iRacing 账号",
    logout: "断开连接",
    account: "账户",
    emailAddress: "iRacing 邮箱 / 客户 ID",
    password: "API 授权密码",
    signIn: "授权并连接",
    authenticating: "正在初始化握手...",
    apiNotice: "通过 iRacing Member API v2.0 进行安全连接",
    connectRequest: "CNA Racing Hub 申请访问您的 iRacing 个人资料、生涯统计数据和执照等级。",
    stepDns: "正在解析 api.iracing.com...",
    stepSsl: "正在建立安全 SSL 握手...",
    stepAuth: "正在验证成员凭据...",
    stepSync: "正在同步生涯统计和执照...",
    timeslot: "比赛场次",
    slotLabel: "第",
    startTime: "比赛开始 (本地时间)",
    selectSlot: "选择场次",
    uploadResults: "上传比赛数据",
    uploadJson: "导入 JSON 结果",
    uploadImage: "上传赛道图片",
    manageData: "联赛数据中心",
    saveRace: "保存至联赛档案",
    noFile: "未选择文件",
    jsonSuccess: "JSON 解析成功",
    imgSuccess: "图片已就绪",
    managedList: "已管理赛事列表",
    deleteRace: "删除记录",
    myCareer: "生涯历史",
    myTeams: "我的耐力赛战队",
    careerStats: "表现指标",
    topResults: "最佳战绩",
    avgFinish: "平均完赛",
    incidentsPerRace: "场均事故",
    totalLaps: "总圈数",
    activeSquads: "活跃阵容",
    noParticipation: "未找到当前用户的参赛记录。",
    cnaNumber: "CNA 车手号",
    iracingId: "iRacing 客户 ID",
    manageDrivers: "车手管理",
    updateSuccess: "车手记录已更新",
    saveChanges: "保存更改",
    accessControl: "权限控制",
    adminList: "联赛管理员名单",
    addAdmin: "授权管理员",
    adminIdPlaceholder: "输入 iRacing Customer ID...",
    revoke: "撤销",
    authWarning: "请注意！授权的 ID 将拥有访问联赛所有数据和修改结果的完全权限。",
    manageSchedule: "赛程管理",
    addEvent: "发布新赛事",
    trackName: "赛道名称",
    eventDuration: "时长 (分钟)",
    eventImage: "背景图片链接",
    saveEvent: "同步至赛程表",
    eventAdded: "赛事已添加至赛程表"
  }
};

export const MOCK_SEASONS: Season[] = [
  { id: '26S1', name: 'Season 26S1', year: 2025, status: 'ACTIVE' },
  { id: 'S4', name: 'Season S4: Winter Sprint', year: 2024, status: 'ARCHIVED' },
  { id: 'S3', name: 'Season S3: Endurance Masters', year: 2023, status: 'ARCHIVED' }
];

export const MOCK_SERIES: Series[] = [
  { id: 'GT3_OPEN', name: 'GT3 Open', description: 'The flagship competitive series for advanced drivers.' },
  { id: 'ROOKIES', name: 'Rookies', description: 'A welcoming series focused on learning and clean racing for newcomers.' }
];

export const GT3_R1_RESULT: IRacingEventResult = {
  subsession_id: 82056585,
  league_name: "CNA Racing",
  track: {
    track_name: "Autodromo Internazionale Enzo e Dino Ferrari",
    config_name: "Grand Prix"
  },
  weather: {
    temp_value: 26,
    rel_humidity: 45,
    wind_value: 3
  },
  event_strength_of_field: 1759,
  session_results: [
    {
      simsession_type_name: "Race",
      results: [
        { cust_id: 1177810, display_name: "Songtao Bai", finish_position: 0, starting_position: 3, car_name: "Aston Martin Vantage GT3 EVO", car_id: 206, best_lap_time: 1029223, average_lap: 1052193, incidents: 9, interval: 0, oldi_rating: 3057, newi_rating: 3057, laps_complete: 23, laps_lead: 13, league_points: 24 },
        { cust_id: 632058, display_name: "Handa Yang", finish_position: 1, starting_position: 2, car_name: "Porsche 911 GT3 R (992)", car_id: 169, best_lap_time: 1032715, average_lap: 1056499, incidents: 13, interval: 99014, oldi_rating: 2985, newi_rating: 2985, laps_complete: 23, laps_lead: 2, league_points: 18 },
        { cust_id: 417177, display_name: "Yao Jianzhong", finish_position: 2, starting_position: 4, car_name: "Ferrari 296 GT3", car_id: 173, best_lap_time: 1036434, average_lap: 1064270, incidents: 5, interval: 277763, oldi_rating: 2152, newi_rating: 2152, laps_complete: 23, laps_lead: 0, league_points: 15 },
        { cust_id: 1245968, display_name: "Suncheng Shi", finish_position: 3, starting_position: 0, car_name: "Chevrolet Corvette Z06 GT3.R", car_id: 184, best_lap_time: 1034734, average_lap: 1070852, incidents: 19, interval: 429106, oldi_rating: 2073, newi_rating: 2073, laps_complete: 23, laps_lead: 8, league_points: 12 },
        { cust_id: 1219984, display_name: "Li Xina", finish_position: 4, starting_position: 7, car_name: "Porsche 911 GT3 R (992)", car_id: 169, best_lap_time: 1046178, average_lap: 1079596, incidents: 16, interval: 630310, oldi_rating: 1008, newi_rating: 1008, laps_complete: 23, laps_lead: 0, league_points: 10 },
        { cust_id: 1362776, display_name: "Shuming Shi", finish_position: 5, starting_position: 5, car_name: "Porsche 911 GT3 R (992)", car_id: 169, best_lap_time: 1039917, average_lap: 1083836, incidents: 19, interval: 727805, oldi_rating: 1685, newi_rating: 1685, laps_complete: 23, laps_lead: 0, league_points: 8 },
        { cust_id: 1127717, display_name: "Zile Wang", finish_position: 6, starting_position: 6, car_name: "Porsche 911 GT3 R (992)", car_id: 169, best_lap_time: 1044088, average_lap: 1085668, incidents: 23, interval: 769949, oldi_rating: 1946, newi_rating: 1946, laps_complete: 23, laps_lead: 0, league_points: 7 },
        { cust_id: 1388477, display_name: "Tommy John", finish_position: 7, starting_position: 9, car_name: "Porsche 911 GT3 R (992)", car_id: 169, best_lap_time: 1044534, average_lap: 1100651, incidents: 18, interval: 1114576, oldi_rating: 734, newi_rating: 734, laps_complete: 23, laps_lead: 0, league_points: 6 },
        { cust_id: 1371817, display_name: "Jiamian Gui", finish_position: 8, starting_position: 8, car_name: "Porsche 911 GT3 R (992)", car_id: 169, best_lap_time: 1055611, average_lap: 1115139, incidents: 22, interval: -1, oldi_rating: 1409, newi_rating: 1409, laps_complete: 22, laps_lead: 0, league_points: 5 },
        { cust_id: 482887, display_name: "Ethan Wang", finish_position: 9, starting_position: 1, car_name: "BMW M4 GT3 EVO", car_id: 132, best_lap_time: 1035307, average_lap: 1087617, incidents: 24, interval: -1, oldi_rating: 2614, newi_rating: 2614, laps_complete: 21, laps_lead: 0, league_points: 4 }
      ]
    }
  ]
};

// Helper to find track images
const getTrackImage = (trackName: string) => {
    const name = trackName.toLowerCase();
    if (name.includes('imola')) return 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=800&auto=format&fit=crop';
    if (name.includes('silverstone')) return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop';
    if (name.includes('mans')) return 'https://images.unsplash.com/photo-1547482811-2364c3108920?q=80&w=800&auto=format&fit=crop';
    if (name.includes('spa')) return 'https://images.unsplash.com/photo-1594735294524-748956891637?q=80&w=800&auto=format&fit=crop';
    if (name.includes('daytona')) return 'https://images.unsplash.com/photo-1610452386470-3f41297e2909?q=80&w=800&auto=format&fit=crop';
    if (name.includes('suzuka')) return 'https://images.unsplash.com/photo-1594735294524-748956891637?q=80&w=800&auto=format&fit=crop';
    if (name.includes('monza')) return 'https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?q=80&w=800&auto=format&fit=crop';
    if (name.includes('nurburgring')) return 'https://images.unsplash.com/photo-1534083234862-2f369f64923e?q=80&w=800&auto=format&fit=crop';
    if (name.includes('okayama')) return 'https://images.unsplash.com/photo-1594735294524-748956891637?q=80&w=800&auto=format&fit=crop';
    if (name.includes('bathurst')) return 'https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?q=80&w=800&auto=format&fit=crop';
    if (name.includes('navarra')) return 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=800&auto=format&fit=crop';
    if (name.includes('lime rock')) return 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=800&auto=format&fit=crop';
    if (name.includes('summit')) return 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=800&auto=format&fit=crop';
    if (name.includes('tsukuba')) return 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=800&auto=format&fit=crop';
    if (name.includes('oulton')) return 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=800&auto=format&fit=crop';
    if (name.includes('charlotte')) return 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=800&auto=format&fit=crop';
    if (name.includes('winton')) return 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=800&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?q=80&w=800&auto=format&fit=crop';
};

const rawGt3Races = [
    { round: 1, track: "Autodromo Internazionale Enzo e Dino Ferrari 伊莫拉", start: "2025-12-21T03:59:00Z", format: "P(60分钟) + Q(20分钟) + R(40分钟,强制1停)", note: "揭幕战" },
    { round: 2, track: "Silverstone Circuit 银石", start: "2025-12-28T03:59:00Z", format: "P(60分钟) + Q(20分钟) + R(40分钟,强制1停)" },
    { round: 3, track: "Circuit des 24 Heures du Mans 勒芒", start: "2026-01-04T03:59:00Z", format: "P(60分钟) + Q(20分钟) + R(40分钟,强制1停)" },
    { round: 4, track: "Circuit de Spa-Francorchamps 斯帕", start: "2026-01-11T03:59:00Z", format: "P(60分钟) + Q(20分钟) + R(40分钟,强制1停)" },
    { round: 5, track: "Daytona International Speedway 代托纳", start: "2026-01-18T03:59:00Z", format: "P(60分钟) + Q(20分钟) + R(40分钟,强制1停)" },
    { round: 6, track: "Suzuka International Racing Course 铃鹿", start: "2026-01-25T03:59:00Z", format: "P(60分钟) + Q(20分钟) + R(40分钟,强制1停)" },
    { round: 7, track: "Autodromo Nazionale Monza 蒙扎", start: "2026-02-01T03:59:00Z", format: "P(60分钟) + Q(20分钟) + R(40分钟,强制1停)" },
    { round: 8, track: "Virginia International Raceway VIR", start: "2026-02-08T03:59:00Z", format: "P(60分钟) + Q(20分钟) + R(40分钟,强制1停)" },
    { round: 9, track: "Mount Panorama Circuit 巴瑟斯特", start: "2026-02-15T03:59:00Z", format: "P(60分钟) + Q(20分钟) + R(40分钟,强制1停)" },
    { round: 10, track: "Nürburgring Grand Prix Strecke 纽博格林GP", start: "2026-02-22T03:59:00Z", format: "P(60分钟) + Q(20分钟) + R(40分钟,强制1停)" },
    { round: 11, track: "Okayama International Circuit 冈山", start: "2026-03-01T04:59:00Z", format: "P(60分钟) + Q(20分钟) + R(40分钟,强制1停)" },
    { round: 12, track: "Nürburgring Combined 纽博格林综合", start: "2026-03-08T04:59:00Z", format: "P(10分钟) + Q(30分钟) + R(80分钟)", note: "收官战" },
];

const rawRookieRaces = [
    { round: 1, track: "Circuito de Navarra 纳瓦拉", start: "2025-12-27T04:00:00Z", format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)", note: "揭幕战" },
    { round: 2, track: "Lime Rock Park 莱姆洛克", start: "2026-01-03T04:00:00Z", format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)" },
    { round: 3, track: "Summit Point Raceway 萨米特角", start: "2026-01-10T04:00:00Z", format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)" },
    { round: 4, track: "Tsukuba Circuit 筑波", start: "2026-01-17T04:00:00Z", format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)" },
    { round: 5, track: "Circuit de Lédenon 勒德农", start: "2026-01-24T04:00:00Z", format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)" },
    { round: 6, track: "Oulton Park Circuit 奥尔顿公园", start: "2026-01-31T04:00:00Z", format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)" },
    { round: 7, track: "Charlotte Motor Speedway 夏洛特", start: "2026-02-07T04:00:00Z", format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)" },
    { round: 8, track: "Winton Motor Raceway 温顿", start: "2026-02-14T04:00:00Z", format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)" },
    { round: 9, track: "Okayama International Circuit 冈山", start: "2026-02-21T04:00:00Z", format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)" },
    { round: 10, track: "Summit Point Raceway 萨米特角", start: "2026-02-28T04:00:00Z", format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)", note: "收官战" },
];

const mappedGt3: Race[] = rawGt3Races.map(r => ({
    id: `26S1-GT3-${r.round}`,
    seasonId: '26S1',
    seriesId: 'GT3_OPEN',
    seriesName: 'CNA GT3 Open',
    track: r.track,
    dateTime: r.start,
    status: r.round === 1 ? RaceStatus.COMPLETED : RaceStatus.UPCOMING,
    winner: r.round === 1 ? "Songtao Bai" : undefined,
    subsessionId: r.round === 1 ? 82056585 : undefined,
    durationMinutes: r.round === 12 ? 80 : 40,
    image: getTrackImage(r.track)
}));

const mappedRookie: Race[] = rawRookieRaces.map(r => ({
    id: `26S1-ROOKIE-${r.round}`,
    seasonId: '26S1',
    seriesId: 'ROOKIES',
    seriesName: 'CNA 新手赛',
    track: r.track,
    dateTime: r.start,
    status: RaceStatus.UPCOMING,
    durationMinutes: 20,
    image: getTrackImage(r.track)
}));

export const MOCK_RACES: Race[] = [...mappedGt3, ...mappedRookie];

export const MOCK_DRIVERS: Driver[] = [
  { id: '1177810', name: 'Alex Simmons', iRating: 4250, safetyRating: 'A 4.99', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, status: 'Online', avatar: 'https://i.pravatar.cc/150?u=alex', cnaDriverNumber: '01' },
  { id: '632058', name: 'Marco Rossi', iRating: 3800, safetyRating: 'A 3.45', country: 'Italy', lat: 41.9028, lng: 12.4964, status: 'Racing', avatar: 'https://i.pravatar.cc/150?u=marco', cnaDriverNumber: '02' },
  { id: '417177', name: 'Yuki Tanaka', iRating: 5100, safetyRating: 'Pro 4.0', country: 'Japan', lat: 35.6762, lng: 139.6503, status: 'Offline', avatar: 'https://i.pravatar.cc/150?u=yuki', cnaDriverNumber: '03' },
  { id: '1245968', name: 'Sarah Miller', iRating: 2950, safetyRating: 'B 2.80', country: 'USA', lat: 34.0522, lng: -118.2437, status: 'Online', avatar: 'https://i.pravatar.cc/150?u=sarah', cnaDriverNumber: '04' },
  { id: '1219984', name: 'Bruno Santos', iRating: 4100, safetyRating: 'A 4.20', country: 'Brazil', lat: -23.5505, lng: -46.6333, status: 'Offline', avatar: 'https://i.pravatar.cc/150?u=bruno', cnaDriverNumber: '05' },
  { id: '1362776', name: 'Chen Wei', iRating: 3200, safetyRating: 'B 3.15', country: 'China', lat: 31.2304, lng: 121.4737, status: 'Racing', avatar: 'https://i.pravatar.cc/150?u=chen', cnaDriverNumber: '06' },
];

export const GUEST_DRIVERS: Driver[] = [
  { id: 'g1', name: 'Guest Racer #117', iRating: 1500, safetyRating: 'R 2.48', country: 'Unknown', lat: 40.7128, lng: -74.0060, status: 'Offline', avatar: 'https://i.pravatar.cc/150?u=g1', cnaDriverNumber: '??' },
  { id: 'g2', name: 'Guest Racer #042', iRating: 1200, safetyRating: 'D 3.10', country: 'Unknown', lat: 48.8566, lng: 2.3522, status: 'Offline', avatar: 'https://i.pravatar.cc/150?u=g2', cnaDriverNumber: '??' },
  { id: 'g3', name: 'Guest Racer #999', iRating: 1800, safetyRating: 'C 2.90', country: 'Unknown', lat: 35.6895, lng: 139.6917, status: 'Offline', avatar: 'https://i.pravatar.cc/150?u=g3', cnaDriverNumber: '??' },
];

export const MOCK_ENDURANCE_TEAMS: EnduranceTeam[] = [
  { 
    id: 't1', 
    name: 'CNA Apex Predators', 
    series: 'Endurance Masters', 
    car: 'Ferrari 296 GT3', 
    raceName: '24 Hours of Spa',
    eventDateTime: '2024-07-20T12:00:00Z',
    timeslot: 1,
    members: ['1177810', '417177'], 
    recruiting: true, 
    notes: 'Looking for 2 more consistent drivers for the night stints.',
    creatorId: '1177810',
    maxMembers: 4,
    targetGoal: 'COMPETITIVE'
  },
  { 
    id: 't2', 
    name: 'Dragon Racing East', 
    series: 'GT Endurance', 
    car: 'BMW M4 GT3', 
    raceName: '12 Hours of Sebring',
    eventDateTime: '2024-03-16T18:00:00Z',
    timeslot: 2,
    members: ['1362776', '632058', '1219984'], 
    recruiting: true, 
    notes: 'Almost full! Just need one more A-class driver.',
    creatorId: '1362776',
    maxMembers: 4,
    targetGoal: 'CASUAL'
  }
];

export const MOCK_STANDINGS: Standing[] = [
  { driverId: '1177810', seriesId: 'GT3_OPEN', seasonId: '26S1', points: 24, wins: 1, podiums: 1, racesRun: 1 },
  { driverId: '632058', seriesId: 'GT3_OPEN', seasonId: '26S1', points: 18, wins: 0, podiums: 1, racesRun: 1 },
  { driverId: '417177', seriesId: 'GT3_OPEN', seasonId: '26S1', points: 15, wins: 0, podiums: 1, racesRun: 1 },
  { driverId: '1177810', seriesId: 'GT3_OPEN', seasonId: 'S4', points: 125, wins: 3, podiums: 5, racesRun: 6 },
  { driverId: '417177', seriesId: 'GT3_OPEN', seasonId: 'S4', points: 110, wins: 2, podiums: 4, racesRun: 5 },
  { driverId: '1219984', seriesId: 'GT3_OPEN', seasonId: 'S4', points: 95, wins: 1, podiums: 3, racesRun: 6 },
  { driverId: '632058', seriesId: 'GT3_OPEN', seasonId: 'S4', points: 70, wins: 0, podiums: 1, racesRun: 4 },
  { driverId: '1245968', seriesId: 'ROOKIES', seasonId: 'S4', points: 85, wins: 2, podiums: 3, racesRun: 4 },
  { driverId: '1362776', seriesId: 'ROOKIES', seasonId: 'S4', points: 72, wins: 1, podiums: 2, racesRun: 4 },
  { driverId: '632058', seriesId: 'ROOKIES', seasonId: 'S4', points: 45, wins: 0, podiums: 1, racesRun: 3 },
];
