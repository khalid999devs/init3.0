import {
  DashboardOutlined,
  PeopleOutline,
  AssignmentIndOutlined,
  SettingsOutlined,
  ContactMailOutlined,
  SendOutlined,
  LocalActivity,
  Collections,
  QrCodeScanner,
} from '@mui/icons-material'

export const navitems = [
  {
    title: 'Dashboard',
    to: '/admin',
    icon: <DashboardOutlined />,
  },
  {
    title: 'Participants',
    to: 'participants',
    icon: <PeopleOutline />,
  },
  {
    title: 'CA',
    to: 'cas',
    icon: <AssignmentIndOutlined />,
  },
  {
    title: 'Contacts',
    to: 'contacts',
    icon: <ContactMailOutlined />,
  },
  {
    title: 'Settings',
    to: 'setting',
    icon: <SettingsOutlined />,
  },
  {
    title: 'Messages',
    to: 'messages',
    icon: <SendOutlined />,
  },
  {
    title: 'QR Admins',
    to: 'qrProfiles',
    icon: <QrCodeScanner />,
  },
  {
    title: 'Events',
    to: 'events',
    icon: <LocalActivity />,
  },
  {
    title: 'Gallery',
    to: 'gallery',
    icon: <Collections />,
  },
]
