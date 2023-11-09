import FacebookIcon from '@mui/icons-material/Facebook'
import YouTubeIcon from '@mui/icons-material/YouTube'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import LanguageIcon from '@mui/icons-material/Language'
import MailIcon from '@mui/icons-material/Mail'

export const mainBannerLink = `/Images/mBanner.jpg`
export const tutorialVideoLink = `https://youtu.be/2zwXIhI6QcU`
export const paidEventRulesLink = ``
export const teamBasedEventLink = `https://youtu.be/76lBrnr_2yE`
export const bkashMethod = {
  service: 'bKash',
  type: `Send Money`,
}

export const socialLinksMap = {
  facebook: <FacebookIcon />,
  twitter: <TwitterIcon />,
  youtube: <YouTubeIcon />,
  instagram: <InstagramIcon />,
  website: <LanguageIcon />,
  email: <MailIcon />,
}

export const navigationLinks = [
  { title: 'Home', link: '/', sub: false, footer: false },
  {
    title: 'About',
    link: '',
    sub: true,
    childs: [
      { title: 'About us', link: 'about', footer: true },
      { title: 'CA list', link: 'cas' },
      { title: 'Notices', link: 'notices' },
      // { title: 'Problem Setters', link: 'setters' },
    ],
    footer: true,
  },
  { title: 'Events', link: '', sub: true, childs: [] },
  { title: 'Contact', link: 'contact', sub: false, footer: true },
  {
    title: 'Registration',
    link: '',
    sub: true,
    childs: [
      { title: 'Participant', link: 'registration/participant', footer: true },
      { title: 'CA', link: 'registration/ca' },
    ],
    footer: true,
  },
  { title: 'FAQ', link: 'faq', sub: false, footer: true },
  { title: 'Gallery', link: 'gallery', sub: false },
]

export const socialIcons = [
  {
    name: 'Facebook',
    link: 'https://www.facebook.com/nditc.official',
    icon: <FacebookIcon sx={{ fontSize: '2.2rem' }} />,
  },
  {
    name: 'Youtube',
    link: 'https://www.youtube.com/c/nditcofficial',
    icon: <YouTubeIcon sx={{ fontSize: '2.2rem' }} />,
  },
  {
    name: 'Instagram',
    link: 'https://www.instagram.com/nditc.official/',
    icon: <InstagramIcon sx={{ fontSize: '2.2rem' }} />,
  },
]

export const infoTitles = {
  address: 'Address',
  className: 'class',
  email: 'email address',
  fb: 'fb',
  fullName: 'full name',
  institute: 'institute',
  phone: 'mobile number',
  qrCode: 'QR code',
  userName: 'username',
}

export const RegFormRules = [
  `After creating your account, you have to fill up the event-specific participation forms for your desired events.(Recommended for Participants)`,
  `If CA reference is unavailable, simply skip it`,
]

export const TeamFormRules = [
  `Only the Team Leader should fill up this form`,
  'If you are solo, then skip those member (email address) fields (A team can consist of only the Leader or with members less than the number of max-members also)',
]
export const SingleFormRules = []

export const transactionRules = [
  'Then give us the number (from which you sent the money) and the transaction id.',
  'Do not forget to keep proof of the payment.',
  'Your payment will be verified after being checked by the admin.',
]

export const classesOption = [
  { name: '6', value: '6' },
  { name: '7', value: '7' },
  { name: '8', value: '8' },
  { name: '9', value: '9' },
  { name: '10', value: '10' },
  { name: '11', value: '11' },
  { name: '12', value: '12' },
  { name: 'HSC-22', value: 'HSC-22' },
  { name: 'Polytechnic 1st year', value: 'Polytechnic1st' },
  { name: 'Polytechnic 2nd year', value: 'Polytechnic2nd' },
  { name: 'University', value: 'university' },
]

export const introDesc = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
                mollitia, molestiae quas vel sint commodi repudiandae
                consequuntur voluptatum laborum numquam blanditiis harum
                quisquam eius sed odit fugiat iusto fuga praesentium optio,
                eaque rerum! Provident similique accusantium nemo autem.`
