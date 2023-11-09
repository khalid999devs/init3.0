import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Loader from './Loader'

//client
import Home from './Client/pages/Home'
import About from './Client/pages/About'
import Contact from './Client/pages/Contact'
import Client from './Client/pages/Client'
import CGallery from './Client/pages/Gallery'
import Event from './Client/pages/Event'
import CLogin from './Client/pages/Login'
import Registration from './Client/pages/Registration'
import FAQ from './Client/pages/FAQ'
import ParticipationForm from './Client/pages/ParticipationForm'
import Notices from './Client/pages/Notices'
import Cas from './Client/pages/Cas'
import ProblemSetters from './Client/pages/ProblemSetters'
import Developers from './Client/pages/Developers'

//profile client
import Profile from './Client/pages/Profile'
import PAbout from './Client/components/Profile/PAbout'
import PHome from './Client/components/Profile/PHome'
import ViewProfile from './Client/pages/ViewProfile'

//QR scanner
import QRLogin from './QR_scanner/QRLogin'
import Scanner from './QR_scanner/pages/Scanner'

import PError from './PError'

//Admin
const Login = lazy(() => import('./Admin/Login'))
const Admin = lazy(() => import('./Admin/pages/Admin'))
const Dashboard = lazy(() => import('./Admin/pages/Dashboard'))
const Participants = lazy(() => import('./Admin/pages/Participants'))
const CAs = lazy(() => import('./Admin/pages/CAs'))
const Messages = lazy(() => import('./Admin/pages/Messages'))
const Settings = lazy(() => import('./Admin/pages/Settings'))
const Contacts = lazy(() => import('./Admin/pages/Contacts'))
const QRProfiles = lazy(() => import('./Admin/pages/QRProfiles'))
const Gallery = lazy(() => import('./Admin/pages/Gallery'))
const Events = lazy(() => import('./Admin/pages/Events'))

// import Login from './Admin/Login'
// import Admin from './Admin/pages/Admin'
// import Dashboard from './Admin/pages/Dashboard'
// import Participants from './Admin/pages/Participants'
// import CAs from './Admin/pages/CAs'
// import Messages from './Admin/pages/Messages'
// import Settings from './Admin/pages/Settings'
// import Contacts from './Admin/pages/Contacts'
// import QRProfiles from './Admin/pages/QRProfiles'
// import Gallery from './Admin/pages/Gallery'
// import Events from './Admin/pages/Events'

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path='/' element={<Client />}>
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='setters' element={<ProblemSetters />} />
          <Route path='contact' element={<Contact />} />
          <Route path='gallery' element={<CGallery />} />
          <Route path='event/:event' element={<Event />} />
          <Route path='login' element={<CLogin />} />
          <Route path='registration/:mode' element={<Registration />} />

          <Route path='profile/:username' element={<Profile />}>
            <Route index element={<PHome />} />
            <Route path='about' element={<PAbout />} />
          </Route>
          <Route path='profile/view/:username' element={<ViewProfile />} />

          <Route path='faq' element={<FAQ />} />
          <Route
            path='participation/:type/:eventValue'
            element={<ParticipationForm />}
          />
          <Route path='notices' element={<Notices />} />
          <Route path='cas' element={<Cas />} />
          <Route path='developers' element={<Developers />} />
        </Route>

        <Route path='/adminLogin' element={<Login />} />
        <Route path='/admin' element={<Admin />}>
          <Route index element={<Dashboard />} />
          <Route path='participants' element={<Participants />} />
          <Route path='cas' element={<CAs />} />
          <Route path='messages' element={<Messages />} />
          <Route path='setting' element={<Settings />} />
          <Route path='contacts' element={<Contacts />} />
          <Route path='qrProfiles' element={<QRProfiles />} />
          <Route path='gallery' element={<Gallery />} />
          <Route path='events' element={<Events />} />
        </Route>

        <Route path='/qrLogin' element={<QRLogin />} />
        <Route path='/qrScanner' element={<Scanner />} />
        <Route path='/404' element={<PError />} />
        <Route path='*' element={<PError />} />
      </Routes>
    </Suspense>
  )
}

export default App
