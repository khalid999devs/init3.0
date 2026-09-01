require('dotenv').config()

const { hashSync } = require('bcryptjs')
const {
  Admin,
  CAs,
  Contact,
  Events,
  Faq,
  Gallery,
  Notices,
  PageSettings,
  ParEvents,
  Participants,
  QRAdmins,
  sponsors: Sponsors,
  teams: Teams,
  sequelize,
} = require('../models')

const saltRounds = Number(process.env.SALT || 10)
const demoPassword = hashSync('DemoUser123!', saltRounds)

const demoEvents = [
  {
    name: 'National Programming Contest',
    value: 'programming-contest',
    category: 'Programming',
    type: 'offline',
    team: true,
    maxMember: 3,
    paid: true,
    fee: '500',
    roll: true,
    image: 'demo-images/banners/init1.jpg',
    date: '2026-10-18T09:00:00.000Z',
    timeRange: '9:00 AM - 1:00 PM',
    place: 'Notre Dame College, Dhaka',
    videoLink: 'https://www.youtube.com/',
    description:
      'Solve algorithmic challenges with your team and compete with talented programmers from across Bangladesh.',
    rules:
      '### Rules\n\n- Teams may contain up to three members.\n- Bring a valid institution ID.\n- Standard ICPC-style judging will be used.',
    submission: '{}',
  },
  {
    name: 'Project Showcase',
    value: 'project-showcase',
    category: 'Innovation',
    type: 'offline',
    team: true,
    maxMember: 4,
    paid: true,
    fee: '700',
    image: 'demo-images/info/info1.jpg',
    date: '2026-10-19T04:00:00.000Z',
    timeRange: '10:00 AM - 4:00 PM',
    place: 'NDC Auditorium',
    videoLink: 'https://www.youtube.com/',
    description:
      'Present a practical technology project to judges, mentors, students, and industry guests.',
    rules:
      '### Rules\n\n- Each team gets seven minutes to present.\n- A working prototype is encouraged.\n- Projects must be original work.',
    submission: '{}',
  },
  {
    name: 'Cyber Security Challenge',
    value: 'cyber-security',
    category: 'Security',
    type: 'online',
    team: false,
    maxMember: 1,
    paid: false,
    fee: '0',
    image: 'demo-images/info/info2.jpg',
    date: '2026-10-20T08:00:00.000Z',
    timeRange: '2:00 PM - 5:00 PM',
    place: 'Online',
    videoLink: 'https://www.youtube.com/',
    description:
      'A beginner-friendly capture-the-flag competition covering web, crypto, forensics, and puzzles.',
    rules:
      '### Rules\n\n- Compete individually.\n- Do not attack contest infrastructure.\n- Write-ups may be requested from finalists.',
    submission: '{}',
  },
  {
    name: 'Digital Art Competition',
    value: 'digital-art',
    category: 'Creative',
    type: 'online',
    team: false,
    maxMember: 1,
    paid: false,
    fee: '0',
    image: 'demo-images/banners/about.jpg',
    date: '2026-10-21T12:00:00.000Z',
    timeRange: 'Submission closes at 6:00 PM',
    place: 'Online submission',
    videoLink: 'https://www.youtube.com/',
    description:
      'Create an original digital artwork inspired by the theme “Technology for a Better Tomorrow.”',
    rules:
      '### Rules\n\n- Submit PNG or JPG artwork.\n- AI-generated entries are not accepted.\n- Include a short concept note.',
    submission: JSON.stringify({
      name: 'Artwork link',
      type: 'link',
      label: 'Public Google Drive link',
    }),
  },
]

const participantRows = [
  ['Arafat Rahman', 'arafat', 'arafat@init3.local', '01710000001'],
  ['Nusrat Jahan', 'nusrat', 'nusrat@init3.local', '01710000002'],
  ['Samiul Islam', 'samiul', 'samiul@init3.local', '01710000003'],
  ['Farhana Anika', 'farhana', 'farhana@init3.local', '01710000004'],
  ['Rafi Ahmed', 'rafi', 'rafi@init3.local', '01710000005'],
  ['Demo Participant', 'demo_participant', 'demo@init3.local', '01710000006'],
]

const caRows = [
  ['Tahmid Hasan', 'tahmid_ca', 'tahmid.ca@init3.local', 'CA-1001', 28],
  ['Sumaiya Akter', 'sumaiya_ca', 'sumaiya.ca@init3.local', 'CA-1002', 21],
  ['Raihan Kabir', 'raihan_ca', 'raihan.ca@init3.local', 'CA-1003', 16],
]

async function seed() {
  if (!process.env.DB_NAME || !process.env.DB_NAME.endsWith('_demo')) {
    throw new Error(
      'Refusing to reset a database whose name does not end with "_demo".'
    )
  }

  await sequelize.authenticate()
  await sequelize.sync({ force: true })

  await Admin.bulkCreate([
    { userName: 'demo_admin', password: hashSync('DemoAdmin123!', saltRounds) },
    { userName: 'event_manager', password: demoPassword },
  ])

  await PageSettings.create({
    title: 'INIT 3.0',
    image: 'demo-images/mBanner.jpg',
    phones: '+880 1712-345678, +880 1812-345678',
    gmails: 'hello@init3.local, support@init3.local',
    titleDesc:
      'Bangladesh’s student technology festival—bringing programming, innovation, security, and digital creativity together under one roof.',
    bkash: '01712345678',
    intro: 'Learn. Build. Compete. Connect.',
    searchPermit: true,
    caRegPermit: true,
    parRegPermit: true,
  })

  await Events.bulkCreate(demoEvents)

  await Notices.bulkCreate([
    {
      type: 'Registration',
      message:
        '**Registration is now open!** Explore the event menu and reserve your place before October 15.',
      warn: true,
    },
    {
      type: 'Schedule',
      message:
        'The full festival schedule is available on each event page. Participants should arrive **30 minutes early**.',
      warn: false,
    },
    {
      type: 'Support',
      message:
        'Need help? Visit the FAQ page or send the organizing team a message from the contact page.',
      warn: false,
    },
  ])

  await Faq.bulkCreate([
    {
      question: 'Who can participate in INIT 3.0?',
      answer:
        'School, college, and university students may participate. Event-specific eligibility appears on each event page.',
    },
    {
      question: 'Can I join more than one event?',
      answer:
        'Yes. You can register for multiple events as long as their schedules do not conflict.',
    },
    {
      question: 'How are paid registrations confirmed?',
      answer:
        'Submit your transaction ID during participation. An organizer will verify it from the admin dashboard.',
    },
    {
      question: 'Do team members need their own accounts?',
      answer:
        'Yes. Every team member must create a participant account before the team leader submits the team entry.',
    },
  ])

  await Gallery.bulkCreate([
    {
      BigImage: 'demo-images/shareBanner.jpg',
      thumbnail: 'demo-images/shareBanner.jpg',
      rows: 1,
      cols: 1,
      order: 1,
    },
    {
      BigImage: 'demo-images/info/info2.jpg',
      thumbnail: 'demo-images/info/info2.jpg',
      rows: 1,
      cols: 1,
      order: 2,
    },
    {
      BigImage: 'demo-images/info/info1.jpg',
      thumbnail: 'demo-images/info/info1.jpg',
      rows: 1,
      cols: 1,
      order: 3,
    },
  ])

  await Sponsors.bulkCreate([
    {
      type: 'Software Engineering Partner',
      image:
        'https://brainstation-23.com/wp-content/uploads/2020/10/Brain-Station-23-Ltd.jpg',
      link: 'https://brainstation-23.com/',
      name: 'Brain Station 23',
    },
    {
      type: 'Offshore Development Partner',
      image: 'https://bjitgroup.com/static/svg/common/bjit-logo2.svg',
      link: 'https://bjitgroup.com/',
      name: 'BJIT',
    },
    {
      type: 'Digital Identity Partner',
      image: 'https://www.tigerit.com/img/ti-logo.png',
      link: 'https://www.tigerit.com/',
      name: 'TigerIT Bangladesh',
    },
    {
      type: 'Enterprise Software Partner',
      image:
        'https://www.southtechgroup.com/wp-content/uploads/2019/12/southtech-group-logo.png',
      link: 'https://www.southtechgroup.com/',
      name: 'Southtech',
    },
  ])

  const participants = await Participants.bulkCreate(
    participantRows.map(([fullName, userName, email, phone], index) => ({
      qrCode: `INIT3-P-${String(index + 1).padStart(4, '0')}`,
      caRef: index % 2 === 0 ? 'CA-1001' : 'CA-1002',
      fullName,
      fb: 'https://facebook.com/',
      institute: index < 3 ? 'Notre Dame College' : 'Demo City College',
      className: index < 3 ? 'Class XII' : 'Undergraduate',
      address: 'Dhaka, Bangladesh',
      image: 'demo-images/person.webp',
      email,
      phone,
      userName,
      password: demoPassword,
    }))
  )

  const participantEventData = [
    {
      eventInfo: { 'programming-contest': 1, 'cyber-security': 1 },
      teamName: { 'programming-contest': 'Team Binary' },
      paidEvent: { 'programming-contest': 1 },
      fee: { 'programming-contest': '500' },
      transactionID: { 'programming-contest': 'TXN-DEMO-1001' },
      transactionNum: { 'programming-contest': '01712345678' },
    },
    {
      eventInfo: { 'programming-contest': 1 },
      teamName: { 'programming-contest': 'Team Binary' },
      paidEvent: { 'programming-contest': 1 },
      fee: { 'programming-contest': '500' },
      transactionID: { 'programming-contest': 'TXN-DEMO-1001' },
      transactionNum: { 'programming-contest': '01712345678' },
    },
    {
      eventInfo: { 'programming-contest': 1, 'digital-art': 0 },
      teamName: { 'programming-contest': 'Team Binary' },
      paidEvent: { 'programming-contest': 1 },
      fee: { 'programming-contest': '500' },
      transactionID: { 'programming-contest': 'TXN-DEMO-1001' },
      transactionNum: { 'programming-contest': '01712345678' },
    },
    {
      eventInfo: { 'project-showcase': 0 },
      teamName: { 'project-showcase': 'Future Forge' },
      paidEvent: { 'project-showcase': 0 },
      fee: { 'project-showcase': '700' },
      transactionID: { 'project-showcase': 'TXN-DEMO-1002' },
      transactionNum: { 'project-showcase': '01812345678' },
    },
    { eventInfo: { 'cyber-security': 1 }, teamName: {}, paidEvent: {} },
    {
      eventInfo: { 'project-showcase': 1, 'digital-art': 0 },
      teamName: { 'project-showcase': 'Future Forge' },
      paidEvent: { 'project-showcase': 1 },
      fee: { 'project-showcase': '700' },
      transactionID: { 'project-showcase': 'TXN-DEMO-1003' },
      transactionNum: { 'project-showcase': '01912345678' },
    },
  ]

  await ParEvents.bulkCreate(
    participants.map((participant, index) => {
      const data = participantEventData[index]
      return {
        parId: participant.id,
        clientQR: participant.qrCode,
        eventInfo: JSON.stringify(data.eventInfo),
        teamName: JSON.stringify(data.teamName),
        paidEvent: JSON.stringify(data.paidEvent),
        fee: JSON.stringify(data.fee || {}),
        transactionID: JSON.stringify(data.transactionID || {}),
        transactionNum: JSON.stringify(data.transactionNum || {}),
        SubLinks: '{}',
        SubNames: '{}',
        roll_no: `2026-${String(index + 1).padStart(3, '0')}`,
      }
    })
  )

  const cas = await CAs.bulkCreate(
    caRows.map(([fullName, userName, email, code, used], index) => ({
      code,
      blocked: false,
      used,
      fullName,
      fb: 'https://facebook.com/',
      institute: index === 0 ? 'Notre Dame College' : 'Demo City College',
      className: 'Class XII',
      address: 'Dhaka, Bangladesh',
      image: 'demo-images/person.webp',
      email,
      phone: `0181000000${index + 1}`,
      userName,
      password: demoPassword,
    }))
  )

  await ParEvents.bulkCreate(
    cas.map((ca) => ({
      CAId: ca.id,
      clientQR: ca.code,
      eventInfo: '{}',
      teamName: '{}',
      paidEvent: '{}',
      fee: '{}',
      transactionID: '{}',
      transactionNum: '{}',
      SubLinks: '{}',
      SubNames: '{}',
    }))
  )

  await Teams.bulkCreate([
    {
      name: 'Team Binary',
      leader: 'arafat',
      event: 'programming-contest',
      members: JSON.stringify({ nusrat: 1, samiul: 1 }),
    },
    {
      name: 'Future Forge',
      leader: 'farhana',
      event: 'project-showcase',
      members: JSON.stringify({ demo_participant: 1 }),
    },
  ])

  await Contact.bulkCreate([
    {
      name: 'Imran Hossain',
      phone: '01610000001',
      email: 'imran@example.com',
      institute: 'Demo School',
      message: 'Could you confirm the reporting time for the programming contest?',
      replied: false,
    },
    {
      name: 'Maliha Noor',
      phone: '01610000002',
      email: 'maliha@example.com',
      institute: 'Demo College',
      message: 'Is a printed project poster required for the showcase?',
      replied: true,
    },
    {
      name: 'Zarif Khan',
      phone: '01610000003',
      email: 'zarif@example.com',
      institute: 'Demo University',
      message: 'Please share the digital art canvas-size requirements.',
      replied: false,
    },
  ])

  await QRAdmins.create({
    userName: 'demo_scanner',
    password: demoPassword,
    scanned: 12,
    event: 'programming-contest',
  })

  console.log('Demo database seeded successfully.')
  console.log('Admin: demo_admin / DemoAdmin123!')
  console.log('Participant: demo@init3.local / DemoUser123!')
}

seed()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await sequelize.close()
  })
